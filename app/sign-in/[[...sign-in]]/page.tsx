"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, CheckCircle } from "lucide-react";

export default function SignInPage() {
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
          <h1 className="text-4xl font-bold mb-6">
            Bienvenue sur Loi96.ca
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Vérifiez la conformité de vos documents commerciaux à la Loi 96 en quelques clics.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>5 vérifications gratuites par mois</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Analyse IA en français</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Suggestions de correction automatiques</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Export PDF conforme</span>
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm">
          © 2025 Loi96.ca. Tous droits réservés.
        </p>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-quebec-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-quebec-blue">Loi96.ca</span>
            </Link>
          </div>

          <SignIn
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
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
