import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  FileText, 
  Shield, 
  Zap, 
  ArrowRight,
  FileCheck,
  Languages,
  Building2
} from "lucide-react";

// ===========================================
// Page d'accueil - Landing Page Marketing
// ===========================================

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">ConformLoi96</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-24 md:py-32">
          <div className="container-app">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm mb-6">
                <Zap className="h-4 w-4" />
                <span>Propulsé par l&apos;intelligence artificielle</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Vos documents conformes à la{" "}
                <span className="underline decoration-white/50 decoration-4 underline-offset-8">
                  Loi 96
                </span>{" "}
                en quelques clics
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                ConformLoi96 analyse automatiquement vos factures, contrats et documents 
                pour assurer la prédominance du français selon les exigences de la Loi 96 au Québec.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    Essayer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10">
                    Voir la démo
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-white/60 mt-4">
                5 vérifications gratuites par mois • Aucune carte de crédit requise
              </p>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-12 border-b bg-muted/30">
          <div className="container-app">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Fait confiance par des PME québécoises
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {["PME Montréal", "Québec Inc.", "Services ABC", "Commerce XYZ"].map((company) => (
                <div key={company} className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container-app">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tout ce dont vous avez besoin pour la conformité
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Notre outil analyse en profondeur vos documents et vous guide vers une conformité totale à la Loi 96.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comment ça fonctionne
              </h2>
              <p className="text-lg text-muted-foreground">
                Trois étapes simples vers la conformité
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container-app">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tarification simple et transparente
              </h2>
              <p className="text-lg text-muted-foreground">
                Commencez gratuitement, passez au Pro quand vous en avez besoin
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Gratuit */}
              <div className="p-8 rounded-2xl border bg-card">
                <h3 className="text-xl font-semibold mb-2">Gratuit</h3>
                <p className="text-muted-foreground mb-6">Pour tester et usage occasionnel</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">0$</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["5 vérifications par mois", "Analyse IA complète", "Checklist de conformité", "Suggestions de corrections"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>

              {/* Plan Pro */}
              <div className="p-8 rounded-2xl border-2 border-primary bg-card relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Populaire
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">Pour les entreprises actives</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">19$</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Vérifications illimitées",
                    "Analyse IA complète",
                    "Checklist de conformité",
                    "Suggestions de corrections",
                    "Génération PDF corrigé",
                    "Historique complet",
                    "Support prioritaire"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=pro">
                  <Button className="w-full">
                    Passer au Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 hero-gradient text-white">
          <div className="container-app text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à assurer votre conformité?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Rejoignez les centaines de PME québécoises qui font confiance à ConformLoi96 
              pour leurs documents.
            </p>
            <Link href="/register">
              <Button size="xl" variant="secondary">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">ConformLoi96</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Conditions d&apos;utilisation
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">
              © 2024 ConformLoi96. Tous droits réservés.
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
    description: "Téléversez vos PDF, documents Word ou copiez-collez directement votre texte pour une analyse instantanée."
  },
  {
    icon: Languages,
    title: "Détection de langue",
    description: "Notre IA identifie automatiquement les langues présentes et calcule le ratio français/anglais."
  },
  {
    icon: Shield,
    title: "Analyse Loi 96",
    description: "Vérification complète des exigences: prédominance du français, termes obligatoires, ordre d'affichage."
  },
  {
    icon: CheckCircle2,
    title: "Checklist détaillée",
    description: "Recevez une liste claire de tous les points de conformité avec leur statut actuel."
  },
  {
    icon: Zap,
    title: "Corrections suggérées",
    description: "L'IA propose des corrections précises pour chaque problème détecté dans vos documents."
  },
  {
    icon: FileCheck,
    title: "PDF corrigé",
    description: "Générez automatiquement une version conforme bilingue de votre document (Pro)."
  }
];

const steps = [
  {
    title: "Téléversez votre document",
    description: "Uploadez un PDF, Word ou copiez-collez le texte de votre facture, contrat ou page web."
  },
  {
    title: "Analyse IA instantanée",
    description: "Notre intelligence artificielle analyse votre document et détecte les non-conformités à la Loi 96."
  },
  {
    title: "Obtenez votre rapport",
    description: "Consultez la checklist des problèmes, les suggestions de correction et téléchargez le PDF corrigé."
  }
];
