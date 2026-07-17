"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthQuerySync } from "@/components/providers/AuthQuerySync";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
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
          <AuthQuerySync />
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export { Providers };
