import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  emptyStringAsUndefined: true,
});
