import { commentReactions } from "@/services/drizzle/schema/commentReactions";
import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { users } from "@/services/drizzle/schema/users";
import { videos } from "@/services/drizzle/schema/videos";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const comments = pgTable("comments", {
  id: nano,
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  videoId: text("video_id")
    .references(() => videos.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt,
  updatedAt,
}).enableRLS();

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  reactions: many(commentReactions),
}));

export const commentSelectSchema = createSelectSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
