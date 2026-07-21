# Arquitetura financeira — Épico 8 (Pagamentos e Assinaturas)

Documento de referência do domínio financeiro do ClubePeças.

**Sprint 8.1:** domínio local + `NullPaymentProvider`.  
**Sprint 8.2:** integração Asaas (Hosted Checkout, Sandbox) via `IPaymentProvider`.  
**Sprint 8.3 (futura):** webhooks e ativação automática pós-pagamento.

---

## 1. Modelo financeiro

| Conceito | Responsabilidade |
|----------|------------------|
| **Payment** | Registro financeiro oficial da plataforma (qualquer movimentação) |
| **SellerSubscription** | Ciclo de vida da assinatura (ativo, pendente, cancelado, renovação) |
| **SubscriptionPlan** | Catálogo de planos (preço, limites) |
| **WebhookEvent** | Envelope bruto de eventos do provedor (preparação Sprint 8.3) |
| **Money** | Value object monetário (`Amount` + `Currency`) |

`Payment` **não** é apenas uma cobrança. Representa:

- assinatura inicial (`Subscription`)
- renovação (`Renewal`)
- reembolso (`Refund`)
- crédito (`Credit`)
- desconto (`Discount`)
- ajuste (`Adjustment`)

---

## 2. Fluxo completo (Sprint 8.2 — Asaas Hosted Checkout)

```
Vendedor escolhe plano (Meu Plano)
        │
        ▼
POST /api/v1/seller/subscription/checkout
        │
        ▼
IPaymentService.StartSubscriptionCheckoutAsync
        │
        ├─ valida documento fiscal, plano, assinatura ativa
        ├─ idempotência (reutiliza checkout Pending não expirado)
        ├─ IPaymentProvider.EnsureCustomerAsync
        │       ├─ reutiliza Seller.ExternalCustomerId
        │       └─ ou GET/POST /v3/customers (Asaas)
        ├─ SellerSubscription.CreatePending (Status=Pending)
        ├─ Payment (Status=Pending, Method=Unknown)
        ├─ IPaymentProvider.CreateSubscriptionAsync → POST /v3/subscriptions
        ├─ IPaymentProvider.CreateCheckoutAsync → POST /v3/checkouts (RECURRENT)
        ├─ persiste ExternalCustomerId, ExternalSubscriptionId, checkoutUrl
        └─ retorna CheckoutUrl
                │
                ▼
Frontend: window.location.href = CheckoutUrl
                │
                ▼
Asaas Hosted Checkout (cartão / PIX)
                │
                ▼
[Sprint 8.3] Webhook → Payment Paid → SellerSubscription Active
```

Nesta sprint **não** há webhook HTTP: a assinatura permanece `Pending` até a Sprint 8.3.

---

## 3. Entidades (campos externos Sprint 8.2)

### Seller
- `ExternalCustomerId` — ID do customer no Asaas

### SellerSubscription
- `ExternalSubscriptionId` — ID da assinatura no Asaas
- `Status = Pending` — aguardando conclusão do checkout
- `CurrentPaymentId`, `NextBillingDateUtc`, demais campos da Sprint 8.1

### Payment
Campos principais: `SellerId`, `SubscriptionId?`, `Provider`, `Status`, `Type`, `Method`, `Money`, `ExternalPaymentId`, `ExternalCustomerId`, `ExternalSubscriptionId`, `Reference`, `Description`, `MetadataJson` (contém `checkoutUrl`), `ExpiresAtUtc`.

---

## 4. Abstrações

### IPaymentProvider
Única porta para gateway. Métodos: `EnsureCustomerAsync`, checkout, criar/cancelar assinatura e pagamento, consultar, health-check.

Implementações:

| Classe | Uso |
|--------|-----|
| `NullPaymentProvider` | `DefaultProvider=None` — desenvolvimento sem gateway |
| `AsaasPaymentProvider` | `DefaultProvider=Asaas` — Sandbox/Produção |
| `PaymentProviderFactory` | Resolve provider via DI conforme config |

### IPaymentService
Orquestrador financeiro da Application. Checkout: `StartSubscriptionCheckoutAsync`.

A Application **nunca** referencia DTOs ou HTTP do Asaas.

---

## 5. Camada Infrastructure — Asaas

```
Domain command/response
        ↓
AsaasCheckoutMapper
        ↓
Asaas DTO (Requests/Responses)
        ↓
AsaasHttpClient (IHttpClientFactory)
        ↓
API Asaas
```

- **AsaasHttpClient:** headers `access_token`, `Accept`, `User-Agent`; timeout configurável; retry leve em erros transitórios.
- **Exceções:** `PaymentProviderException` e derivadas na **Application** (`CustomerCreationException`, `CheckoutCreationException`, etc.).
- **Logs:** customer criado/reutilizado, subscription, checkout, tempo de resposta. **Nunca** logar API Key, CPF/CNPJ ou payloads sensíveis.

---

## 6. Configuração

```json
{
  "Payments": {
    "DefaultProvider": "Asaas",
    "DefaultCurrency": "BRL",
    "GracePeriodDays": 3,
    "RetryAttempts": 3,
    "RetryIntervalHours": 24,
    "WebhookToleranceMinutes": 5,
    "Asaas": {
      "ApiKey": "",
      "BaseUrl": "https://api-sandbox.asaas.com",
      "Environment": "Sandbox",
      "TimeoutSeconds": 30,
      "WebhookToken": "",
      "CheckoutMinutesToExpire": 60,
      "UserAgent": "ClubePecas/1.0.0"
    }
  }
}
```

**Credenciais:** User Secrets ou variáveis de ambiente — nunca em código.

| Ambiente | BaseUrl | DefaultProvider |
|----------|---------|-----------------|
| Sandbox (dev) | `https://api-sandbox.asaas.com` | `Asaas` |
| Produção | `https://api.asaas.com` | `Asaas` |
| Local sem gateway | — | `None` |

---

## 7. Sequência de chamadas Asaas (Sandbox)

1. `GET /v3/customers?cpfCnpj={doc}` — buscar customer existente  
2. `POST /v3/customers` — criar se não existir  
3. `POST /v3/subscriptions` — assinatura recorrente mensal  
4. `GET /v3/cities?name={cidade}&state={UF}` — resolve `cityId` da loja do vendedor  
5. ViaCEP (`/ws/{UF}/{cidade}/Rua/json/`) — resolve CEP/logradouro reais da cidade da loja  
6. `POST /v3/checkouts` — Hosted Checkout (`chargeTypes: ["RECURRENT"]`, `billingTypes: ["CREDIT_CARD"]`)  
7. Resposta: `link` (URL de redirect) + `id` (ExternalCheckoutId)

Auth: header `access_token: {ApiKey}`.

Endereço do checkout é montado a partir da **cidade/UF da loja** (cityId Asaas + CEP ViaCEP). Não há endereço mockado em `appsettings`.

---

## 8. API pública (Sprint 8.2)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/seller/payments` | Histórico financeiro |
| POST | `/api/v1/seller/subscription/checkout` | Inicia Hosted Checkout |

Request checkout:

```json
{
  "subscriptionPlanId": 1,
  "successUrl": "https://app/meu-plano?checkout=success",
  "cancelUrl": "https://app/meu-plano?checkout=cancel",
  "expiredUrl": "https://app/meu-plano?checkout=expired"
}
```

---

## 9. Idempotência

Múltiplos cliques em **Assinar Plano** não criam customers/subscriptions/payments duplicados:

- Reutiliza `Seller.ExternalCustomerId`
- Reutiliza checkout `Pending` não expirado (`MetadataJson.checkoutUrl`)
- Bloqueia nova assinatura se já existir `Active`

---

## 10. Auditoria

| Action | Quando |
|--------|--------|
| `payment.customer.created` | Customer criado ou reutilizado no provedor |
| `payment.subscription.created` | Subscription criada no Asaas |
| `payment.checkout.created` | Checkout hospedado gerado |
| `payment.provider.error` | Falha mapeada do gateway (handler) |

---

## 11. Frontend

- **Meu Plano:** botão **Assinar Plano** → POST checkout → redirect Asaas  
- **Admin / vendedor:** seção financeira somente leitura (Provider, IDs externos, status)

---

## 12. Sprint 8.3 (preparado, não implementado)

- Endpoint HTTP de webhook Asaas  
- Persistir `WebhookEvent`  
- Atualizar `Payment` → `Paid` e `SellerSubscription` → `Active`  
- Renovações, cancelamentos automáticos, jobs  

**Não alterar** entidades ou contratos públicos para adicionar webhooks — apenas processar eventos recebidos.

---

## 13. O que NÃO está na Sprint 8.2

Webhook HTTP, renovação automática, cancelamento automático, reembolso, PIX/boleto manual, troca/downgrade/upgrade de plano, jobs, mensageria, Redis.
