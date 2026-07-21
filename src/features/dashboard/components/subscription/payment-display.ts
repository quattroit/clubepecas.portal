import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "@/contracts/common/enums";

const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Pendente",
  [PaymentStatus.Processing]: "Processando",
  [PaymentStatus.Paid]: "Pago",
  [PaymentStatus.Cancelled]: "Cancelado",
  [PaymentStatus.Failed]: "Falhou",
  [PaymentStatus.Expired]: "Expirado",
  [PaymentStatus.Refunded]: "Reembolsado",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Unknown]: "Não definido",
  [PaymentMethod.Pix]: "PIX",
  [PaymentMethod.CreditCard]: "Cartão de crédito",
  [PaymentMethod.Boleto]: "Boleto",
  [PaymentMethod.BankTransfer]: "Transferência",
};

const paymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.Subscription]: "Assinatura",
  [PaymentType.Renewal]: "Renovação",
  [PaymentType.Refund]: "Reembolso",
  [PaymentType.Credit]: "Crédito",
  [PaymentType.Discount]: "Desconto",
  [PaymentType.Adjustment]: "Ajuste",
};

function paymentStatusLabel(status: PaymentStatus | null | undefined): string {
  if (status == null) {
    return "—";
  }
  return paymentStatusLabels[status] ?? "—";
}

function paymentMethodLabel(method: PaymentMethod | null | undefined): string {
  if (method == null) {
    return "—";
  }
  return paymentMethodLabels[method] ?? "—";
}

function paymentTypeLabel(type: PaymentType): string {
  return paymentTypeLabels[type] ?? "—";
}

export {
  paymentMethodLabel,
  paymentStatusLabel,
  paymentTypeLabel,
};
