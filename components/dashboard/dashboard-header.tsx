"use client";

import Link from "next/link";
import { Shield, LogOut, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/actions/auth";

interface DashboardHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    isSubscribed: boolean;
    freeChecksRemaining: number;
  };
}

/**
 * Header du dashboard avec navigation et menu utilisateur
 */
export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold hidden sm:inline-block">
            ConformLoi96
          </span>
        </Link>

        {/* Status abonnement + Menu utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Badge abonnement */}
          <div className="hidden sm:flex items-center space-x-2">
            {user.isSubscribed ? (
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Pro
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                {user.freeChecksRemaining} vérif. restantes
              </span>
            )}
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatarUrl || undefined}
                    alt={user.name || user.email}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "Utilisateur"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              {!user.isSubscribed && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings#billing" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Passer au Pro
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
