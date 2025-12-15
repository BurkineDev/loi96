# ConformLoi96 🇨🇦

> SaaS de vérification de conformité à la Loi 96 pour les PME québécoises

ConformLoi96 aide les entreprises québécoises à s'assurer que leurs documents commerciaux (factures, contrats, textes marketing) respectent les exigences de la Loi 96 concernant la prédominance du français.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

- 📄 **Upload de documents** - PDF, Word (.docx) ou texte collé
- 🤖 **Analyse IA** - Powered by Claude (Anthropic) pour détecter les non-conformités
- ✅ **Checklist détaillée** - Liste des problèmes identifiés avec leur sévérité
- 💡 **Suggestions de corrections** - Recommandations précises pour corriger chaque problème
- 📊 **Score de conformité** - Évaluation globale de 0 à 100%
- 📥 **PDF corrigé** - Génération d'une version conforme du document (Pro)
- 📈 **Historique** - Accès à toutes vos analyses passées
- 💳 **Freemium** - 5 vérifications gratuites/mois, abonnement Pro à 19$/mois

## 🛠️ Stack Technique

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Langage**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Base de données**: [PostgreSQL](https://www.postgresql.org/) via [Prisma Accelerate](https://www.prisma.io/accelerate)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Supabase Auth](https://supabase.com/auth) (Email + Google OAuth)
- **Paiements**: [Lemon Squeezy](https://lemonsqueezy.com/)
- **IA**: [Anthropic Claude](https://www.anthropic.com/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

## 🚀 Installation

### Prérequis

- Node.js 20+
- Compte [Prisma Data Platform](https://cloud.prisma.io/) (pour Prisma Accelerate)
- Compte [Supabase](https://supabase.com/) (pour l'authentification)
- Compte [Lemon Squeezy](https://lemonsqueezy.com/)
- Clé API [Anthropic](https://console.anthropic.com/)

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/conformloi96.git
cd conformloi96
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos valeurs (voir commentaires dans le fichier).

4. **Générer le client Prisma et synchroniser la base de données**

```bash
npm run db:generate
npm run db:push
```

5. **Configurer Supabase (pour l'authentification)**

- Créez un projet sur [supabase.com](https://supabase.com/)
- Activez l'authentification Email/Password et Google OAuth
- Ajoutez `http://localhost:3000/callback` comme Redirect URL

6. **Configurer Lemon Squeezy**

- Créez un store sur [lemonsqueezy.com](https://lemonsqueezy.com/)
- Créez un produit "Pro" avec un prix récurrent de 19$ CAD/mois
- Notez le Variant ID du produit
- Créez un webhook endpoint vers `/api/webhooks/lemonsqueezy`
- Sélectionnez les événements: subscription_created, subscription_updated, subscription_cancelled, etc.

7. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Structure du Projet

```
conformloi96/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Dashboard protégé
│   ├── (marketing)/       # Pages publiques
│   ├── actions/           # Server Actions
│   └── api/               # API Routes
├── components/
│   ├── dashboard/         # Composants dashboard
│   ├── forms/             # Formulaires
│   ├── layout/            # Layout components
│   └── ui/                # Composants Shadcn/ui
├── lib/
│   ├── ai/                # Client Anthropic + analyseur
│   ├── stripe/            # Intégration Stripe
│   ├── supabase/          # Clients Supabase
│   ├── utils/             # Utilitaires
│   └── validators/        # Schémas Zod
├── prisma/
│   └── schema.prisma      # Schéma de base de données
└── types/                 # Types TypeScript
```

## 🔐 Règles Loi 96 Vérifiées

ConformLoi96 vérifie les règles suivantes:

1. **Prédominance du français**
   - Le français doit être au moins aussi visible que les autres langues
   - Dans les documents bilingues, le français doit apparaître en premier

2. **Terminologie obligatoire**
   - "Invoice" → "Facture"
   - "Quote" → "Soumission" ou "Devis"
   - "Contract" → "Contrat"
   - etc.

3. **Termes fiscaux**
   - "GST" → "TPS"
   - "QST" → "TVQ"
   - "Tax" → "Taxe"
   - etc.

4. **Termes commerciaux**
   - "Email" → "Courriel"
   - "Phone" → "Téléphone"
   - etc.

## 📜 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Lancer en production
npm run lint         # Vérifier le code
npm run db:push      # Sync Prisma → DB
npm run db:migrate   # Migration Prisma
npm run db:studio    # Interface Prisma Studio
```

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT © 2024 ConformLoi96

---

Fait avec ❤️ au Québec 🍁
