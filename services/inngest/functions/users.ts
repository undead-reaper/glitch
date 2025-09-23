import { serverEnv } from "@/env/env.server";
import { db } from "@/services/drizzle";
import { users } from "@/services/drizzle/schema/users";
import { inngest } from "@/services/inngest";
import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import { Webhook } from "svix";

function verifyWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  return new Webhook(serverEnv.CLERK_WEBHOOK_SECRET).verify(raw, headers);
}

export const createUser = inngest.createFunction(
  {
    id: "create-db-user",
    name: "Clerk - Create DB User",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event, step }) => {
    const { raw, headers } = event.data;

    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook({ raw, headers });
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Create User in DB", async () => {
      const evt = event.data;
      const { id, first_name, last_name, image_url } = evt.data;

      await db.insert(users).values({
        clerkId: id,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      });
    });
  }
);

export const updateUser = inngest.createFunction(
  {
    id: "update-db-user",
    name: "Clerk - Update DB User",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Update User in DB", async () => {
      const evt = event.data;
      const { id, first_name, last_name, image_url } = evt.data;

      await db
        .update(users)
        .set({
          name: `${first_name} ${last_name}`,
          imageUrl: image_url,
        })
        .where(eq(users.clerkId, id));
    });
  }
);

export const deleteUser = inngest.createFunction(
  {
    id: "delete-db-user",
    name: "Clerk - Delete DB User",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Delete User in DB", async () => {
      const evt = event.data;
      const { id } = evt.data;

      if (!id) {
        throw new NonRetriableError("User ID is missing in the event data");
      }

      await db.delete(users).where(eq(users.clerkId, id));
    });
  }
);
