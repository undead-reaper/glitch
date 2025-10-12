import { db } from "@/services/drizzle";
import { users } from "@/services/drizzle/schema/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Route } from "next";
import { redirect } from "next/navigation";

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in" as Route);
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId));

  if (!existingUser) {
    return redirect("/sign-in" as Route);
  }

  return redirect(`/users/${existingUser.id}`);
};
