import { createdAt, updatedAt } from "@/services/drizzle/schema/common";
import { users } from "@/services/drizzle/schema/users";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: text("viewer_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: text("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pkey",
      columns: [t.viewerId, t.creatorId],
    }),
  ]
).enableRLS();

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  viewerId: one(users, {
    fields: [subscriptions.viewerId],
    references: [users.id],
  }),
  creatorId: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
  }),
}));
