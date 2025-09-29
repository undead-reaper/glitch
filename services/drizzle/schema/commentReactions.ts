import { comments } from "@/services/drizzle/schema/comments";
import { createdAt, updatedAt } from "@/services/drizzle/schema/common";
import { users } from "@/services/drizzle/schema/users";
import { reactionType } from "@/services/drizzle/schema/videoReactions";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: text("comment_id")
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId],
    }),
  ]
).enableRLS();

export const commentReactionRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(users, {
      fields: [commentReactions.userId],
      references: [users.id],
    }),
    comment: one(comments, {
      fields: [commentReactions.commentId],
      references: [comments.id],
    }),
  })
);
