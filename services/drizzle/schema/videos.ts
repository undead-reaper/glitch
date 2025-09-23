import { categories } from "@/services/drizzle/schema/categories";
import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { users } from "@/services/drizzle/schema/users";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: nano,
  title: text("title").notNull(),
  description: text("description"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  createdAt,
  updatedAt,
}).enableRLS();

export const videoRelations = relations(videos, ({ one }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
}));
