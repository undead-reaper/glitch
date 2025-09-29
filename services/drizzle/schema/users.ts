import { comments } from "@/services/drizzle/schema/comments";
import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { subscriptions } from "@/services/drizzle/schema/subscriptions";
import { videoReactions } from "@/services/drizzle/schema/videoReactions";
import { videos } from "@/services/drizzle/schema/videos";
import { videoViews } from "@/services/drizzle/schema/videoViews";
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
  videoViews: many(videoViews),
  videoReactions: many(videoReactions),
  subscriptions: many(subscriptions),
  subscribers: many(subscriptions),
  comments: many(comments),
}));
