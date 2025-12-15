import { notFound } from "next/navigation";
import Link from "next/link";
import { getAnalysis } from "@/app/actions/analyze";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AnalysisPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const result = await getAnalysis(id);

  if (!result.success || !result.analysis) {
    notFound();
  }

  const { analysis } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{analysis.document.name}</h1>
            <p className="text-muted-foreground">
              Résultats de l&apos;analyse de conformité Loi 96
            </p>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <AnalysisResults
        analysis={{
          id: analysis.id,
          isCompliant: analysis.isCompliant,
          complianceScore: analysis.complianceScore,
          detectedLanguage: analysis.detectedLanguage,
          frenchPercentage: analysis.frenchPercentage,
          issues: analysis.issues,
          suggestions: analysis.suggestions,
          correctedText: analysis.correctedText,
          createdAt: analysis.createdAt,
        }}
        document={{
          id: analysis.document.id,
          name: analysis.document.name,
          type: analysis.document.type,
          originalText: analysis.document.originalText,
        }}
      />
    </div>
  );
}
