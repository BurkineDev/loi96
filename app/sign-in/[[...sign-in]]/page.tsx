"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">Loi96.ca</span>
          </Link>
        </div>

        <div className="text-white relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Propulsé par l&apos;IA</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Bienvenue sur<br />Loi96.ca
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Vérifiez la conformité de vos documents commerciaux à la Loi 96 en quelques clics.
          </p>

          <div className="space-y-4">
            {[
              "5 vérifications gratuites par mois",
              "Analyse IA ultra-précise en français",
              "Suggestions de correction automatiques",
              "Export PDF conforme Loi 96",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40"
                />
              ))}
            </div>
            <span className="text-white/80 text-sm">
              +500 PME québécoises nous font confiance
            </span>
          </div>
          <p className="text-white/60 text-sm">
            © 2025 Loi96.ca. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top bar with back button */}
        <div className="p-4 lg:p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003DA5] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-12 h-12 bg-[#003DA5] rounded-xl flex items-center justify-center shadow-lg shadow-[#003DA5]/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#003DA5]">Loi96.ca</span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connexion à votre compte
              </h2>
              <p className="text-gray-600">
                Accédez à votre tableau de bord Loi96
              </p>
            </div>

            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white border-2 border-gray-200 hover:border-[#003DA5] hover:bg-[#003DA5]/5 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md",
                  socialButtonsBlockButtonText: "font-medium",
                  socialButtonsProviderIcon: "w-5 h-5",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm bg-gray-50 px-4",
                  formFieldLabel: "text-gray-700 font-medium text-sm mb-1",
                  formFieldInput:
                    "border-2 border-gray-200 focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 rounded-xl py-3 px-4 transition-all duration-200",
                  formButtonPrimary:
                    "bg-[#003DA5] hover:bg-[#002d7a] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#003DA5]/20 hover:shadow-xl hover:shadow-[#003DA5]/30 transition-all duration-200 w-full",
                  footerAction: "mt-6 text-center",
                  footerActionText: "text-gray-600",
                  footerActionLink:
                    "text-[#003DA5] hover:text-[#002d7a] font-semibold ml-1",
                  formFieldAction: "text-[#003DA5] hover:text-[#002d7a] text-sm font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-[#003DA5] hover:text-[#002d7a]",
                  formResendCodeLink: "text-[#003DA5] hover:text-[#002d7a] font-medium",
                  otpCodeFieldInput: "border-2 border-gray-200 focus:border-[#003DA5] rounded-xl",
                  alert: "rounded-xl",
                  alertText: "text-sm",
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton",
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
            />

            {/* Additional info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                En vous connectant, vous acceptez nos{" "}
                <Link href="/conditions-utilisation" className="text-[#003DA5] hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/confidentialite" className="text-[#003DA5] hover:underline">
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
