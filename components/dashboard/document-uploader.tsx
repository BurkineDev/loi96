"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  ClipboardPaste,
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
import { useToast } from "@/components/ui/use-toast";
import { analyzeDocument } from "@/app/actions/analyze";

interface DocumentUploaderProps {
  isSubscribed: boolean;
  freeChecksRemaining: number;
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
  isSubscribed,
  freeChecksRemaining,
}: DocumentUploaderProps) {
  // Calculate if user can analyze
  const canAnalyze = isSubscribed || freeChecksRemaining > 0;
  
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();
  const router = useRouter();

  // Configuration de react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
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
      toast({
        title: "Limite atteinte",
        description:
          "Vous avez atteint votre limite mensuelle. Passez au forfait Pro pour des analyses illimitées.",
        variant: "destructive",
      });
      return;
    }

    const hasContent =
      activeTab === "upload" ? file !== null : text.trim().length >= 10;

    if (!hasContent) {
      toast({
        title: "Contenu requis",
        description:
          activeTab === "upload"
            ? "Veuillez sélectionner un fichier"
            : "Veuillez entrer au moins 10 caractères de texte",
        variant: "destructive",
      });
      return;
    }

    if (!documentName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez donner un nom à votre document",
        variant: "destructive",
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
        toast({
          title: "Analyse terminée",
          description: "Votre document a été analysé avec succès.",
        });
        // Rediriger vers les résultats
        router.push(`/dashboard/analysis/${result.analysisId}`);
      } else {
        throw new Error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'analyser le document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Message d'erreur pour les fichiers rejetés
  const fileRejectionMessage =
    fileRejections.length > 0
      ? fileRejections[0].errors[0].code === "file-too-large"
        ? "Le fichier est trop volumineux (max 10 Mo)"
        : "Type de fichier non supporté"
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyser un document</CardTitle>
        <CardDescription>
          Uploadez un fichier ou collez du texte pour vérifier la conformité à
          la Loi 96
        </CardDescription>
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
                <p className="text-muted-foreground text-center">
                  Vous avez utilisé vos {5 - freeChecksRemaining} vérifications
                  gratuites ce mois-ci.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/settings#billing">
                    Passer au forfait Pro
                  </a>
                </Button>
              </div>
            ) : file ? (
              <div className="space-y-4">
                {/* Fichier sélectionné */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
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
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                {isDragActive ? (
                  <p className="text-primary font-medium">
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
                <p className="text-muted-foreground text-center">
                  Vous avez utilisé vos {5 - freeChecksRemaining} vérifications
                  gratuites ce mois-ci.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/settings#billing">
                    Passer au forfait Pro
                  </a>
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
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
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
