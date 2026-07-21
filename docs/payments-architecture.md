# Arquitetura financeira — Épico 8 (Pagamentos e Assinaturas)

Documento de referência do domínio financeiro do ClubePeças.

**Sprint 8.1:** domínio local + `NullPaymentProvider`.  
**Sprint 8.2:** integração Asaas (Hosted Checkout, Sandbox) via `IPaymentProvider`.  
**Sprint 8.3:** webhooks Asaas, ativação automática, grace period e reconciliação manual.  
**Sprint 8.3.1:** modelo comercial com múltiplas recorrências (`SubscriptionPlanPrice` + `BillingCycle`).  
**Sprint 8.4:** Central de Gestão da Assinatura (`SubscriptionSummaryService` + Meu Plano consolidado).  
**Sprint 8.5:** Upgrade, downgrade agendado, alteração de ciclo, cancelamento de renovação e reativação (`SubscriptionChangeService`).  
**Sprint 8.6:** Recuperação de pagamentos, nova cobrança, jobs financeiros, notificações e dashboards (`PaymentAutomationService` + `FinancialDashboardService`).

---

## 1. Modelo financeiro

| Conceito | Responsabilidade |
|----------|------------------|
| **Payment** | Registro financeiro oficial (+ `BillingCycle` da cobrança) |
| **SellerSubscription** | Ciclo de vida da assinatura (+ `BillingCycle` contratado) |
| **SubscriptionPlan** | Produto comercial (nome, limites, recursos) — **sem preço** |
| **SubscriptionPlanPrice** | Opções comerciais do plano (preço + recorrência + Money) |
| **WebhookEvent** | Envelope bruto do provedor + idempotência (`ExternalId` único) |
| **Money** | Value object monetário (`Amount` + `Currency`) |
| **BillingCycle** | `Monthly`, `Quarterly`, `Yearly` (extensível) |

---

## 1.1 Modelo comercial (Sprint 8.3.1)

```
SubscriptionPlan
 └── SubscriptionPlanPrices[]
       ├── BillingCycle (Monthly | Quarterly | Yearly)
       ├── Money (Price + Currency)
       ├── DisplayName / Description
       ├── IsActive / DisplayOrder
```

- Um plano pode ter várias recorrências; **não há duplicidade** do mesmo `BillingCycle` no mesmo plano.
- Plano sem recorrência ativa **não pode** ser contratado.
- Descontos **não** são armazenados: a API calcula economia dinamicamente vs. mensal (`PlanPricingCalculator`).
- Frontend **nunca** calcula preço/desconto — consome `prices[]` da API.

### Fluxo de contratação

```
Plano → Recorrência → POST /seller/subscription/checkout { planId, billingCycle }
→ Resolve SubscriptionPlanPrice
→ Payment + SellerSubscription (com BillingCycle)
→ Asaas Cycle = MONTHLY | QUARTERLY | YEARLY
→ Hosted Checkout
```

### Fluxo de renovação

```
PrepareRenewalAsync
→ usa SellerSubscription.BillingCycle
→ busca SubscriptionPlanPrice ativa daquele ciclo
→ cria Payment (Renewal) com o mesmo BillingCycle
```

### Economia (API)

Comparando com o preço mensal do mesmo plano:

- `equivalentMonthlyPrice = price / months`
- `savingsAmount = (monthly * months) - price` (se > 0)
- `savingsPercent` arredondado
- `isRecommended = true` na recorrência **Yearly** quando existir

---

## 2. Fluxo Hosted Checkout (Sprint 8.2)

```
Vendedor escolhe plano + recorrência → POST /seller/subscription/checkout
→ Customer + Subscription Pending + Payment Pending (BillingCycle)
→ Redirect Asaas Hosted Checkout (Cycle conforme BillingCycle)
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

## 8. API (Sprint 8.3 / 8.4)

| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/v1/payments/webhooks/asaas` | Token Asaas |
| GET | `/api/v1/admin/payments` | Admin |
| POST | `/api/v1/admin/payments/{id}/sync` | Admin |
| GET | `/api/v1/seller/subscription` | Seller — resumo consolidado (8.4/8.5) |
| GET | `/api/v1/seller/subscription/payments` | Seller — histórico financeiro |
| GET | `/api/v1/seller/subscription/history` | Seller — eventos (audit + webhooks) |
| PUT | `/api/v1/seller/subscription/upgrade` | Seller — upgrade via Hosted Checkout |
| PUT | `/api/v1/seller/subscription/downgrade` | Seller — agenda downgrade |
| PUT | `/api/v1/seller/subscription/change-billing-cycle` | Seller — troca de ciclo via checkout |
| PUT | `/api/v1/seller/subscription/cancel` | Seller — cancela renovação (soft) |
| PUT | `/api/v1/seller/subscription/reactivate` | Seller — reativa após CancellationRequested |
| DELETE | `/api/v1/seller/subscription` | Seller — alias do soft-cancel (8.5) |
| POST | `/api/v1/seller/subscription/retry-payment` | Seller — recupera pagamento pendente (8.6) |
| POST | `/api/v1/seller/subscription/new-charge` | Seller — gera nova cobrança (8.6) |
| GET | `/api/v1/admin/financial/dashboard` | Admin — dashboard financeiro (8.6) |

### 8.1 Central de Gestão — `GET /seller/subscription`

Retorno consolidado via `ISubscriptionSummaryService` / `SubscriptionSummaryService`:

| Bloco | Conteúdo |
|-------|----------|
| Assinatura | Status, ciclo, valor, períodos, próxima cobrança, dias restantes, grace |
| `Plan` | Nome, limite, usados, restantes, `%` cota |
| `Financial` | Total pago, LTV, próximas faturas, economias, `PaymentLink`, pendências |
| `Indicators` | Cores, flags (`IsNearExpiration`, `IsGracePeriod`, …) — **prontos para UI** |
| `Messages` | Textos amigáveis (sem regra no frontend) |
| `Timeline` | Criação, pagamentos, renovações, grace, próxima cobrança, expiração |
| `Actions` | Inclui `CanRetryPayment`, `CanNewCharge`, `CanSyncPayment`, … |
| `AvailablePlans` | Planos + ciclos (`SubscriptionPlanPriceId`) + economia — base para 8.5 |
| `PendingChange` | Plano/ciclo/preço/data efetiva agendados |
| `CancellationRequested` | Flag de cancelamento de renovação |

Não altera estado financeiro na leitura. Não consulta Asaas nestas leituras.

### 8.2 Operações de alteração (Sprint 8.5) — `ISubscriptionChangeService`

| Operação | Comportamento |
|----------|---------------|
| **Upgrade** | Valida plano superior → agenda Pending → Hosted Checkout (ou aplica imediatamente se R$ 0) → no pagamento aprovado aplica + cancela recorrência antiga |
| **Downgrade** | **Nunca imediato** — grava Pending* com `PendingEffectiveDate` = fim do período; atualiza valor/ciclo no Asaas para a próxima cobrança |
| **Change billing cycle** | Mesmo plano, outro ciclo → fluxo semelhante ao upgrade (novo checkout) |
| **Cancel renewal** | Cancela recorrência no gateway → `CancellationRequested` → benefícios até `EndDate`/`NextBilling` |
| **Reactivate** | Somente `CancellationRequested` → recria recorrência no gateway → `Active` |

Campos em `SellerSubscription`: `PendingSubscriptionPlanId`, `PendingSubscriptionPlanPriceId`, `PendingBillingCycle`, `PendingEffectiveDate`.  
Status novo: `CancellationRequested`.

Aplicação automática: `TryApplyPendingChangesAsync` (webhooks de pagamento aprovado + sync manual). Idempotente.

Auditoria: `subscription.upgrade.requested|completed`, `subscription.downgrade.scheduled|applied`, `subscription.billing_cycle.changed`, `subscription.cancellation.requested`, `subscription.reactivated`.

### 8.3 Contratos auxiliares (8.4)

- `SubscriptionPaymentItem` — pagamentos locais (InvoiceUrl/ReceiptUrl do `MetadataJson`)
- `SubscriptionHistoryItem` — `AuditLog` filtrado + `WebhookEvent` correlacionado

### 8.4 Automação financeira (Sprint 8.6) — `IPaymentAutomationService`

Centraliza recuperação e jobs. Usado por endpoints seller, `PaymentAutomationHostedService` (intervalo ~1h) e futuras automações.

| Operação | Comportamento |
|----------|---------------|
| **Retry payment** | Localiza pendência → atualiza invoice/checkout no gateway ou gera nova cobrança → auditoria `payment.retry` |
| **New charge** | Cancela cobranças abertas → `CreatePaymentAsync` no `IPaymentProvider` → metadata com `invoiceUrl` → `payment.new_charge.created` |
| **Expire grace** | Assinaturas com grace vencido → `Expired` + `subscription.grace.expired` |
| **Apply pending** | Downgrades/upgrades/ciclos com `PendingEffectiveDate` vencida → `TryApplyPendingChangesAsync` |
| **Due tomorrow** | Notifica cobranças com vencimento no dia seguinte |
| **Sync stale** | `SyncPaymentWithProviderAsync` em pendentes com `ExternalPaymentId` |
| **Reprocess webhooks** | Eventos não processados com `Attempts > 0` — idempotente via `ProcessWebhookAsync` |
| **Cleanup** | Remove webhooks processados com > 90 dias (não remove auditoria) |

Notificações: `IFinancialNotifier` / `FinancialNotifier` (templates `FinancialEmailTemplates` + layout existente).  
Dashboard admin: `IFinancialDashboardService` — MRR/ARR, receita, assinaturas, cobranças, planos, ciclos, ticket, churn, conversão, inadimplência.

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
| `webhook.reprocessed` | Reprocessamento pelo job (8.6) |
| `payment.received` / `confirmed` / `overdue` / `refunded` / `cancelled` | Eventos de pagamento |
| `payment.retry` / `payment.new_charge.created` | Recuperação (8.6) |
| `payment.financial_sync.executed` | Pacote de jobs (8.6) |
| `subscription.activated` / `expired` / `cancelled` | Ciclo da assinatura |
| `subscription.grace.expired` | Expiração automática do grace (8.6) |
| `subscription.pending.applied_by_job` | Alteração pendente pelo job (8.6) |

Logs: evento, tempo, IDs internos — **sem** API Key, PII ou payload completo sensível.

---

## 11. Frontend

- **/planos:** opções Mensal / Trimestral / Anual com economia e selo “Melhor custo-benefício” (dados da API)
- **Meu Plano (`/painel/meu-plano`) — Sprint 8.4/8.5/8.6:** resumo financeiro (total pago, LTV, economias), **Pagar agora** / **Gerar nova cobrança**, operações de plano; **sem regras de negócio no cliente**
- **Checkout (Meu Plano):** plano → recorrência → checkout com `billingCycle` (novos e upgrades)
- **Admin / Planos:** CRUD de recorrências e preços
- **Admin / Pagamentos:** listagem + sync Asaas
- **Admin / Financeiro (`/admin/financeiro`) — Sprint 8.6:** MRR/ARR, receita, indicadores, distribuição por plano e ciclo

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

Cupom, split, mensageria externa (fila), Redis.
