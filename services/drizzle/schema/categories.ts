import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { videos } from "@/services/drizzle/schema/videos";
import { relations } from "drizzle-orm";
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

export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));