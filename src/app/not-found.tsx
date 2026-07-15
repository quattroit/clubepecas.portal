import type { Metadata } from "next";

import { NotFound } from "@/components/feedback/NotFound";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página solicitada não foi encontrada.",
};

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <NotFound />
    </PublicLayout>
  );
}
