"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validators";

/**
 * Connexion avec email/mot de passe
 */
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation avec Zod
  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: "Email ou mot de passe incorrect",
    };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

/**
 * Inscription avec email/mot de passe
 */
export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const name = formData.get("name") as string | null;

  // Validation avec Zod
  const validated = registerSchema.safeParse({
    email,
    password,
    confirmPassword,
    name,
  });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  const supabase = await createClient();

  // Créer l'utilisateur dans Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.user) {
    // Créer l'utilisateur dans la base de données Prisma
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: name || email.split("@")[0],
          freeChecksUsed: 0,
          freeChecksResetAt: new Date(),
        },
      });
    } catch (e) {
      console.error("Erreur création utilisateur Prisma:", e);
      // L'utilisateur existe peut-être déjà, on continue
    }
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

/**
 * Connexion avec Google OAuth
 */
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: "Erreur lors de la connexion avec Google",
    };
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Déconnexion
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Obtenir l'utilisateur courant avec ses données complètes
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Récupérer les données de l'utilisateur depuis Prisma
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // Si l'utilisateur n'existe pas dans Prisma, le créer
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "Utilisateur",
        avatarUrl: user.user_metadata?.avatar_url,
        freeChecksUsed: 0,
        freeChecksResetAt: new Date(),
      },
    });
  }

  // Vérifier si le mois a changé pour réinitialiser les vérifications gratuites
  const now = new Date();
  const resetDate = new Date(dbUser.freeChecksResetAt);
  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        freeChecksUsed: 0,
        freeChecksResetAt: now,
      },
    });
  }

  // Calculer le statut de l'abonnement
  const isSubscribed =
    dbUser.subscriptionStatus === "active" &&
    dbUser.currentPeriodEnd &&
    new Date(dbUser.currentPeriodEnd) > now;

  const freeChecksLimit = parseInt(process.env.FREE_CHECKS_PER_MONTH || "5", 10);
  const freeChecksRemaining = Math.max(0, freeChecksLimit - dbUser.freeChecksUsed);

  return {
    ...dbUser,
    isSubscribed: !!isSubscribed,
    freeChecksRemaining,
    canAnalyze: isSubscribed || freeChecksRemaining > 0,
  };
}

export type AuthUser = Awaited<ReturnType<typeof getCurrentUser>>;
