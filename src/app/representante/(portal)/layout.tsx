"use client";

import { RepresentativeAuthGuard } from "@/components/auth/RepresentativeAuthGuard";
import { RepresentativeLayout } from "@/components/representative/RepresentativeLayout";

export default function RepresentativePortalRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RepresentativeAuthGuard>
      <RepresentativeLayout>{children}</RepresentativeLayout>
    </RepresentativeAuthGuard>
  );
}
