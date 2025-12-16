"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, CheckCircle, Gift, ArrowLeft, Star, Zap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-50" />
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
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Gift className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold text-yellow-100">5 vérifications gratuites</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-400/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-green-300" />
              <span className="text-sm font-semibold text-green-100">Inscription en 30s</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Créez votre compte<br />gratuitement
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Rejoignez des centaines de PME québécoises qui utilisent Loi96.ca pour assurer leur conformité linguistique.
          </p>

          <div className="space-y-4">
            {[
              "Aucune carte de crédit requise",
              "5 analyses gratuites chaque mois",
              "Résultats en moins de 30 secondes",
              "Passez à Pro quand vous voulez",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/90 italic mb-4">
              &quot;Loi96.ca nous a fait économiser des heures de travail. L&apos;analyse est précise et les suggestions sont vraiment utiles!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div>
                <p className="font-semibold text-white">Marie-Claude Tremblay</p>
                <p className="text-sm text-white/60">Directrice, ABC Services Inc.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm relative z-10">
          © 2025 Loi96.ca. Tous droits réservés.
        </p>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top bar with back button */}
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003DA5] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-[#003DA5] transition-colors"
          >
            Déjà un compte?{" "}
            <span className="font-semibold text-[#003DA5]">Se connecter</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo and badges */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#003DA5] rounded-xl flex items-center justify-center shadow-lg shadow-[#003DA5]/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#003DA5]">Loi96.ca</span>
              </Link>
              <div className="flex items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 bg-[#003DA5]/10 px-3 py-1.5 rounded-full">
                  <Gift className="w-4 h-4 text-[#003DA5]" />
                  <span className="text-sm font-medium text-[#003DA5]">5 vérifications gratuites</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Créer un compte
              </h2>
              <p className="text-gray-600">
                Commencez à vérifier vos documents gratuitement
              </p>
            </div>

            <SignUp
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
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/dashboard"
            />

            {/* Additional info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/conditions-utilisation" className="text-[#003DA5] hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/confidentialite" className="text-[#003DA5] hover:underline">
                  politique de confidentialité
                </Link>
              </p>
            </div>

            {/* Trust badges - Mobile */}
            <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">Données sécurisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">LPRPDE conforme</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
