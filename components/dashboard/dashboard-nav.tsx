"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  History,
  Settings,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

/**
 * Navigation latérale du dashboard
 */
export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Historique",
      href: "/dashboard/history",
      icon: History,
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">
      <div className="flex flex-col h-full p-4">
        {/* Bouton nouvelle analyse */}
        <Link href="/dashboard" className="mb-6">
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Button>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer nav */}
        <div className="pt-4 border-t">
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </aside>
  );
}
