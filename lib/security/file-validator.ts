/**
 * Validation des fichiers par Magic Bytes
 * Protège contre les fichiers malicieux avec extension falsifiée
 */

// Signatures Magic Bytes des types de fichiers supportés
const MAGIC_BYTES: Record<string, { bytes: number[]; offset?: number }[]> = {
  // PDF: %PDF-
  "application/pdf": [
    { bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  ],

  // DOCX: ZIP archive (PK)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    { bytes: [0x50, 0x4b, 0x03, 0x04] }, // PK (ZIP)
    { bytes: [0x50, 0x4b, 0x05, 0x06] }, // PK (empty ZIP)
    { bytes: [0x50, 0x4b, 0x07, 0x08] }, // PK (spanned ZIP)
  ],

  // DOC: OLE Compound Document
  "application/msword": [
    { bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }, // OLE
  ],

  // Plain text: pas de magic bytes spécifiques
  // On vérifie juste que c'est du texte valide UTF-8
  "text/plain": [],
};

// Taille maximale pour la validation (premiers 8 octets suffisent)
const MAX_HEADER_SIZE = 8;

/**
 * Résultat de validation
 */
export interface FileValidationResult {
  valid: boolean;
  detectedType: string | null;
  error?: string;
}

/**
 * Valider le type réel d'un fichier via ses magic bytes
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  expectedMimeType: string
): FileValidationResult {
  // Pour les fichiers texte, vérifier qu'il s'agit de texte valide
  if (expectedMimeType === "text/plain") {
    return validateTextFile(buffer);
  }

  const signatures = MAGIC_BYTES[expectedMimeType];

  if (!signatures || signatures.length === 0) {
    return {
      valid: false,
      detectedType: null,
      error: `Type MIME non supporté: ${expectedMimeType}`,
    };
  }

  // Vérifier si le fichier correspond à l'une des signatures
  for (const signature of signatures) {
    const offset = signature.offset || 0;

    if (buffer.length < offset + signature.bytes.length) {
      continue;
    }

    let matches = true;
    for (let i = 0; i < signature.bytes.length; i++) {
      if (buffer[offset + i] !== signature.bytes[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return {
        valid: true,
        detectedType: expectedMimeType,
      };
    }
  }

  // Détecter le type réel pour un meilleur message d'erreur
  const detectedType = detectFileType(buffer);

  return {
    valid: false,
    detectedType,
    error: detectedType
      ? `Type de fichier détecté: ${detectedType}, attendu: ${expectedMimeType}`
      : `Le fichier ne correspond pas au type ${expectedMimeType}`,
  };
}

/**
 * Valider qu'un fichier texte contient du texte UTF-8 valide
 */
function validateTextFile(buffer: Buffer): FileValidationResult {
  try {
    // Vérifier que c'est du texte UTF-8 valide
    const text = buffer.toString("utf-8");

    // Vérifier la présence de caractères binaires suspects
    // (NUL bytes, etc. qui indiqueraient un fichier binaire)
    const hasNullBytes = text.includes("\0");
    if (hasNullBytes) {
      return {
        valid: false,
        detectedType: "binary",
        error: "Le fichier contient des données binaires, pas du texte",
      };
    }

    // Vérifier qu'il y a du contenu imprimable
    const printableRatio = countPrintableChars(text) / text.length;
    if (printableRatio < 0.8) {
      return {
        valid: false,
        detectedType: "binary",
        error: "Le fichier ne semble pas être un fichier texte valide",
      };
    }

    return {
      valid: true,
      detectedType: "text/plain",
    };
  } catch {
    return {
      valid: false,
      detectedType: null,
      error: "Encodage du fichier invalide",
    };
  }
}

/**
 * Compter les caractères imprimables
 */
function countPrintableChars(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    // Caractères imprimables: espaces, lettres, chiffres, ponctuation
    if (
      (code >= 0x20 && code <= 0x7e) || // ASCII imprimable
      (code >= 0xa0 && code <= 0xff) || // Latin-1 étendu
      code === 0x09 || // Tab
      code === 0x0a || // LF
      code === 0x0d || // CR
      code >= 0x100 // Unicode (accents, etc.)
    ) {
      count++;
    }
  }
  return count;
}

/**
 * Détecter le type de fichier réel
 */
function detectFileType(buffer: Buffer): string | null {
  // PDF
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }

  // ZIP/DOCX
  if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
    return "application/zip (possibly DOCX)";
  }

  // OLE/DOC
  if (
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0
  ) {
    return "application/msword";
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // GIF
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif";
  }

  // EXE
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return "application/x-executable (DANGEROUS)";
  }

  return null;
}

/**
 * Liste des types de fichiers dangereux à bloquer
 */
const DANGEROUS_TYPES = [
  "application/x-executable",
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/javascript",
  "text/javascript",
  "application/x-sh",
  "application/x-bash",
];

/**
 * Vérifier si un fichier est potentiellement dangereux
 */
export function isDangerousFile(buffer: Buffer): boolean {
  // Vérifier EXE
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return true;
  }

  // Vérifier ELF (Linux executable)
  if (
    buffer[0] === 0x7f &&
    buffer[1] === 0x45 &&
    buffer[2] === 0x4c &&
    buffer[3] === 0x46
  ) {
    return true;
  }

  // Vérifier scripts shell (#!/)
  if (buffer[0] === 0x23 && buffer[1] === 0x21) {
    return true;
  }

  return false;
}

/**
 * Validation complète d'un fichier uploadé
 */
export async function validateUploadedFile(
  file: File,
  expectedMimeType: string
): Promise<FileValidationResult> {
  // Lire les premiers octets
  const arrayBuffer = await file.slice(0, 1024).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Vérifier si c'est un fichier dangereux
  if (isDangerousFile(buffer)) {
    return {
      valid: false,
      detectedType: "executable",
      error: "Fichier exécutable détecté - upload bloqué pour raisons de sécurité",
    };
  }

  // Valider le type
  return validateFileMagicBytes(buffer, expectedMimeType);
}
