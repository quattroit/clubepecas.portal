import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type PublicLayoutProps = {
  children: React.ReactNode;
};

function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col">
      <Header />
      <main
        id="conteudo-principal"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-14"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { PublicLayout };
