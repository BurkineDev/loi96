// ===========================================
// Client Prisma singleton pour Next.js
// ===========================================
// Évite les connexions multiples en développement

import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const logLevels: Prisma.LogLevel[] =
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"];

    const isAccelerateUrl =
      databaseUrl.startsWith("prisma://") ||
      databaseUrl.startsWith("prisma+");

    if (isAccelerateUrl) {
      return new PrismaClient({
        accelerateUrl: databaseUrl,
        log: logLevels,
      });
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: logLevels,
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
