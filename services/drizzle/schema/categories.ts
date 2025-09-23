import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: nano,
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
).enableRLS();
