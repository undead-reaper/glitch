import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { videos } from "@/services/drizzle/schema/videos";
import { relations } from "drizzle-orm";
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

export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));