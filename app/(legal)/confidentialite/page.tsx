import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Loi96.ca",
  description: "Politique de confidentialité et protection des données de Loi96.ca",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-6">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-CA")}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Loi96.ca s&apos;engage à protéger votre vie privée. Cette politique explique comment
            nous collectons, utilisons et protégeons vos informations personnelles conformément
            à la Loi 25 du Québec et au RGPD.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Données collectées</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Informations de compte</strong> : nom, adresse courriel</li>
            <li><strong>Documents téléchargés</strong> : pour l&apos;analyse de conformité</li>
            <li><strong>Données d&apos;utilisation</strong> : historique des analyses, préférences</li>
            <li><strong>Informations de paiement</strong> : traitées par Paddle (nous ne stockons pas vos données de carte)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Fournir et améliorer notre service d&apos;analyse</li>
            <li>Gérer votre compte et vos abonnements</li>
            <li>Vous contacter concernant votre compte ou le service</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Traitement des documents</h2>
          <p>
            Les documents que vous téléchargez sont analysés par notre système d&apos;intelligence
            artificielle. Les documents sont stockés de manière sécurisée et ne sont jamais
            partagés avec des tiers. Vous pouvez supprimer vos documents à tout moment depuis
            votre tableau de bord.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Partage des données</h2>
          <p>
            Nous ne vendons jamais vos données. Nous pouvons partager des informations avec :
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Clerk</strong> : pour l&apos;authentification</li>
            <li><strong>Paddle</strong> : pour le traitement des paiements</li>
            <li><strong>Anthropic</strong> : pour l&apos;analyse IA (texte uniquement, anonymisé)</li>
            <li><strong>Autorités légales</strong> : si requis par la loi</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Sécurité</h2>
          <p>
            Nous utilisons des mesures de sécurité techniques et organisationnelles pour
            protéger vos données, incluant le chiffrement HTTPS, l&apos;authentification sécurisée
            et des sauvegardes régulières.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Vos droits</h2>
          <p>Conformément à la Loi 25 et au RGPD, vous avez le droit de :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger vos données inexactes</li>
            <li>Supprimer vos données</li>
            <li>Exporter vos données (portabilité)</li>
            <li>Retirer votre consentement</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Conservation des données</h2>
          <p>
            Nous conservons vos données tant que votre compte est actif. Après suppression
            de votre compte, vos données sont effacées dans un délai de 30 jours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Cookies</h2>
          <p>
            Nous utilisons des cookies essentiels pour le fonctionnement du service
            (authentification, préférences). Nous n&apos;utilisons pas de cookies publicitaires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
          <p>
            Pour toute question sur cette politique ou pour exercer vos droits :
            <a href="mailto:privacy@loi96.ca" className="text-primary hover:underline ml-1">
              privacy@loi96.ca
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
