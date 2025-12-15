import { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte ConformLoi96",
};

/**
 * Page de connexion
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche - Formulaire */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ConformLoi96</span>
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Connexion à votre compte
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez à votre tableau de bord pour vérifier vos documents.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Panneau droit - Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-primary">
        <div className="flex h-full flex-col justify-center px-12 text-primary-foreground">
          <blockquote className="space-y-4">
            <p className="text-lg">
              &ldquo;ConformLoi96 nous a permis de vérifier tous nos documents
              commerciaux en quelques minutes. Un outil indispensable pour les
              PME québécoises.&rdquo;
            </p>
            <footer className="text-sm opacity-80">
              — Marie Gagnon, Directrice, Entreprise XYZ
            </footer>
          </blockquote>

          <div className="mt-12 grid grid-cols-3 gap-8 opacity-80">
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm">Documents analysés</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Entreprises</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
