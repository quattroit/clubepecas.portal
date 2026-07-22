import { AuthLayout } from "@/components/layout/AuthLayout";

export default function RepresentativeAuthRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
