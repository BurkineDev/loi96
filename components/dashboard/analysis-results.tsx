"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Languages,
  Shield,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/cn";
import type { ComplianceIssue, CorrectionSuggestion } from "@/types";

// ===========================================
// Types des props
// ===========================================

interface AnalysisResultsProps {
  analysis: {
    id: string;
    isCompliant: boolean;
    complianceScore: number;
    detectedLanguage: string | null;
    frenchPercentage: number | null;
    issues: ComplianceIssue[];
    suggestions: CorrectionSuggestion[];
    correctedText: string | null;
    createdAt: Date;
  };
  document: {
    id: string;
    name: string;
    type: string;
    originalText: string;
  };
}

// ===========================================
// Composant principal
// ===========================================

export function AnalysisResults({ analysis, document }: AnalysisResultsProps) {
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Couleur du score selon le niveau
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Toggle l'expansion d'un problème
  const toggleIssue = (issueId: string) => {
    setExpandedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  // Copier le texte corrigé
  const copyCorrectText = async () => {
    if (!analysis.correctedText) return;
    
    try {
      await navigator.clipboard.writeText(analysis.correctedText);
      setCopied(true);
      toast({
        title: "Copié!",
        description: "Le texte corrigé a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le texte.",
      });
    }
  };

  // Télécharger le PDF corrigé (à implémenter)
  const downloadCorrectedPdf = async () => {
    toast({
      title: "Génération en cours...",
      description: "Le PDF corrigé sera téléchargé dans un instant.",
    });
    
    // TODO: Appeler l'API de génération PDF
    try {
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysis.id }),
      });
      
      if (!response.ok) throw new Error("Erreur génération PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.name.replace(/\.[^/.]+$/, "")}_conforme.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast({
        title: "Téléchargement réussi",
        description: "Le PDF corrigé a été téléchargé.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF.",
      });
    }
  };

  // Formater la sévérité
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Critique
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Moyen
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <FileText className="w-3 h-3 mr-1" />
            Mineur
          </span>
        );
    }
  };

  // Formater le type de problème
  const getIssueTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LANGUAGE_PREDOMINANCE: "Prédominance du français",
      MISSING_FRENCH_TERM: "Terme français manquant",
      ENGLISH_ONLY: "Contenu anglais uniquement",
      FRENCH_NOT_FIRST: "Français pas en premier",
      TAX_TERMINOLOGY: "Terminologie fiscale",
      BUSINESS_TERMINOLOGY: "Terminologie commerciale",
      CONTRACT_CLAUSE: "Clause contractuelle",
      OTHER: "Autre",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Score de conformité */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className={cn("h-5 w-5", getScoreColor(analysis.complianceScore))} />
              <CardTitle>Score de conformité</CardTitle>
            </div>
            {analysis.isCompliant ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Conforme
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                <XCircle className="w-4 h-4 mr-1" />
                Non conforme
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barre de progression du score */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Progress 
                  value={analysis.complianceScore} 
                  className="h-3"
                  indicatorClassName={getProgressColor(analysis.complianceScore)}
                />
              </div>
              <span className={cn("text-3xl font-bold", getScoreColor(analysis.complianceScore))}>
                {analysis.complianceScore}%
              </span>
            </div>

            {/* Stats de langue */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Languages className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Langue détectée</p>
                <p className="font-semibold capitalize">
                  {analysis.detectedLanguage === "french" && "Français"}
                  {analysis.detectedLanguage === "english" && "Anglais"}
                  {analysis.detectedLanguage === "bilingual" && "Bilingue"}
                  {analysis.detectedLanguage === "other" && "Autre"}
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Français</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.frenchPercentage?.toFixed(0) || 0}%
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Problèmes</p>
                <p className="text-2xl font-bold text-orange-500">
                  {analysis.issues.length}
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Suggestions</p>
                <p className="text-2xl font-bold text-blue-500">
                  {analysis.suggestions.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour les détails */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">
            Problèmes ({analysis.issues.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggestions ({analysis.suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="corrected" disabled={!analysis.correctedText}>
            Texte corrigé
          </TabsTrigger>
        </TabsList>

        {/* Liste des problèmes */}
        <TabsContent value="issues" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Problèmes détectés
              </CardTitle>
              <CardDescription>
                Liste des non-conformités identifiées dans le document
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-lg font-medium">Aucun problème détecté!</p>
                  <p className="text-muted-foreground">
                    Votre document est conforme à la Loi 96.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <button
                        className="w-full text-left"
                        onClick={() => toggleIssue(issue.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getSeverityBadge(issue.severity)}
                              <span className="text-xs text-muted-foreground">
                                {getIssueTypeLabel(issue.type)}
                              </span>
                            </div>
                            <p className="font-medium">{issue.description}</p>
                          </div>
                          {expandedIssues.includes(issue.id) ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      
                      {expandedIssues.includes(issue.id) && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          {issue.location && (
                            <div>
                              <p className="text-sm text-muted-foreground">Localisation:</p>
                              <p className="text-sm bg-muted p-2 rounded">{issue.location}</p>
                            </div>
                          )}
                          {issue.originalText && (
                            <div>
                              <p className="text-sm text-muted-foreground">Texte original:</p>
                              <p className="text-sm bg-red-50 dark:bg-red-950/20 p-2 rounded text-red-800 dark:text-red-200 font-mono">
                                {issue.originalText}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liste des suggestions */}
        <TabsContent value="suggestions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Suggestions de corrections
              </CardTitle>
              <CardDescription>
                Recommandations pour rendre le document conforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-lg font-medium">Aucune suggestion</p>
                  <p className="text-muted-foreground">
                    Le document ne nécessite pas de modifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {suggestion.explanation}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Original:</p>
                              <p className="text-sm bg-red-50 dark:bg-red-950/20 p-2 rounded text-red-800 dark:text-red-200 font-mono">
                                {suggestion.originalText}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Suggestion:</p>
                              <p className="text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded text-green-800 dark:text-green-200 font-mono">
                                {suggestion.suggestedText}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Texte corrigé */}
        <TabsContent value="corrected" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    Document corrigé
                  </CardTitle>
                  <CardDescription>
                    Version conforme à la Loi 96 de votre document
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCorrectText}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? "Copié!" : "Copier"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={downloadCorrectedPdf}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              {analysis.correctedText ? (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {analysis.correctedText}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Aucune correction disponible
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document original */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document original</CardTitle>
          <CardDescription>
            {document.name} • {document.type}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {document.originalText}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
