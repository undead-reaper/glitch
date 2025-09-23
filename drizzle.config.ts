import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./services/drizzle/migrations",
  schema: "./services/drizzle/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
