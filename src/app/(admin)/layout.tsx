import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthGuard>
  );
}
