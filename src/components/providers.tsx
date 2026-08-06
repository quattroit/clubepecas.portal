"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthQuerySync } from "@/components/providers/AuthQuerySync";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import { QuotationDraftProvider } from "@/components/providers/QuotationDraftProvider";
import { ReferralProvider } from "@/components/providers/ReferralProvider";
import { RepresentativeAuthProvider } from "@/components/providers/RepresentativeAuthProvider";
import { RepresentativeAuthQuerySync } from "@/components/providers/RepresentativeAuthQuerySync";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { makeQueryClient } from "@/lib/query-client";

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Infraestrutura global da aplicação.
 */
function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RepresentativeAuthProvider>
            <ReferralProvider>
              <QuotationDraftProvider>
                <AuthQuerySync />
                <RepresentativeAuthQuerySync />
                <ErrorBoundary>
                  {children}
                  <Toaster position="top-right" richColors closeButton />
                </ErrorBoundary>
              </QuotationDraftProvider>
            </ReferralProvider>
          </RepresentativeAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export { Providers };
