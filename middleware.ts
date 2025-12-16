// ===========================================
// Middleware Next.js avec Clerk
// ===========================================
// Gère l'authentification et les redirections

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes protégées qui nécessitent une authentification
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/analyse(.*)",
  "/settings(.*)",
  "/api/user(.*)",
  "/api/analyze(.*)",
  "/api/pdf(.*)",
]);

// Routes publiques (pas besoin d'auth)
const isPublicRoute = createRouteMatcher([
  "/",
  "/tarifs",
  "/fonctionnalites",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/conditions-utilisation",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protéger les routes dashboard et analyse
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Configuration des routes à traiter par le middleware
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - images publiques
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
