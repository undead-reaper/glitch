import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: nano,
    clerkId: text("clerk_id").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
).enableRLS();
