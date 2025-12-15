import { Metadata } from "next";
import Link from "next/link";
import { getAllAnalyses } from "@/app/actions/analyze";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Historique des analyses",
  description: "Consultez l'historique de vos analyses de conformité Loi 96",
};

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const result = await getAllAnalyses(page, 10);

  // Fonction pour la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (score >= 40) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  // Type de document
  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PDF: "PDF",
      WORD: "Word",
      TEXT: "Texte",
      PASTE: "Collé",
      INVOICE: "Facture",
      CONTRACT: "Contrat",
      WEBSITE_TEXT: "Site web",
      MARKETING: "Marketing",
      LEGAL: "Légal",
      OTHER: "Autre",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
          <p className="text-muted-foreground mt-1">
            {result.total} analyse{result.total > 1 ? "s" : ""} au total
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Liste des analyses */}
      {result.analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Aucune analyse</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n&apos;avez pas encore analysé de document.
              <br />
              Commencez par uploader un document sur le tableau de bord.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                Analyser un document
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {result.analyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        getScoreBgColor(analysis.complianceScore)
                      )}>
                        <FileText className={cn("h-5 w-5", getScoreColor(analysis.complianceScore))} />
                      </div>
                      <div>
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          <Link href={`/dashboard/analysis/${analysis.id}`}>
                            {analysis.document.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                            {getDocumentTypeLabel(analysis.document.type)}
                          </span>
                          <span className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateTime(analysis.createdAt)}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Score */}
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          getScoreColor(analysis.complianceScore)
                        )}>
                          {analysis.complianceScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score
                        </div>
                      </div>
                      
                      {/* Statut */}
                      <div>
                        {analysis.isCompliant ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Conforme
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Non conforme
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {analysis.issues.length} problème{analysis.issues.length > 1 ? "s" : ""}
                      </span>
                      <span>
                        {analysis.suggestions.length} suggestion{analysis.suggestions.length > 1 ? "s" : ""}
                      </span>
                      {analysis.frenchPercentage && (
                        <span>
                          {analysis.frenchPercentage.toFixed(0)}% français
                        </span>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/analysis/${analysis.id}`}>
                        Voir les détails
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/dashboard/history?page=${page - 1}`}>
                    Précédent
                  </Link>
                ) : (
                  "Précédent"
                )}
              </Button>
              
              <span className="px-4 text-sm text-muted-foreground">
                Page {page} sur {result.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={page >= result.totalPages}
                asChild={page < result.totalPages}
              >
                {page < result.totalPages ? (
                  <Link href={`/dashboard/history?page=${page + 1}`}>
                    Suivant
                  </Link>
                ) : (
                  "Suivant"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
