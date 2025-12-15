import { Shield } from "lucide-react";
import Link from "next/link";

// ===========================================
// Layout pour les pages d'authentification
// ===========================================

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient text-white p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <span className="text-xl font-bold">ConformLoi96</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Assurez la conformité de vos documents à la Loi 96
          </h1>
          <p className="text-lg text-white/80">
            Analyse automatique par IA de vos factures, contrats et textes 
            pour garantir la prédominance du français selon les exigences québécoises.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Détection intelligente des non-conformités",
              "Suggestions de corrections automatiques",
              "Génération de documents bilingues conformes",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/60">
          © 2024 ConformLoi96. Tous droits réservés.
        </p>
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">ConformLoi96</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
