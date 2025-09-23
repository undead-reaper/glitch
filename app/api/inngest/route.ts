import { inngest } from "@/services/inngest";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/services/inngest/functions/users";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [createUser, updateUser, deleteUser],
});
