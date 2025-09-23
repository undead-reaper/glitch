import "server-only";

import { createCallerFactory, createTRPCContext } from "@/services/trpc/init";
import { makeQueryClient } from "@/services/trpc/query-client";
import { appRouter } from "@/services/trpc/routers/_app";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
