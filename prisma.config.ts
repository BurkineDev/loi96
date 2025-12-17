import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use DIRECT_URL for migrations, DATABASE_URL for queries
// Provide a placeholder for build time when env vars aren't available
const datasourceUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
});
