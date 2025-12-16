import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  FileCheck,
  Languages,
  Building2,
  Star,
  Quote,
  Gift,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// ===========================================
// Page d'accueil - Landing Page Marketing
// ===========================================

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-quebec-blue rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-quebec-blue">Loi96.ca</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#fonctionnalites"
              className="text-sm text-gray-600 hover:text-quebec-blue transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/tarifs"
              className="text-sm text-gray-600 hover:text-quebec-blue transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="#faq"
              className="text-sm text-gray-600 hover:text-quebec-blue transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-quebec-blue hover:bg-quebec-blue/90">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost">Tableau de bord</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-quebec-blue via-quebec-blue to-quebec-dark text-white py-24 md:py-32">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Gift className="w-4 h-4 mr-1" />
                5 vérifications gratuites par mois
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Vos documents conformes à la{" "}
                <span className="relative">
                  <span className="relative z-10">Loi 96</span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-400/30 -z-0"></span>
                </span>{" "}
                en quelques clics
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Analysez automatiquement vos factures, contrats et documents commerciaux
                pour assurer la prédominance du français selon les exigences de la Loi 96 au Québec.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-quebec-blue hover:bg-white/90 font-semibold text-lg px-8"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Essayer gratuitement
                  </Button>
                </Link>
                <Link href="/tarifs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Voir les tarifs
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Aucune carte requise
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  Analyse en 30 secondes
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  Données sécurisées
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-12 border-b bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500 mb-6">
              Des centaines de PME québécoises nous font confiance
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {["Services Pro Mtl", "Québec Assur Inc.", "Électro ABC", "Transport Lévis"].map(
                (company) => (
                  <div
                    key={company}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">{company}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fonctionnalites" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-quebec-blue/10 text-quebec-blue border-quebec-blue/20">
                Fonctionnalités
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Tout ce dont vous avez besoin pour la conformité
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Notre outil IA analyse en profondeur vos documents et vous guide vers une
                conformité totale à la Loi 96.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-quebec-blue/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-quebec-blue/10 flex items-center justify-center mb-4 group-hover:bg-quebec-blue group-hover:text-white transition-colors">
                    <feature.icon className="h-6 w-6 text-quebec-blue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-quebec-blue/10 text-quebec-blue border-quebec-blue/20">
                Comment ça marche
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Trois étapes simples vers la conformité
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-quebec-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-quebec-blue/10 text-quebec-blue border-quebec-blue/20">
                Témoignages
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Ce que disent nos clients
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-quebec-blue/20 mb-4" />
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-quebec-blue/10 flex items-center justify-center">
                      <span className="text-quebec-blue font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-quebec-blue/10 text-quebec-blue border-quebec-blue/20">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Questions fréquentes
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-lg border px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-quebec-blue to-quebec-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à assurer votre conformité?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Rejoignez les centaines de PME québécoises qui font confiance à Loi96.ca
              pour leurs documents commerciaux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-quebec-blue hover:bg-white/90 font-semibold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Essayer gratuitement - 5 vérifications/mois
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/60 mt-4">
              Aucune carte de crédit requise
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-quebec-blue rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">Loi96.ca</span>
              </div>
              <p className="text-sm">
                Vérification automatique de la conformité à la Loi 96 pour les PME québécoises.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#fonctionnalites" className="hover:text-white">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/tarifs" className="hover:text-white">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/mentions-legales" className="hover:text-white">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/conditions-utilisation" className="hover:text-white">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:contact@loi96.ca" className="hover:text-white">
                    contact@loi96.ca
                  </a>
                </li>
                <li>Montréal, Québec</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2025 Loi96.ca. Tous droits réservés.
            </p>
            <p className="text-sm">
              Fabriqué avec ❤️ au Québec
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===========================================
// Données statiques
// ===========================================

const features = [
  {
    icon: FileText,
    title: "Upload facile",
    description:
      "Téléversez vos PDF, documents Word ou copiez-collez directement votre texte pour une analyse instantanée.",
  },
  {
    icon: Languages,
    title: "Détection de langue",
    description:
      "Notre IA identifie automatiquement les langues présentes et calcule le ratio français/anglais.",
  },
  {
    icon: Shield,
    title: "Analyse Loi 96",
    description:
      "Vérification complète: prédominance du français, termes obligatoires (TPS/TVQ), ordre d'affichage.",
  },
  {
    icon: CheckCircle2,
    title: "Checklist détaillée",
    description:
      "Recevez une liste claire de tous les points de conformité avec leur statut et référence légale.",
  },
  {
    icon: Zap,
    title: "Corrections suggérées",
    description:
      "L'IA propose des corrections précises pour chaque problème détecté dans vos documents.",
  },
  {
    icon: FileCheck,
    title: "PDF corrigé",
    description:
      "Générez automatiquement une version conforme bilingue de votre document avec le français en premier.",
  },
];

const steps = [
  {
    title: "Téléversez votre document",
    description:
      "Uploadez un PDF, Word ou copiez-collez le texte de votre facture, contrat ou page web.",
  },
  {
    title: "Analyse IA instantanée",
    description:
      "Notre intelligence artificielle analyse votre document et détecte les non-conformités à la Loi 96.",
  },
  {
    title: "Obtenez votre rapport",
    description:
      "Consultez la checklist des problèmes, les suggestions de correction et téléchargez le PDF corrigé.",
  },
];

const testimonials = [
  {
    quote:
      "Loi96.ca nous a fait économiser des heures de travail. Plus besoin de vérifier manuellement chaque facture!",
    name: "Marie-Claire Tremblay",
    company: "Comptable agréée, Montréal",
  },
  {
    quote:
      "Enfin un outil simple et efficace pour s'assurer que nos contrats respectent la loi. Je recommande!",
    name: "Jean-François Gagnon",
    company: "Avocat d'affaires, Québec",
  },
  {
    quote:
      "Le rapport détaillé avec les références aux articles de loi est vraiment utile. Ça rassure nos clients.",
    name: "Sophie Lavoie",
    company: "Directrice, PME Services",
  },
];

const faqs = [
  {
    question: "Qu'est-ce que la Loi 96?",
    answer:
      "La Loi 96 (anciennement le projet de loi 96) est une loi québécoise qui renforce la Charte de la langue française. Elle impose aux entreprises d'utiliser le français comme langue prédominante dans leurs communications commerciales, factures, contrats et affichage public.",
  },
  {
    question: "Quels types de documents puis-je analyser?",
    answer:
      "Vous pouvez analyser des documents PDF, Word (DOCX), fichiers texte, ou simplement coller du texte directement. Cela inclut les factures, contrats, conditions générales, textes marketing, courriels commerciaux, et plus encore.",
  },
  {
    question: "Combien coûte le service?",
    answer:
      "Nous offrons 5 vérifications gratuites par mois. Pour des analyses illimitées, le forfait Starter est à 19$/mois et le forfait Pro à 49$/mois avec support prioritaire et fonctionnalités avancées. Tous les forfaits payants incluent un essai gratuit de 14 jours.",
  },
  {
    question: "Mes documents sont-ils sécurisés?",
    answer:
      "Oui, absolument. Vos documents sont traités de manière sécurisée et confidentielle. Nous ne conservons pas le contenu au-delà de ce qui est nécessaire pour l'analyse. Consultez notre politique de confidentialité pour plus de détails.",
  },
  {
    question: "L'outil remplace-t-il un avocat?",
    answer:
      "Non, Loi96.ca est un outil d'assistance qui vous aide à identifier les problèmes potentiels de conformité. Pour des questions juridiques complexes ou des litiges, nous recommandons toujours de consulter un professionnel du droit.",
  },
];
