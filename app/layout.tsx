import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { PaddleProvider } from "@/components/paddle/paddle-provider";
import "./globals.css";

// ===========================================
// Metadata SEO pour ConformLoi96
// ===========================================
export const metadata: Metadata = {
  title: {
    default: "Loi96.ca - Vos documents conformes à la Loi 96 en quelques clics",
    template: "%s | Loi96.ca",
  },
  description:
    "Vérifiez automatiquement la conformité de vos documents commerciaux à la Loi 96 du Québec. Analysez factures, contrats et textes web avec l'IA pour assurer la prédominance du français. 5 vérifications gratuites par mois.",
  keywords: [
    "Loi 96",
    "conformité linguistique",
    "français Québec",
    "PME québécoise",
    "facture française",
    "contrat français",
    "OQLF",
    "vérification linguistique",
    "TPS TVQ",
    "document bilingue",
    "charte langue française",
  ],
  authors: [{ name: "Loi96.ca" }],
  creator: "Loi96.ca",
  publisher: "Loi96.ca",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://loi96.ca",
    siteName: "Loi96.ca",
    title: "Loi96.ca - Vos documents conformes à la Loi 96 en quelques clics",
    description:
      "Vérifiez automatiquement la conformité de vos documents à la Loi 96 du Québec avec l'intelligence artificielle. Essayez gratuitement!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loi96.ca - Vérification conformité Loi 96",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loi96.ca - Conformité Loi 96 pour vos documents",
    description:
      "Vérifiez automatiquement la conformité de vos documents à la Loi 96 du Québec. 5 vérifications gratuites!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://loi96.ca",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#003DA5" },
    { media: "(prefers-color-scheme: dark)", color: "#0052CC" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ===========================================
// Layout racine avec Clerk
// ===========================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={frFR}
      appearance={{
        variables: {
          colorPrimary: "#003DA5",
          colorTextOnPrimaryBackground: "#FFFFFF",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#1a1a2e",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary:
            "bg-quebec-blue hover:bg-quebec-blue/90 text-white",
          card: "shadow-lg",
          headerTitle: "text-quebec-blue",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton:
            "border-gray-200 hover:bg-gray-50 text-gray-700",
          formFieldInput:
            "border-gray-300 focus:border-quebec-blue focus:ring-quebec-blue",
          footerActionLink: "text-quebec-blue hover:text-quebec-blue/80",
        },
      }}
    >
      <html
        lang="fr-CA"
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-background font-sans antialiased">
          <PaddleProvider>
            {/* Contenu principal */}
            {children}

            {/* Système de notifications toast */}
            <Toaster />
            <SonnerToaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
              }}
            />
          </PaddleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
