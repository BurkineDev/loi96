// ===========================================
// Client Prisma singleton pour Next.js
// ===========================================

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initialization - only create client when actually needed
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not defined. Please set it in your environment variables."
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Export a proxy that lazily initializes Prisma
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
