import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AdminFilterBar,
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminTableSkeleton,
} from "@/components/admin";
import { ROUTES } from "@/constants/routes";
import { AdminAnalyticsView } from "@/features/admin/components/AdminAnalyticsView";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics administrativo do marketplace ClubePeças.",
  robots: { index: false, follow: false },
};

function AnalyticsPageFallback() {
  return (
    <AdminPage
      title="Analytics"
      description="Visão executiva do marketplace — crescimento, rankings e conversão."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Analytics" },
      ]}
    >
      <AdminFilterBar />
      <AdminSection title="Resumo executivo">
        <AdminStatsGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <AdminMetricCardSkeleton key={index} />
          ))}
        </AdminStatsGrid>
      </AdminSection>
      <AdminSection title="Rankings">
        <AdminTableSkeleton columns={6} rows={5} />
      </AdminSection>
    </AdminPage>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageFallback />}>
      <AdminAnalyticsView />
    </Suspense>
  );
}
