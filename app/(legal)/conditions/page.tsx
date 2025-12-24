import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Loi96.ca",
  description: "Conditions générales d'utilisation du service Loi96.ca",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Conditions d&apos;utilisation</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-6">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-CA")}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant le service Loi96.ca, vous acceptez d&apos;être lié par ces
            conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
            utiliser notre service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
          <p>
            Loi96.ca est un service d&apos;analyse automatisée de documents pour vérifier leur
            conformité à la Loi 96 du Québec (Loi sur la langue officielle et commune du Québec).
            Le service utilise l&apos;intelligence artificielle pour analyser vos documents et
            fournir des recommandations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Utilisation du service</h2>
          <p>Vous vous engagez à :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Utiliser le service uniquement à des fins légales</li>
            <li>Ne pas télécharger de contenu illégal, diffamatoire ou offensant</li>
            <li>Ne pas tenter de contourner les mesures de sécurité</li>
            <li>Ne pas utiliser le service pour du spam ou des activités malveillantes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Comptes utilisateurs</h2>
          <p>
            Vous êtes responsable de maintenir la confidentialité de votre compte et de votre
            mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation
            non autorisée de votre compte.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Abonnements et paiements</h2>
          <p>
            Certaines fonctionnalités nécessitent un abonnement payant. Les paiements sont
            traités par notre partenaire Paddle. Les abonnements sont renouvelés automatiquement
            sauf annulation de votre part.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Limitation de responsabilité</h2>
          <p>
            Loi96.ca fournit des analyses à titre indicatif uniquement. Nous ne garantissons pas
            que nos analyses sont exhaustives ou sans erreur. Pour toute question juridique
            concernant la Loi 96, veuillez consulter un professionnel qualifié.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Propriété intellectuelle</h2>
          <p>
            Le contenu du service, y compris les textes, graphiques, logos et logiciels, est
            la propriété de Loi96.ca et est protégé par les lois sur la propriété intellectuelle.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les
            modifications entreront en vigueur dès leur publication sur cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à :
            <a href="mailto:contact@loi96.ca" className="text-primary hover:underline ml-1">
              contact@loi96.ca
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
