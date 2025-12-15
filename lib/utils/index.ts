// ===========================================
// Utilitaires ConformLoi96
// ===========================================

export { cn } from "./cn";

/**
 * Formate une date en français canadien
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formate un montant en dollars canadiens
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

/**
 * Tronque un texte à une longueur maximale
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Délai asynchrone
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Vérifie si on est côté client
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Obtient les initiales d'un nom
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calcule le pourcentage de conformité
 */
export function calculateComplianceScore(
  passed: number,
  total: number
): number {
  if (total === 0) return 100;
  return Math.round((passed / total) * 100);
}

/**
 * Détermine la couleur du score de conformité
 */
export function getScoreColor(
  score: number
): "success" | "warning" | "destructive" {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}
