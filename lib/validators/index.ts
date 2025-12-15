// ===========================================
// Schémas de validation Zod pour ConformLoi96
// ===========================================

import { z } from "zod";

// ===========================================
// Authentification
// ===========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse courriel est requise")
    .email("Adresse courriel invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    email: z
      .string()
      .min(1, "L'adresse courriel est requise")
      .email("Adresse courriel invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ===========================================
// Documents
// ===========================================

export const documentTypeSchema = z.enum([
  "INVOICE",
  "CONTRACT",
  "WEBSITE_TEXT",
  "MARKETING",
  "LEGAL",
  "OTHER",
]);

export const uploadDocumentSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du document est requis")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  type: documentTypeSchema,
  content: z
    .string()
    .min(1, "Le contenu du document est requis")
    .max(500000, "Le document est trop volumineux (max 500Ko de texte)"),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;

export const textInputSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du document est requis")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  type: documentTypeSchema,
  text: z
    .string()
    .min(10, "Le texte doit contenir au moins 10 caractères")
    .max(100000, "Le texte est trop long (max 100 000 caractères)"),
});

export type TextInputInput = z.infer<typeof textInputSchema>;

// ===========================================
// Analyse
// ===========================================

export const analyzeRequestSchema = z.object({
  documentId: z.string().cuid("ID de document invalide"),
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;

// ===========================================
// Stripe / Paiements
// ===========================================

export const createCheckoutSchema = z.object({
  priceId: z.string().min(1, "L'ID du prix est requis"),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

// ===========================================
// Pagination
// ===========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ===========================================
// Recherche
// ===========================================

export const searchSchema = z.object({
  query: z.string().max(255).optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ===========================================
// Profil utilisateur
// ===========================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ===========================================
// Fichiers
// ===========================================

// Tailles max en bytes
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "text/plain",
] as const;

export const fileUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file instanceof File, "Un fichier est requis")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Le fichier ne peut pas dépasser 10 Mo"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type as typeof ACCEPTED_FILE_TYPES[number]),
      "Format de fichier non supporté. Utilisez PDF, Word ou texte brut."
    ),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
