"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Loader2, Trash2, Key } from "lucide-react";

interface DangerZoneProps {
  userId: string;
}

export function DangerZone({ userId }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Réinitialiser le mot de passe
  async function handleResetPassword() {
    setIsResetting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du courriel");
      }

      toast({
        title: "Courriel envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le courriel de réinitialisation.",
      });
    } finally {
      setIsResetting(false);
    }
  }

  // Supprimer le compte
  async function handleDeleteAccount() {
    if (confirmText !== "SUPPRIMER") return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du compte");
      }

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });

      // Rediriger vers la page d'accueil
      router.push("/");
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le compte. Veuillez réessayer.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Réinitialisation mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Mot de passe
          </CardTitle>
          <CardDescription>
            Modifiez votre mot de passe de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleResetPassword}
            disabled={isResetting}
          >
            {isResetting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Key className="h-4 w-4 mr-2" />
            )}
            Réinitialiser le mot de passe
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Un courriel de réinitialisation sera envoyé à votre adresse
          </p>
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div>
              <h4 className="font-medium text-destructive">Supprimer le compte</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </p>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Supprimer votre compte
                  </DialogTitle>
                  <DialogDescription>
                    Cette action est permanente et ne peut pas être annulée.
                    Toutes vos données, documents et analyses seront supprimés.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="p-4 bg-destructive/10 rounded-lg text-sm">
                    <p className="font-medium text-destructive mb-2">
                      Vous allez perdre:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Tous vos documents analysés</li>
                      <li>L&apos;historique complet de vos analyses</li>
                      <li>Votre abonnement actif (sans remboursement)</li>
                      <li>Toutes vos préférences</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm">
                      Tapez <strong>SUPPRIMER</strong> pour confirmer
                    </Label>
                    <Input
                      id="confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="SUPPRIMER"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== "SUPPRIMER" || isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Supprimer définitivement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
