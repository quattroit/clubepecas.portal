import { Logo } from "@/components/layout/Logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col">
      <main
        id="conteudo-principal"
        className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-4 py-10 sm:gap-10"
      >
        <Logo size="lg" priority className="w-full justify-center" />
        <div className="w-full">{children}</div>
      </main>

      <footer className="text-small py-6 text-center">
        <p>ClubePeças — Autenticação</p>
      </footer>
    </div>
  );
}

export { AuthLayout };
