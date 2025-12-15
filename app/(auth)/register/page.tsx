import { Metadata } from "next";
import Link from "next/link";
import { Shield, CheckCircle } from "lucide-react";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez votre compte ConformLoi96 et commencez à vérifier vos documents",
};

/**
 * Page d'inscription
 */
export default function RegisterPage() {
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
              Créer votre compte
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Commencez avec 5 vérifications gratuites par mois.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>

      {/* Panneau droit - Avantages */}
      <div className="hidden lg:block lg:flex-1 bg-primary">
        <div className="flex h-full flex-col justify-center px-12 text-primary-foreground">
          <h3 className="text-2xl font-bold mb-8">
            Pourquoi choisir ConformLoi96?
          </h3>

          <ul className="space-y-6">
            <li className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Analyse IA instantanée</h4>
                <p className="text-sm opacity-80">
                  Notre IA détecte automatiquement les non-conformités à la Loi
                  96 en quelques secondes.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Suggestions précises</h4>
                <p className="text-sm opacity-80">
                  Recevez des corrections adaptées pour chaque problème détecté.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Export PDF conforme</h4>
                <p className="text-sm opacity-80">
                  Générez des documents bilingues avec le français en premier.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Sécurité garantie</h4>
                <p className="text-sm opacity-80">
                  Vos documents sont chiffrés et jamais partagés.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-12 p-6 bg-white/10 rounded-lg">
            <p className="text-sm">
              <strong>Offre de lancement:</strong> 5 vérifications gratuites
              chaque mois, sans engagement. Passez au Pro à seulement 19$/mois
              pour des vérifications illimitées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
