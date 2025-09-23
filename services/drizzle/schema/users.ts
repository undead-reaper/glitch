import { createdAt, updatedAt } from "@/services/drizzle/schema/common";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    clerkId: text("clerk_id").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
).enableRLS();
