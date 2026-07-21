"use client";

import { AdminPage, AdminSection, AdminTable } from "@/components/admin";
import { ROUTES } from "@/constants/routes";

type AdminPaymentRow = {
  id: number;
  seller: string;
  plan: string;
  amount: string;
  status: string;
  method: string;
  dueDate: string;
};

/**
 * Estrutura administrativa de pagamentos (Épico 8).
 * Sem integração com gateway — tabela vazia preparada para Sprint 8.2+.
 */
function AdminPaymentsView() {
  const rows: AdminPaymentRow[] = [];

  return (
    <AdminPage
      title="Pagamentos"
      description="Movimentações financeiras da plataforma (integração Asaas — somente leitura)."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Pagamentos" },
      ]}
    >
      <AdminSection title="Listagem">
        <AdminTable
          data={rows}
          getRowId={(row) => row.id}
          emptyTitle="Nenhum pagamento registrado"
          emptyDescription="Pagamentos registrados pelo domínio financeiro aparecerão aqui. Consulte o detalhe do vendedor para IDs externos do Asaas."
          columns={[
            {
              id: "id",
              header: "ID",
              cell: (row) => row.id,
            },
            {
              id: "seller",
              header: "Vendedor",
              cell: (row) => row.seller,
            },
            {
              id: "plan",
              header: "Plano",
              cell: (row) => row.plan,
            },
            {
              id: "amount",
              header: "Valor",
              cell: (row) => row.amount,
            },
            {
              id: "status",
              header: "Status",
              cell: (row) => row.status,
            },
            {
              id: "method",
              header: "Método",
              cell: (row) => row.method,
            },
            {
              id: "dueDate",
              header: "Vencimento",
              cell: (row) => row.dueDate,
            },
          ]}
        />
      </AdminSection>
    </AdminPage>
  );
}

export { AdminPaymentsView };
