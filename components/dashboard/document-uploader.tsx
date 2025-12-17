"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeDocument } from "@/app/actions/analyze";

interface DocumentUploaderProps {
  canAnalyze: boolean;
  checksRemaining: number;
  isPaidUser: boolean;
}

// Types de fichiers acceptés
const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
  "text/plain": [".txt"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Composant d'upload de documents
 * Permet l'upload de fichiers ou le copier-coller de texte
 */
export function DocumentUploader({
  canAnalyze,
  checksRemaining,
  isPaidUser,
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const router = useRouter();

  // Configuration de react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Utiliser le nom du fichier sans l'extension comme nom par défaut
      setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: false,
      disabled: !canAnalyze,
    });

  // Supprimer le fichier sélectionné
  const removeFile = () => {
    setFile(null);
    setDocumentName("");
  };

  // Soumettre pour analyse
  const handleSubmit = async () => {
    if (!canAnalyze) {
      toast.error("Limite atteinte", {
        description:
          "Vous avez atteint votre limite mensuelle. Passez à Starter pour des analyses illimitées.",
      });
      return;
    }

    const hasContent =
      activeTab === "upload" ? file !== null : text.trim().length >= 10;

    if (!hasContent) {
      toast.error("Contenu requis", {
        description:
          activeTab === "upload"
            ? "Veuillez sélectionner un fichier"
            : "Veuillez entrer au moins 10 caractères de texte",
      });
      return;
    }

    if (!documentName.trim()) {
      toast.error("Nom requis", {
        description: "Veuillez donner un nom à votre document",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Créer FormData pour l'envoi
      const formData = new FormData();
      formData.append("name", documentName.trim());
      formData.append("type", activeTab === "upload" ? "FILE" : "PASTE");

      if (activeTab === "upload" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      // Appeler la Server Action
      const result = await analyzeDocument(formData);

      if (result.success && result.analysisId) {
        toast.success("Analyse terminée!", {
          description: "Votre document a été analysé avec succès.",
        });
        // Rediriger vers les résultats
        router.push(`/dashboard/analysis/${result.analysisId}`);
      } else {
        throw new Error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      toast.error("Erreur", {
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'analyser le document",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Message d'erreur pour les fichiers rejetés
  const fileRejectionMessage =
    fileRejections.length > 0
      ? fileRejections[0]?.errors[0]?.code === "file-too-large"
        ? "Le fichier est trop volumineux (max 10 Mo)"
        : "Type de fichier non supporté"
      : null;

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-quebec-blue/40 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-quebec-blue" />
              Analyser un document
            </CardTitle>
            <CardDescription>
              Uploadez un fichier ou collez du texte pour vérifier la conformité à
              la Loi 96
            </CardDescription>
          </div>
          {!isPaidUser && checksRemaining > 0 && (
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {checksRemaining} vérification{checksRemaining > 1 ? "s" : ""} restante{checksRemaining > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" disabled={!canAnalyze}>
              <Upload className="mr-2 h-4 w-4" />
              Fichier
            </TabsTrigger>
            <TabsTrigger value="paste" disabled={!canAnalyze}>
              <ClipboardPaste className="mr-2 h-4 w-4" />
              Texte
            </TabsTrigger>
          </TabsList>

          {/* Tab Upload fichier */}
          <TabsContent value="upload">
            {!canAnalyze ? (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-2">
                  Vous avez utilisé vos 5 vérifications gratuites ce mois-ci.
                </p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Passez à Starter pour des analyses illimitées!
                </p>
                <Button asChild className="bg-quebec-blue hover:bg-quebec-blue/90">
                  <Link href="/tarifs">
                    Voir les forfaits
                  </Link>
                </Button>
              </div>
            ) : file ? (
              <div className="space-y-4">
                {/* Fichier sélectionné */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-quebec-blue" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    disabled={isAnalyzing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Nom du document */}
                <div className="space-y-2">
                  <Label htmlFor="docName">Nom du document</Label>
                  <Input
                    id="docName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Ex: Facture client ABC"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`
                  flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
                  transition-colors cursor-pointer
                  ${
                    isDragActive
                      ? "border-quebec-blue bg-quebec-blue/5"
                      : "border-muted-foreground/25 hover:border-quebec-blue/50 hover:bg-quebec-blue/5"
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                {isDragActive ? (
                  <p className="text-quebec-blue font-medium">
                    Déposez le fichier ici...
                  </p>
                ) : (
                  <>
                    <p className="font-medium mb-1">
                      Glissez-déposez votre fichier ici
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word (.docx, .doc), Texte (.txt) - Max 10 Mo
                    </p>
                  </>
                )}
              </div>
            )}

            {fileRejectionMessage && (
              <p className="text-sm text-destructive mt-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {fileRejectionMessage}
              </p>
            )}
          </TabsContent>

          {/* Tab Copier-coller */}
          <TabsContent value="paste">
            {!canAnalyze ? (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-2">
                  Vous avez utilisé vos 5 vérifications gratuites ce mois-ci.
                </p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Passez à Starter pour des analyses illimitées!
                </p>
                <Button asChild className="bg-quebec-blue hover:bg-quebec-blue/90">
                  <Link href="/tarifs">
                    Voir les forfaits
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pasteDocName">Nom du document</Label>
                  <Input
                    id="pasteDocName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Ex: Contrat de service"
                    disabled={isAnalyzing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pasteText">
                    Collez votre texte
                    <span className="text-muted-foreground font-normal ml-2">
                      ({text.length} caractères)
                    </span>
                  </Label>
                  <Textarea
                    id="pasteText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Collez ici le contenu de votre document (facture, contrat, texte de site web...)&#10;&#10;Minimum 10 caractères requis."
                    className="min-h-[200px] resize-y"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Bouton d'analyse */}
        {canAnalyze && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                isAnalyzing ||
                (activeTab === "upload" && !file) ||
                (activeTab === "paste" && text.trim().length < 10) ||
                !documentName.trim()
              }
              size="lg"
              className="bg-quebec-blue hover:bg-quebec-blue/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyser le document
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
