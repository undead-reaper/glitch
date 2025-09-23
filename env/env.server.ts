import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().nonempty(),
    DATABASE_URL: z.string().nonempty(),
    CLERK_WEBHOOK_SECRET: z.string().nonempty(),
  },
  experimental__runtimeEnv: true,
  emptyStringAsUndefined: true,
});
