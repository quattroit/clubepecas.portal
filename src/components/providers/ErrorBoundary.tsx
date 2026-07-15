"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Boundary minimalista — captura erros de renderização na árvore React.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[40vh] w-full max-w-lg flex-col items-center justify-center gap-4 p-6">
          <ErrorMessage
            title="Erro inesperado"
            message="Ocorreu um problema ao exibir esta página. Tente novamente."
          />
          <Button variant="secondary" onClick={this.handleReset}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
