import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SubscriptionSummarySkeleton() {
  return (
    <Card aria-busy="true" aria-label="Carregando resumo do plano">
      <CardHeader className="gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-4">
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionUsageSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Carregando uso do plano">
      <CardHeader className="gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}

function AvailablePlansSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Carregando planos disponíveis">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

function SubscriptionHistorySkeleton() {
  return (
    <Card aria-busy="true" aria-label="Carregando histórico">
      <CardHeader>
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export {
  SubscriptionSummarySkeleton,
  SubscriptionUsageSkeleton,
  AvailablePlansSkeleton,
  SubscriptionHistorySkeleton,
};
