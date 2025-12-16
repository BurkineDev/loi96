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
          colorText: "#1a1a2e",
          colorTextSecondary: "#6b7280",
          colorDanger: "#dc2626",
          colorSuccess: "#16a34a",
          colorWarning: "#d97706",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
          fontSize: "1rem",
          spacingUnit: "1rem",
        },
        elements: {
          // Buttons
          formButtonPrimary:
            "bg-[#003DA5] hover:bg-[#002d7a] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#003DA5]/20 hover:shadow-xl transition-all duration-200",
          buttonArrowIcon: "text-white",

          // Card
          card: "shadow-none bg-transparent",
          cardBox: "shadow-none",

          // Header
          headerTitle: "text-2xl font-bold text-gray-900",
          headerSubtitle: "text-gray-600",

          // Social buttons
          socialButtonsBlockButton:
            "bg-white border-2 border-gray-200 hover:border-[#003DA5] hover:bg-[#003DA5]/5 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md",
          socialButtonsBlockButtonText: "font-medium text-gray-700",
          socialButtonsProviderIcon: "w-5 h-5",

          // Divider
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500 text-sm px-4",

          // Form fields
          formFieldLabel: "text-gray-700 font-medium text-sm mb-1",
          formFieldInput:
            "border-2 border-gray-200 focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 rounded-xl py-3 px-4 transition-all duration-200 text-gray-900",
          formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-600",
          formFieldAction: "text-[#003DA5] hover:text-[#002d7a] text-sm font-medium",
          formFieldErrorText: "text-red-600 text-sm mt-1",
          formFieldSuccessText: "text-green-600 text-sm mt-1",

          // Footer
          footerAction: "mt-6 text-center",
          footerActionText: "text-gray-600",
          footerActionLink: "text-[#003DA5] hover:text-[#002d7a] font-semibold ml-1",
          footerPagesLink: "text-[#003DA5] hover:text-[#002d7a]",

          // Identity preview
          identityPreview: "bg-gray-50 rounded-xl border border-gray-200",
          identityPreviewText: "text-gray-700",
          identityPreviewEditButton: "text-[#003DA5] hover:text-[#002d7a]",

          // OTP
          otpCodeFieldInput: "border-2 border-gray-200 focus:border-[#003DA5] rounded-xl text-center font-mono text-lg",

          // Alerts
          alert: "rounded-xl border",
          alertText: "text-sm",

          // User button
          userButtonAvatarBox: "w-10 h-10 rounded-xl",
          userButtonPopoverCard: "rounded-xl shadow-xl border border-gray-100",
          userButtonPopoverActionButton: "hover:bg-gray-50 rounded-lg",
          userButtonPopoverActionButtonText: "text-gray-700",
          userButtonPopoverActionButtonIcon: "text-gray-500",
          userButtonPopoverFooter: "hidden",

          // User profile
          userPreviewAvatarBox: "w-12 h-12 rounded-xl",
          userPreviewTextContainer: "gap-0.5",
          userPreviewMainIdentifier: "font-semibold text-gray-900",
          userPreviewSecondaryIdentifier: "text-gray-500 text-sm",

          // Navigation
          navbarButton: "text-gray-600 hover:text-[#003DA5] hover:bg-[#003DA5]/5 rounded-lg",
          navbarButtonIcon: "w-5 h-5",

          // Badges
          badge: "rounded-full px-2 py-0.5 text-xs font-medium",
          badgePrimary: "bg-[#003DA5]/10 text-[#003DA5]",

          // Modal
          modalBackdrop: "bg-black/50 backdrop-blur-sm",
          modalContent: "rounded-2xl shadow-2xl",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
          termsPageUrl: "/conditions-utilisation",
          privacyPageUrl: "/confidentialite",
          helpPageUrl: "mailto:support@loi96.ca",
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
