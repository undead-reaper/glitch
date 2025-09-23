import { text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const createdAt = timestamp("created_at").defaultNow().notNull();
export const updatedAt = timestamp("updated_at").defaultNow().notNull();
export const nano = text("id")
  .primaryKey()
  .$defaultFn(() => nanoid());
