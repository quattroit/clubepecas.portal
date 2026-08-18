import { ProfessionalBuyerAuthGuard } from "@/components/auth/ProfessionalBuyerAuthGuard";
import { ProfessionalBuyerLayout } from "@/components/professional-buyer/ProfessionalBuyerLayout";

export default function ProfessionalBuyerRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProfessionalBuyerAuthGuard>
      <ProfessionalBuyerLayout>{children}</ProfessionalBuyerLayout>
    </ProfessionalBuyerAuthGuard>
  );
}
