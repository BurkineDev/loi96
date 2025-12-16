"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface AnalysisItem {
  id: string;
  isCompliant: boolean;
  complianceScore: number;
  detectedLanguage: string | null;
  createdAt: Date;
  issues: string | null;
  document: {
    id: string;
    name: string;
    type: string;
  };
}

interface RecentAnalysesProps {
  analyses: AnalysisItem[];
}

/**
 * Composant affichant les analyses récentes
 */
export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  // Fonction pour obtenir l'icône et la couleur selon le score
  const getScoreDisplay = (score: number) => {
    if (score >= 80) {
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        label: "Conforme",
      };
    } else if (score >= 50) {
      return {
        icon: AlertTriangle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        label: "À améliorer",
      };
    } else {
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        label: "Non conforme",
      };
    }
  };

  // Fonction pour obtenir l'icône du type de document
  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "WORD":
        return "📝";
      case "TEXT":
        return "📋";
      case "PASTE":
        return "✂️";
      default:
        return "📄";
    }
  };

  // Parse issues JSON
  const getIssuesCount = (issuesJson: string | null): number => {
    if (!issuesJson) return 0;
    try {
      const issues = JSON.parse(issuesJson);
      return Array.isArray(issues) ? issues.length : 0;
    } catch {
      return 0;
    }
  };

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyses récentes</CardTitle>
          <CardDescription>
            Vos dernières vérifications de conformité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Aucune analyse effectuée pour le moment
            </p>
            <p className="text-sm text-muted-foreground">
              Uploadez un document ci-dessus pour commencer
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analyses récentes</CardTitle>
          <CardDescription>
            Vos dernières vérifications de conformité
          </CardDescription>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/history">
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.map((analysis) => {
            const scoreDisplay = getScoreDisplay(analysis.complianceScore);
            const ScoreIcon = scoreDisplay.icon;
            const issuesCount = getIssuesCount(analysis.issues);

            return (
              <Link
                key={analysis.id}
                href={`/dashboard/analysis/${analysis.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Type de document */}
                    <div className="text-2xl">
                      {getDocTypeIcon(analysis.document.type)}
                    </div>

                    {/* Infos document */}
                    <div>
                      <p className="font-medium">{analysis.document.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(analysis.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                        {issuesCount > 0 && (
                          <>
                            <span>•</span>
                            <span>
                              {issuesCount} problème
                              {issuesCount > 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="secondary"
                      className={`${scoreDisplay.bgColor} ${scoreDisplay.color} border-0`}
                    >
                      <ScoreIcon className="h-3 w-3 mr-1" />
                      {analysis.complianceScore}%
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
