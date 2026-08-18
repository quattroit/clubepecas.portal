import { AuthGuard } from "@/components/auth/AuthGuard";
import { SellerOnboardingGuard } from "@/components/auth/SellerOnboardingGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SellerOnboardingGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </SellerOnboardingGuard>
    </AuthGuard>
  );
}
