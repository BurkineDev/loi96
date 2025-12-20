// ===========================================
// Middleware Next.js avec Clerk
// ===========================================

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes protégées qui nécessitent une authentification
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/analyze(.*)",
  "/api/pdf(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
