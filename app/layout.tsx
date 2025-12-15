import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// ===========================================
// Metadata SEO pour ConformLoi96
// ===========================================
export const metadata: Metadata = {
  title: {
    default: "ConformLoi96 - Conformité à la Loi 96 pour vos documents",
    template: "%s | ConformLoi96",
  },
  description:
    "Vérifiez automatiquement la conformité de vos documents à la Loi 96 du Québec. Analysez factures, contrats et textes web avec l'IA pour assurer la prédominance du français.",
  keywords: [
    "Loi 96",
    "conformité",
    "français",
    "Québec",
    "PME",
    "facture",
    "contrat",
    "OQLF",
    "vérification linguistique",
  ],
  authors: [{ name: "ConformLoi96" }],
  creator: "ConformLoi96",
  publisher: "ConformLoi96",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://conformloi96.com",
    siteName: "ConformLoi96",
    title: "ConformLoi96 - Conformité à la Loi 96 pour vos documents",
    description:
      "Vérifiez automatiquement la conformité de vos documents à la Loi 96 du Québec avec l'intelligence artificielle.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConformLoi96 - Vérification Loi 96",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConformLoi96 - Conformité à la Loi 96",
    description:
      "Vérifiez automatiquement la conformité de vos documents à la Loi 96 du Québec.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
// Layout racine
// ===========================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-CA"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Contenu principal */}
        {children}

        {/* Système de notifications toast */}
        <Toaster />
      </body>
    </html>
  );
}
