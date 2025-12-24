import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <header className="border-b">
        <div className="container flex items-center h-16 px-4">
          <Link
            href="/"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          <div className="ml-auto">
            <Link href="/" className="font-semibold text-primary">
              Loi96.ca
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer simple */}
      <footer className="border-t py-8 mt-12">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Loi96.ca. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/conditions" className="hover:underline">
              Conditions
            </Link>
            <Link href="/confidentialite" className="hover:underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
