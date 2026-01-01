import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions légales | Loi96.ca",
  description: "Mentions légales et informations sur l'éditeur de Loi96.ca",
};

export default function MentionsLegalesPage() {
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
          Mentions légales
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Éditeur du site
            </h2>
            <p className="text-gray-700 mb-4">
              Le site Loi96.ca est édité par :
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li>
                <strong>Raison sociale :</strong> [Nom de l&apos;entreprise]
              </li>
              <li>
                <strong>Forme juridique :</strong> [Type d&apos;entreprise]
              </li>
              <li>
                <strong>Siège social :</strong> [Adresse complète], Québec,
                Canada
              </li>
              <li>
                <strong>Numéro d&apos;entreprise du Québec (NEQ) :</strong>{" "}
                [Numéro NEQ]
              </li>
              <li>
                <strong>Courriel :</strong>{" "}
                <a
                  href="mailto:contact@loi96.ca"
                  className="text-[#003DA5] hover:underline"
                >
                  contact@loi96.ca
                </a>
              </li>
              <li>
                <strong>Directeur de la publication :</strong> [Nom du
                responsable]
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Hébergement
            </h2>
            <p className="text-gray-700 mb-4">Le site est hébergé par :</p>
            <ul className="list-none text-gray-700 space-y-1">
              <li>
                <strong>Hébergeur :</strong> Vercel Inc.
              </li>
              <li>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                91789, États-Unis
              </li>
              <li>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#003DA5] hover:underline"
                >
                  vercel.com
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Propriété intellectuelle
            </h2>
            <p className="text-gray-700 mb-4">
              L&apos;ensemble du contenu présent sur le site Loi96.ca, incluant
              notamment les textes, graphiques, images, logos, icônes, sons,
              logiciels et tout autre élément, est la propriété exclusive de
              l&apos;éditeur ou de ses partenaires, et est protégé par les lois
              canadiennes et internationales relatives à la propriété
              intellectuelle.
            </p>
            <p className="text-gray-700 mb-4">
              Toute reproduction, représentation, modification, publication,
              adaptation de tout ou partie des éléments du site, quel que soit
              le moyen ou le procédé utilisé, est interdite, sauf autorisation
              écrite préalable de l&apos;éditeur.
            </p>
            <p className="text-gray-700">
              Toute exploitation non autorisée du site ou de son contenu sera
              considérée comme constitutive d&apos;une contrefaçon et poursuivie
              conformément aux dispositions du Code de la propriété
              intellectuelle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Limitation de responsabilité
            </h2>
            <p className="text-gray-700 mb-4">
              Loi96.ca est un outil d&apos;aide à la vérification de conformité
              linguistique. Les analyses fournies par notre service sont à titre
              informatif uniquement et ne constituent en aucun cas un avis
              juridique.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Important :</strong> Nous recommandons fortement de
              consulter un avocat spécialisé ou l&apos;Office québécois de la
              langue française (OQLF) pour toute question juridique concernant
              la conformité à la Loi 96 (Loi sur la langue officielle et commune
              du Québec, le français).
            </p>
            <p className="text-gray-700">
              L&apos;éditeur ne pourra être tenu responsable des dommages
              directs ou indirects résultant de l&apos;utilisation du site ou de
              l&apos;impossibilité d&apos;y accéder.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Données personnelles
            </h2>
            <p className="text-gray-700 mb-4">
              La collecte et le traitement des données personnelles effectués
              sur ce site sont conformes à la{" "}
              <em>Loi sur la protection des renseignements personnels</em> du
              Québec et à la{" "}
              <em>
                Loi sur la protection des renseignements personnels et les
                documents électroniques
              </em>{" "}
              (LPRPDE) du Canada.
            </p>
            <p className="text-gray-700">
              Pour plus d&apos;informations sur la gestion de vos données
              personnelles, veuillez consulter notre{" "}
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
              6. Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Le site Loi96.ca utilise des cookies pour améliorer
              l&apos;expérience utilisateur et analyser le trafic. Ces cookies
              sont strictement nécessaires au fonctionnement du site ou servent
              à des fins statistiques.
            </p>
            <p className="text-gray-700">
              Vous pouvez configurer votre navigateur pour refuser les cookies.
              Cependant, certaines fonctionnalités du site pourraient ne plus
              être disponibles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Droit applicable et juridiction
            </h2>
            <p className="text-gray-700 mb-4">
              Les présentes mentions légales sont régies par le droit en vigueur
              au Québec, Canada. En cas de litige, les tribunaux du Québec
              seront seuls compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Contact
            </h2>
            <p className="text-gray-700">
              Pour toute question concernant ces mentions légales, vous pouvez
              nous contacter à l&apos;adresse suivante :{" "}
              <a
                href="mailto:contact@loi96.ca"
                className="text-[#003DA5] hover:underline"
              >
                contact@loi96.ca
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-CA")}
          </p>
        </div>
      </div>
    </div>
  );
}
