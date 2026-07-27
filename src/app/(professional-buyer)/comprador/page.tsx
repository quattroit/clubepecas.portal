import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprador profissional",
  description: "Área do comprador profissional no ClubePeças.",
  robots: { index: false, follow: false },
};

export default function ProfessionalBuyerDashboardPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-h1 text-foreground">Bem-vindo ao ClubePeças</h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        Em breve você poderá enviar solicitações de peças para diversos
        fornecedores simultaneamente através da plataforma.
      </p>
    </div>
  );
}
