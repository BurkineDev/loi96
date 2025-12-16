"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, CheckCircle, Gift } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-quebec-blue to-quebec-dark p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Loi96.ca</span>
          </Link>
        </div>

        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Gift className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">5 vérifications gratuites par mois</span>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            Créez votre compte gratuitement
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Rejoignez des centaines de PME québécoises qui utilisent Loi96.ca pour assurer leur conformité linguistique.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Inscription gratuite en 30 secondes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Aucune carte de crédit requise</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>5 analyses gratuites chaque mois</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Passez à Pro quand vous voulez</span>
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm">
          © 2025 Loi96.ca. Tous droits réservés.
        </p>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-quebec-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-quebec-blue">Loi96.ca</span>
            </Link>
            <div className="mt-4 inline-flex items-center gap-2 bg-quebec-blue/10 px-4 py-2 rounded-full">
              <Gift className="w-4 h-4 text-quebec-blue" />
              <span className="text-sm font-medium text-quebec-blue">5 vérifications gratuites</span>
            </div>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50",
                formFieldLabel: "text-gray-700 font-medium",
                formFieldInput:
                  "border-gray-300 focus:ring-2 focus:ring-quebec-blue focus:border-quebec-blue",
                formButtonPrimary:
                  "bg-quebec-blue hover:bg-quebec-blue/90 text-white font-medium py-3",
                footerActionLink:
                  "text-quebec-blue hover:text-quebec-blue/80 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
