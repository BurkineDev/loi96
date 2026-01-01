# Loi96.ca - Guide de Configuration

## 1. Architecture technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 15 (App Router) |
| Auth | Clerk |
| Base de données | Supabase PostgreSQL |
| ORM | Prisma 7 |
| IA | Anthropic Claude API |
| Paiements | Paddle Billing |
| Hébergement | Vercel |

---

## 2. Variables d'environnement (Vercel)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# URLs Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Base de données (IMPORTANT: utiliser l'URL Pooler, pas connexion directe)
DATABASE_URL=postgresql://postgres.rrrpywdngfypcfvshalq:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rrrpywdngfypcfvshalq.supabase.co

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...

# Paddle
PADDLE_API_KEY=pdl_live_...
PADDLE_WEBHOOK_SECRET=ntfset_...
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxx

# Prix Paddle (à configurer)
NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_STARTER_YEARLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID=pri_xxx

# Freemium
FREE_CHECKS_PER_MONTH=5
NEXT_PUBLIC_FREE_CHECKS_PER_MONTH=5
```

---

## 3. Configuration Supabase

### Tables de la base de données

- `User` - Utilisateurs synchronisés avec Clerk
- `Document` - Documents uploadés
- `Analysis` - Résultats des analyses Loi 96
- `WebhookEvent` - Events Paddle
- `AnalysisAudit` - Audit des analyses

### Création des tables

Exécuter le script `/prisma/init.sql` dans Supabase SQL Editor.

### Connection String

**IMPORTANT** : Utiliser **Transaction Pooler** (pas connexion directe) car Vercel utilise IPv4.

1. Supabase Dashboard → Settings → Database → Connect
2. Changer "Méthode" de "Connexion directe" à "Transaction Pooler"
3. Copier l'URL

---

## 4. Configuration Clerk

### Webhook

- **URL** : `https://[votre-domaine]/api/webhooks/clerk`
- **Events** : `user.created`, `user.updated`, `user.deleted`

### Configuration

1. Clerk Dashboard → Webhooks → Add Endpoint
2. Entrer l'URL du webhook
3. Sélectionner les events
4. Copier le Signing Secret
5. Ajouter `CLERK_WEBHOOK_SECRET` sur Vercel

---

## 5. Configuration Vercel

### Build Settings

- **Build Command** : `npx prisma generate && next build`
- **Install Command** : `npm install --legacy-peer-deps`

---

## 6. Fichiers clés

| Fichier | Description |
|---------|-------------|
| `prisma/schema.prisma` | Schéma DB (Prisma 7, sans URL) |
| `prisma.config.ts` | Config Prisma 7 avec datasource URL |
| `lib/prisma.ts` | Client Prisma avec pg adapter |
| `middleware.ts` | Middleware Clerk |
| `app/actions/user.ts` | Actions utilisateur |
| `app/actions/analyze.ts` | Analyse documents avec Claude AI |
| `prisma/init.sql` | Script SQL pour créer les tables |

---

## 7. Problèmes connus et solutions

| Problème | Solution |
|----------|----------|
| Prisma 7 - URL dans schema | Déplacer URL vers `prisma.config.ts` |
| Peer dependencies npm | `npm install --legacy-peer-deps` |
| "Can't reach database" | Utiliser URL Pooler au lieu de connexion directe |
| "Column not available" | Exécuter script SQL pour créer tables |
| "Unique constraint failed" | Code utilise `upsert` au lieu de `create` |

---

## 8. Fonctionnalités du Dashboard

- Upload de fichiers (PDF, Word, texte)
- Analyse IA de conformité Loi 96
- Score de conformité 0-100
- Détection des problèmes linguistiques
- Suggestions de corrections
- Texte corrigé automatiquement
- Historique des analyses
- Limite 5 vérifications/mois (gratuit)
- Plans payants illimités (Starter 19$/mois, Pro 49$/mois)

---

## 9. URLs importantes

- **Vercel** : https://vercel.com
- **Supabase** : https://supabase.com/dashboard
- **Clerk** : https://dashboard.clerk.com
- **Anthropic** : https://console.anthropic.com
- **Paddle** : https://vendors.paddle.com

---

## 10. Commandes utiles

```bash
# Développement local
npm run dev

# Build
npm run build

# Générer client Prisma
npx prisma generate

# Voir la DB
npx prisma studio
```

---

## 11. Prochaines étapes

1. **Ajouter des crédits Anthropic** - L'API Claude nécessite des crédits
2. **Configurer Paddle** - Créer les produits et prix
3. **Domaine personnalisé** - Configurer loi96.ca sur Vercel
4. **Tester le flow complet** - Upload → Analyse → Résultats
