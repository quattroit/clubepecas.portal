# Arquitetura financeira — Épico 8 (Pagamentos e Assinaturas)

Documento de referência do domínio financeiro do ClubePeças.

**Sprint 8.1:** domínio local + `NullPaymentProvider`.  
**Sprint 8.2:** integração Asaas (Hosted Checkout, Sandbox) via `IPaymentProvider`.  
**Sprint 8.3:** webhooks Asaas, ativação automática, grace period e reconciliação manual.

---

## 1. Modelo financeiro

| Conceito | Responsabilidade |
|----------|------------------|
| **Payment** | Registro financeiro oficial da plataforma (qualquer movimentação) |
| **SellerSubscription** | Ciclo de vida da assinatura (ativo, pendente, cancelado, expirado, renovação) |
| **SubscriptionPlan** | Catálogo de planos (preço, limites) |
| **WebhookEvent** | Envelope bruto do provedor + idempotência (`ExternalId` único) |
| **Money** | Value object monetário (`Amount` + `Currency`) |

---

## 2. Fluxo Hosted Checkout (Sprint 8.2)

```
Vendedor escolhe plano → POST /seller/subscription/checkout
→ Customer + Subscription Pending + Payment Pending
→ Redirect Asaas Hosted Checkout
```

Plano **R$ 0**: ativação local sem Asaas (`ActivatedWithoutCheckout`).

Endereço do checkout vem do **perfil do vendedor** (CEP, logradouro, número, bairro).

---

## 3. Fluxo de webhook (Sprint 8.3)

```
Asaas POST /api/v1/payments/webhooks/asaas
        │
        ├─ valida header asaas-access-token (= Payments:Asaas:WebhookToken)
        ▼
ProcessAsaasWebhook.Handler
        │
        ▼
IPaymentService.ProcessWebhookAsync
        │
        ├─ ExternalId já Processed? → 200 (idempotente)
        ├─ Persiste WebhookEvent
        ├─ Despacha por event oficial:
        │     PAYMENT_RECEIVED / PAYMENT_CONFIRMED → MarkPaid + Activate
        │     PAYMENT_OVERDUE → MarkExpired + GracePeriod
        │     PAYMENT_DELETED → MarkCancelled
        │     PAYMENT_REFUNDED → MarkRefunded + Cancel subscription
        │     SUBSCRIPTION_DELETED / INACTIVATED → Cancel
        │     SUBSCRIPTION_UPDATED → nextDueDate / status
        ├─ MarkProcessed + ProcessedAtUtc
        └─ Auditoria webhook.* / payment.* / subscription.*
```

Correlação local: `externalReference = payment:{id}`, depois `ExternalPaymentId` (`pay_…`) e `ExternalSubscriptionId` (`sub_…`).

### Ativação

```
PAYMENT_CONFIRMED | PAYMENT_RECEIVED
→ Payment.MarkPaid
→ SellerSubscription.ActivateFromCheckout (Pending → Active)
→ CurrentPaymentId / NextBillingDateUtc / GracePeriodUntilUtc=null
```

### Vencimento + Grace Period

```
PAYMENT_OVERDUE
→ Payment.MarkExpired (se Pending/Processing)
→ GracePeriodUntilUtc = now + Payments:GracePeriodDays
→ Subscription permanece Pending (ou Active em renovação)
→ Em webhooks/sync posteriores: se GracePeriodUntilUtc passou → Expire
```

### Cancelamento / reembolso

```
SUBSCRIPTION_DELETED | SUBSCRIPTION_INACTIVATED → Cancel / CancelPending
PAYMENT_REFUNDED → MarkRefunded + Cancel assinatura Active
```

---

## 4. Reconciliação manual

```
POST /api/v1/admin/payments/{paymentId}/sync
→ IPaymentProvider.GetPaymentAsync / GetSubscriptionAsync
→ Atualiza Payment + SellerSubscription
→ Auditoria webhook.sync
```

Uso: suporte e recuperação de inconsistências (sem editar banco manualmente).

---

## 5. Idempotência de webhooks

1. Busca `WebhookEvent` com mesmo `Provider` + `ExternalId` + `Processed=true`  
2. Se existir → retorna 200 sem reprocessar  
3. Senão → persiste, processa, `MarkProcessed()`  
4. Índice único filtrado: `UX_WebhookEvents_ExternalId` (`ExternalId IS NOT NULL`)

Asaas entrega *at least once* — duplicados são esperados.

---

## 6. Máquina de estados (Payment)

```
Pending    → Processing, Paid, Cancelled, Failed, Expired
Processing → Paid, Cancelled, Failed, Expired
Paid       → Refunded
Cancelled / Failed / Expired / Refunded → (terminal)
```

Transições inválidas lançam exceção (`PaymentStatusTransitions`).

`SellerSubscription.Expire()` aceita **Active** ou **Pending**.

---

## 7. Segurança do webhook

| Checagem | Detalhe |
|----------|---------|
| `asaas-access-token` | Comparação em tempo constante com `WebhookToken` |
| Token vazio | 503 `payment.webhook.configuration` |
| Token inválido | 401 |
| User-Agent | Log debug (não bloqueia) |

Nunca usar a API Key do Asaas como `WebhookToken`.

---

## 8. API (Sprint 8.3)

| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/v1/payments/webhooks/asaas` | Token Asaas |
| GET | `/api/v1/admin/payments` | Admin |
| POST | `/api/v1/admin/payments/{id}/sync` | Admin |
| GET | `/api/v1/seller/subscription` | Seller (Active **ou** Pending) |

---

## 9. `IPaymentService` (métodos 8.3)

- `ProcessWebhookAsync`
- `ActivateSubscriptionAsync`
- `ExpireSubscriptionAsync`
- `CancelSubscriptionAsync` (Pending ou Active)
- `RefundPaymentAsync`
- `SyncPaymentWithProviderAsync`

---

## 10. Auditoria

| Action | Quando |
|--------|--------|
| `webhook.received` / `processed` / `ignored` | Ciclo do webhook |
| `webhook.sync` | Sync admin |
| `payment.received` / `confirmed` / `overdue` / `refunded` / `cancelled` | Eventos de pagamento |
| `subscription.activated` / `expired` / `cancelled` | Ciclo da assinatura |

Logs: evento, tempo, IDs internos — **sem** API Key, PII ou payload completo sensível.

---

## 11. Frontend

- **Meu Plano:** badges Pending / Active / Grace Period / Expired / Cancelled; refetch a cada 15s se Pending  
- **Admin / Pagamentos:** listagem + botão **Sincronizar com Asaas** + último webhook  

---

## 12. Configuração

```json
"Payments": {
  "GracePeriodDays": 3,
  "Asaas": {
    "WebhookToken": "<token do painel Asaas, 32–255 chars>"
  }
}
```

No painel Asaas, aponte o webhook para:

`https://{api}/api/v1/payments/webhooks/asaas`

Eventos recomendados: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `SUBSCRIPTION_UPDATED`, `SUBSCRIPTION_DELETED`, `SUBSCRIPTION_INACTIVATED`.

---

## 13. Fora de escopo (Épico 8)

Troca/upgrade/downgrade de plano, cupom, split, jobs de cobrança dedicados, mensageria, Redis, e-mail de cobrança.
