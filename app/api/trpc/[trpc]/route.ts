import { logError } from "@/lib/error-handler";
import { createTRPCContext } from "@/services/trpc/init";
import { appRouter } from "@/services/trpc/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error, path, type }) => {
      // Log all errors
      logError(error, { path, type, endpoint: "/api/trpc" });

      // In development, log more details
      if (process.env.NODE_ENV === "development") {
        console.error(`[TRPC Error] ${type} on ${path}:`, error);
      }
    },
  });
};

export { handler as GET, handler as POST };
