import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Loi96.ca",
  description:
    "Politique de confidentialité et protection des données personnelles de Loi96.ca",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-[#003DA5] hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l&apos;accueil
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8 text-lg">
            Chez Loi96.ca, nous accordons une importance primordiale à la
            protection de vos données personnelles. Cette politique de
            confidentialité explique comment nous collectons, utilisons et
            protégeons vos informations.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Responsable du traitement
            </h2>
            <p className="text-gray-700 mb-4">
              Le responsable du traitement des données personnelles est :
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li>
                <strong>Entreprise :</strong> [Nom de l&apos;entreprise]
              </li>
              <li>
                <strong>Adresse :</strong> [Adresse], Québec, Canada
              </li>
              <li>
                <strong>Courriel :</strong>{" "}
                <a
                  href="mailto:privacy@loi96.ca"
                  className="text-[#003DA5] hover:underline"
                >
                  privacy@loi96.ca
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Données collectées
            </h2>
            <p className="text-gray-700 mb-4">
              Nous collectons les types de données suivants :
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              2.1 Données d&apos;identification
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Adresse courriel</li>
              <li>Nom et prénom (si fournis)</li>
              <li>Photo de profil (si connexion via Google)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              2.2 Données d&apos;utilisation
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Documents soumis pour analyse (texte extrait uniquement)</li>
              <li>Historique des analyses effectuées</li>
              <li>Résultats des vérifications de conformité</li>
              <li>Date et heure des connexions</li>
              <li>Adresse IP</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              2.3 Données de paiement
            </h3>
            <p className="text-gray-700 mb-4">
              Les paiements sont traités par notre partenaire Paddle. Nous ne
              stockons pas vos informations de carte de crédit. Paddle collecte
              les informations nécessaires au traitement des paiements
              conformément à sa propre{" "}
              <a
                href="https://www.paddle.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#003DA5] hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Finalités du traitement
            </h2>
            <p className="text-gray-700 mb-4">
              Vos données sont utilisées pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Fourniture du service :</strong> Analyser vos documents
                et vous fournir des rapports de conformité à la Loi 96
              </li>
              <li>
                <strong>Gestion de compte :</strong> Créer et gérer votre compte
                utilisateur
              </li>
              <li>
                <strong>Facturation :</strong> Traiter vos paiements et gérer
                vos abonnements
              </li>
              <li>
                <strong>Amélioration du service :</strong> Analyser
                l&apos;utilisation pour améliorer nos fonctionnalités
              </li>
              <li>
                <strong>Communication :</strong> Vous envoyer des notifications
                importantes concernant votre compte
              </li>
              <li>
                <strong>Conformité légale :</strong> Respecter nos obligations
                légales et réglementaires
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Base légale du traitement
            </h2>
            <p className="text-gray-700 mb-4">
              Le traitement de vos données repose sur les bases légales
              suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Exécution du contrat :</strong> Le traitement est
                nécessaire à l&apos;exécution du service que vous avez demandé
              </li>
              <li>
                <strong>Consentement :</strong> Pour certains traitements
                optionnels (ex: newsletter)
              </li>
              <li>
                <strong>Intérêt légitime :</strong> Pour améliorer nos services
                et assurer la sécurité
              </li>
              <li>
                <strong>Obligation légale :</strong> Pour respecter nos
                obligations fiscales et comptables
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Partage des données
            </h2>
            <p className="text-gray-700 mb-4">
              Vos données peuvent être partagées avec les tiers suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Clerk :</strong> Authentification et gestion des
                identités (États-Unis)
              </li>
              <li>
                <strong>Anthropic :</strong> Traitement des analyses par
                intelligence artificielle (États-Unis)
              </li>
              <li>
                <strong>Paddle :</strong> Traitement des paiements (Royaume-Uni)
              </li>
              <li>
                <strong>Supabase :</strong> Hébergement de la base de données
                (États-Unis)
              </li>
              <li>
                <strong>Vercel :</strong> Hébergement du site web (États-Unis)
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Ces partenaires sont tenus de protéger vos données conformément
              aux lois applicables et à nos accords de traitement des données.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Transferts internationaux
            </h2>
            <p className="text-gray-700 mb-4">
              Certaines de vos données peuvent être transférées vers des pays
              situés en dehors du Canada, notamment les États-Unis. Ces
              transferts sont encadrés par des garanties appropriées, notamment
              :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Clauses contractuelles types</li>
              <li>
                Certifications et programmes de conformité des fournisseurs
              </li>
              <li>
                Mesures de sécurité techniques et organisationnelles
                appropriées
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Conservation des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous conservons vos données selon les durées suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Données de compte :</strong> Jusqu&apos;à la suppression
                de votre compte, puis 1 an pour les obligations légales
              </li>
              <li>
                <strong>Documents analysés :</strong> 30 jours après
                l&apos;analyse (le texte extrait uniquement)
              </li>
              <li>
                <strong>Historique des analyses :</strong> 2 ans
              </li>
              <li>
                <strong>Données de facturation :</strong> 7 ans (obligation
                comptable)
              </li>
              <li>
                <strong>Journaux de connexion :</strong> 1 an
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Vos droits
            </h2>
            <p className="text-gray-700 mb-4">
              Conformément à la législation québécoise et canadienne sur la
              protection des renseignements personnels, vous disposez des droits
              suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Droit d&apos;accès :</strong> Obtenir une copie de vos
                données personnelles
              </li>
              <li>
                <strong>Droit de rectification :</strong> Corriger des données
                inexactes ou incomplètes
              </li>
              <li>
                <strong>Droit à l&apos;effacement :</strong> Demander la
                suppression de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Recevoir vos données
                dans un format structuré
              </li>
              <li>
                <strong>Droit de retrait du consentement :</strong> Retirer
                votre consentement à tout moment
              </li>
              <li>
                <strong>Droit de déposer une plainte :</strong> Auprès de la
                Commission d&apos;accès à l&apos;information du Québec (CAI)
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a
                href="mailto:privacy@loi96.ca"
                className="text-[#003DA5] hover:underline"
              >
                privacy@loi96.ca
              </a>
              . Nous répondrons dans un délai de 30 jours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Sécurité des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour
              protéger vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>Chiffrement des données au repos</li>
              <li>Authentification sécurisée avec Clerk</li>
              <li>Accès restreint aux données sur la base du besoin</li>
              <li>Surveillance et journalisation des accès</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Notre site utilise les cookies suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Cookies essentiels :</strong> Nécessaires au
                fonctionnement du site (session, authentification)
              </li>
              <li>
                <strong>Cookies analytiques :</strong> Pour comprendre
                l&apos;utilisation du site (anonymisés)
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Vous pouvez gérer vos préférences de cookies via les paramètres de
              votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Modifications
            </h2>
            <p className="text-gray-700">
              Nous pouvons modifier cette politique de confidentialité à tout
              moment. En cas de modification substantielle, nous vous en
              informerons par courriel ou via une notification sur le site. La
              date de dernière mise à jour est indiquée ci-dessous.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact
            </h2>
            <p className="text-gray-700">
              Pour toute question concernant cette politique ou vos données
              personnelles :
            </p>
            <ul className="list-none text-gray-700 mt-4 space-y-1">
              <li>
                <strong>Courriel :</strong>{" "}
                <a
                  href="mailto:privacy@loi96.ca"
                  className="text-[#003DA5] hover:underline"
                >
                  privacy@loi96.ca
                </a>
              </li>
              <li>
                <strong>Adresse :</strong> [Adresse], Québec, Canada
              </li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-CA")}
          </p>
        </div>
      </div>
    </div>
  );
}
