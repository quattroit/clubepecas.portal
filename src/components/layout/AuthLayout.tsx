import { Logo } from "@/components/layout/Logo";
import { APP_NAME } from "@/constants/app";
import { Card, CardContent } from "@/components/ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col">
      <div className="surface-brand border-brand-border border-b px-4 py-6">
        <div className="mx-auto flex max-w-md justify-center">
          <Logo size="lg" priority onBrand className="w-full justify-center" />
        </div>
      </div>

      <main
        id="conteudo-principal"
        className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-10"
      >
        <Card className="w-full shadow-md">
          <CardContent className="pt-2 sm:px-6 sm:pt-4 sm:pb-6">
            {children}
          </CardContent>
        </Card>
      </main>

      <footer className="text-small py-6 text-center">
        <p>{APP_NAME} — acesso seguro à sua conta</p>
      </footer>
    </div>
  );
}

export { AuthLayout };
