"use client";

import Link from "next/link";
import { Shield, Settings, CreditCard } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    imageUrl?: string | null;
    isSubscribed: boolean;
    freeChecksRemaining: number;
    canAnalyze: boolean;
  };
}

/**
 * Header du dashboard avec navigation et menu utilisateur
 */
export function DashboardHeader({ user }: DashboardHeaderProps) {
  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.email;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-[#003DA5]" />
          <span className="text-xl font-bold hidden sm:inline-block">
            Loi96.ca
          </span>
        </Link>

        {/* Status abonnement + Menu utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Badge abonnement */}
          <div className="hidden sm:flex items-center space-x-2">
            {user.isSubscribed ? (
              <span className="px-3 py-1 text-xs font-medium bg-[#003DA5]/10 text-[#003DA5] rounded-full">
                Pro
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                {user.freeChecksRemaining} vérif. restantes
              </span>
            )}
          </div>

          {/* Upgrade button for free users */}
          {!user.isSubscribed && (
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex bg-[#003DA5] hover:bg-[#002d7a]"
            >
              <Link href="/tarifs">
                <CreditCard className="mr-2 h-4 w-4" />
                Passer au Pro
              </Link>
            </Button>
          )}

          {/* Settings */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          {/* Clerk User Button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
