import { serverEnv } from "@/env/env.server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const client = neon(serverEnv.DATABASE_URL);
export const db = drizzle({ client });
