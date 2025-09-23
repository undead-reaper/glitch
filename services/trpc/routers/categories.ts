import { db } from "@/services/drizzle";
import { categories } from "@/services/drizzle/schema/categories";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return await db.select().from(categories);
  }),
});
