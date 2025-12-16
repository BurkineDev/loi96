import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Loi96.ca",
  description: "Conditions générales d'utilisation du service Loi96.ca",
};

export default function ConditionsUtilisationPage() {
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
          Conditions d&apos;utilisation
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8 text-lg">
            Bienvenue sur Loi96.ca. En utilisant notre service, vous acceptez
            les présentes conditions d&apos;utilisation. Veuillez les lire
            attentivement.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Définitions
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>« Service »</strong> désigne la plateforme Loi96.ca et
                toutes ses fonctionnalités
              </li>
              <li>
                <strong>« Utilisateur »</strong> désigne toute personne
                utilisant le Service
              </li>
              <li>
                <strong>« Contenu »</strong> désigne tout document, texte ou
                fichier soumis par l&apos;Utilisateur
              </li>
              <li>
                <strong>« Analyse »</strong> désigne le rapport de conformité
                généré par le Service
              </li>
              <li>
                <strong>« Loi 96 »</strong> désigne la Loi sur la langue
                officielle et commune du Québec, le français (2022, chapitre 14)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description du service
            </h2>
            <p className="text-gray-700 mb-4">
              Loi96.ca est un service en ligne qui permet aux entreprises et aux
              particuliers de vérifier la conformité linguistique de leurs
              documents commerciaux par rapport aux exigences de la Loi 96 du
              Québec.
            </p>
            <p className="text-gray-700">Le Service comprend notamment :</p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>
                L&apos;analyse de documents (PDF, DOCX, TXT ou texte collé)
              </li>
              <li>La génération de rapports de conformité</li>
              <li>Des suggestions de corrections</li>
              <li>
                La génération de documents corrigés (selon le forfait souscrit)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Inscription et compte
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.1 Création de compte
            </h3>
            <p className="text-gray-700 mb-4">
              Pour utiliser le Service, vous devez créer un compte en
              fournissant une adresse courriel valide. Vous pouvez également
              vous connecter via Google.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.2 Responsabilité du compte
            </h3>
            <p className="text-gray-700 mb-4">
              Vous êtes responsable de maintenir la confidentialité de vos
              identifiants de connexion et de toutes les activités effectuées
              sous votre compte.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.3 Exactitude des informations
            </h3>
            <p className="text-gray-700">
              Vous vous engagez à fournir des informations exactes et à jour
              lors de votre inscription et à les maintenir à jour.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Forfaits et tarification
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.1 Forfait gratuit
            </h3>
            <p className="text-gray-700 mb-4">
              Le forfait gratuit permet 5 analyses par mois. Les analyses non
              utilisées ne sont pas reportées au mois suivant.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.2 Forfaits payants
            </h3>
            <p className="text-gray-700 mb-4">
              Les forfaits Starter et Pro offrent des analyses illimitées et des
              fonctionnalités supplémentaires selon les descriptions sur notre
              page{" "}
              <Link href="/tarifs" className="text-[#003DA5] hover:underline">
                Tarifs
              </Link>
              .
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.3 Période d&apos;essai
            </h3>
            <p className="text-gray-700 mb-4">
              Les nouveaux utilisateurs de forfaits payants bénéficient
              d&apos;une période d&apos;essai de 14 jours. Vous pouvez annuler à
              tout moment pendant cette période sans être facturé.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.4 Facturation
            </h3>
            <p className="text-gray-700">
              Les paiements sont traités par Paddle. En souscrivant à un forfait
              payant, vous autorisez les prélèvements récurrents selon la
              fréquence choisie (mensuelle ou annuelle).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Annulation et remboursement
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              5.1 Annulation
            </h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez annuler votre abonnement à tout moment. L&apos;accès
              aux fonctionnalités payantes reste actif jusqu&apos;à la fin de la
              période de facturation en cours.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              5.2 Remboursement
            </h3>
            <p className="text-gray-700">
              Pendant la période d&apos;essai de 14 jours, vous pouvez obtenir
              un remboursement complet. Après cette période, les paiements ne
              sont pas remboursables, sauf en cas de problème technique majeur
              imputable au Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Utilisation acceptable
            </h2>
            <p className="text-gray-700 mb-4">
              En utilisant le Service, vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Utiliser le Service uniquement à des fins légales et conformes
                aux présentes conditions
              </li>
              <li>
                Ne pas soumettre de contenu illégal, diffamatoire, obscène ou
                portant atteinte aux droits d&apos;autrui
              </li>
              <li>
                Ne pas tenter de contourner les limitations du Service ou les
                mesures de sécurité
              </li>
              <li>
                Ne pas utiliser le Service de manière à surcharger ou perturber
                nos systèmes
              </li>
              <li>
                Ne pas revendre ou redistribuer le Service sans autorisation
              </li>
              <li>
                Ne pas utiliser de robots, scripts ou autres moyens automatisés
                sans autorisation
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Propriété intellectuelle
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              7.1 Contenu de l&apos;Utilisateur
            </h3>
            <p className="text-gray-700 mb-4">
              Vous conservez tous les droits sur le Contenu que vous soumettez.
              En soumettant du Contenu, vous nous accordez une licence limitée
              pour le traiter aux fins d&apos;analyse.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              7.2 Propriété du Service
            </h3>
            <p className="text-gray-700">
              Le Service, son code source, son design, ses fonctionnalités et sa
              documentation sont notre propriété exclusive et sont protégés par
              les lois sur la propriété intellectuelle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation de responsabilité
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
              <p className="text-amber-800 font-medium">Avertissement important</p>
              <p className="text-amber-700 mt-2">
                Le Service fournit des analyses à titre informatif uniquement.
                Les rapports générés ne constituent pas un avis juridique et ne
                garantissent pas la conformité légale de vos documents.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              <strong>
                Nous recommandons fortement de consulter un avocat spécialisé ou
                l&apos;Office québécois de la langue française (OQLF) pour toute
                question de conformité légale.
              </strong>
            </p>
            <p className="text-gray-700 mb-4">
              Dans les limites permises par la loi :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Le Service est fourni « tel quel » sans garantie d&apos;aucune
                sorte
              </li>
              <li>
                Nous ne garantissons pas l&apos;exactitude, l&apos;exhaustivité
                ou la fiabilité des analyses
              </li>
              <li>
                Nous ne sommes pas responsables des dommages directs, indirects,
                accessoires ou consécutifs
              </li>
              <li>
                Notre responsabilité totale est limitée au montant payé pour le
                Service au cours des 12 derniers mois
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Indemnisation
            </h2>
            <p className="text-gray-700">
              Vous acceptez de nous indemniser et de nous tenir à couvert de
              toute réclamation, dommage, perte ou dépense (y compris les frais
              juridiques) résultant de votre utilisation du Service ou de toute
              violation des présentes conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Confidentialité des documents
            </h2>
            <p className="text-gray-700 mb-4">
              Nous prenons la confidentialité de vos documents au sérieux :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Les documents sont traités de manière automatisée et ne sont pas
                consultés par notre personnel
              </li>
              <li>
                Le texte extrait est conservé temporairement (30 jours) puis
                supprimé
              </li>
              <li>
                Les analyses peuvent utiliser des services tiers (IA) mais les
                données ne sont pas utilisées pour entraîner des modèles
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Pour plus de détails, consultez notre{" "}
              <Link
                href="/confidentialite"
                className="text-[#003DA5] hover:underline"
              >
                Politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Modification du Service
            </h2>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier, suspendre ou
              interrompre, temporairement ou définitivement, le Service ou toute
              partie de celui-ci, avec ou sans préavis. Nous ne serons pas
              responsables envers vous ou tout tiers pour toute modification,
              suspension ou interruption du Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Modification des conditions
            </h2>
            <p className="text-gray-700">
              Nous pouvons modifier ces conditions à tout moment. Les
              modifications entrent en vigueur dès leur publication sur le site.
              En continuant à utiliser le Service après la publication des
              modifications, vous acceptez les nouvelles conditions. Si vous
              n&apos;acceptez pas les modifications, vous devez cesser
              d&apos;utiliser le Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Résiliation
            </h2>
            <p className="text-gray-700 mb-4">
              Nous pouvons résilier ou suspendre votre accès au Service
              immédiatement, sans préavis ni responsabilité, pour quelque raison
              que ce soit, notamment si vous violez les présentes conditions.
            </p>
            <p className="text-gray-700">
              Vous pouvez résilier votre compte à tout moment en nous contactant
              ou en utilisant la fonction de suppression de compte dans les
              paramètres.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Droit applicable et juridiction
            </h2>
            <p className="text-gray-700 mb-4">
              Les présentes conditions sont régies par les lois du Québec et les
              lois fédérales du Canada qui s&apos;y appliquent.
            </p>
            <p className="text-gray-700">
              Tout litige découlant des présentes conditions ou de
              l&apos;utilisation du Service sera soumis à la compétence
              exclusive des tribunaux du district judiciaire de Montréal,
              Québec.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Dispositions générales
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Intégralité :</strong> Ces conditions constituent
                l&apos;intégralité de l&apos;accord entre vous et nous
                concernant le Service.
              </li>
              <li>
                <strong>Divisibilité :</strong> Si une disposition est jugée
                invalide, les autres dispositions restent en vigueur.
              </li>
              <li>
                <strong>Renonciation :</strong> Le fait de ne pas exercer un
                droit ne constitue pas une renonciation à ce droit.
              </li>
              <li>
                <strong>Cession :</strong> Vous ne pouvez pas céder ces
                conditions sans notre consentement écrit.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Contact
            </h2>
            <p className="text-gray-700">
              Pour toute question concernant ces conditions d&apos;utilisation :
            </p>
            <ul className="list-none text-gray-700 mt-4 space-y-1">
              <li>
                <strong>Courriel :</strong>{" "}
                <a
                  href="mailto:legal@loi96.ca"
                  className="text-[#003DA5] hover:underline"
                >
                  legal@loi96.ca
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
