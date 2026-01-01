"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Store, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { analyzeSignage } from "./actions";

export default function SignagePage() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    problems: string[];
    suggestions: string[];
    correctedDescription: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError("Veuillez décrire l'enseigne à analyser");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeSignage(description);
      if (response.success && response.result) {
        setResult(response.result);
      } else {
        setError(response.error || "Erreur lors de l'analyse");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    if (score >= 40) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          Analyse d&apos;enseignes
        </h1>
        <p className="text-muted-foreground mt-2">
          Vérifiez la conformité de vos enseignes et affichages commerciaux à la Loi 96.
        </p>
      </div>

      {/* Zone de saisie */}
      <Card>
        <CardHeader>
          <CardTitle>Décrivez votre enseigne</CardTitle>
          <CardDescription>
            Décrivez en détail votre enseigne, vitrine ou affichage commercial
            (textes, couleurs, tailles, position des éléments).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ex: Enseigne avec le nom 'COFFEE SHOP' en grandes lettres blanches, et en dessous 'Ouvert 7j/7' en petites lettres..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />

          {error && (
            <div className="text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !description.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Store className="mr-2 h-4 w-4" />
                Analyser l&apos;enseigne
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {result && (
        <div className="space-y-6">
          {/* Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Score de conformité</span>
                <Badge className={getScoreBadge(result.score)}>
                  {result.score >= 80 ? "Conforme" : result.score >= 60 ? "À améliorer" : "Non conforme"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}/100
              </div>
              <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.score >= 80 ? "bg-green-500" :
                    result.score >= 60 ? "bg-yellow-500" :
                    result.score >= 40 ? "bg-orange-500" : "bg-red-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Problèmes */}
          {result.problems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Problèmes détectés ({result.problems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.problems.map((problem, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-red-600 font-bold">{index + 1}.</span>
                      <span className="text-red-800">{problem}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions de correction ({result.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-bold">{index + 1}.</span>
                      <span className="text-blue-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Description corrigée */}
          {result.correctedDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Enseigne corrigée (conforme)
                </CardTitle>
                <CardDescription>
                  Voici comment votre enseigne devrait être pour respecter la Loi 96
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 whitespace-pre-wrap">
                    {result.correctedDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Info Loi 96 */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Règles de la Loi 96 pour l&apos;affichage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Le français doit être <strong>nettement prédominant</strong> (2x plus grand minimum)</p>
          <p>• Ajoutez un générique français : &quot;Boutique&quot;, &quot;Restaurant&quot;, &quot;Café&quot;, etc.</p>
          <p>• Le français doit avoir la même visibilité (éclairage, position)</p>
          <p>• Les marques anglaises doivent être accompagnées d&apos;un descriptif français</p>
        </CardContent>
      </Card>
    </div>
  );
}
