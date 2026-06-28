import { defineConfig } from "prisma/config";

export default defineConfig({
  // datasource.url is required for migrations and introspection commands.
  // When DATABASE_URL is not set, Prisma CLI commands will prompt for it,
  // but the app still runs using the Zustand mock store.
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
