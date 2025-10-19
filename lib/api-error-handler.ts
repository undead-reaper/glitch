import { logError } from "@/lib/error-handler";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function withErrorHandler<T>(
  handler: (req: NextRequest, context?: T) => Promise<Response>
) {
  return async (req: NextRequest, context?: T): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (error) {
      // Log the error
      logError(error, {
        url: req.url,
        method: req.method,
        handler: "API Route",
      });

      // Determine status code
      let status = 500;
      let message = "Internal server error";

      if (error instanceof Error) {
        message = error.message;

        // Check for specific error types
        if (
          message.includes("unauthorized") ||
          message.includes("authentication")
        ) {
          status = 401;
        } else if (
          message.includes("forbidden") ||
          message.includes("permission")
        ) {
          status = 403;
        } else if (message.includes("not found")) {
          status = 404;
        } else if (
          message.includes("validation") ||
          message.includes("invalid")
        ) {
          status = 400;
        } else if (message.includes("rate limit")) {
          status = 429;
        }
      }

      // Return error response
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              process.env.NODE_ENV === "production"
                ? "An error occurred while processing your request"
                : message,
            timestamp: new Date().toISOString(),
          },
        },
        { status }
      );
    }
  };
}

/**
 * Async function error handler
 * For standalone async functions that need error handling
 */
export function withAsyncErrorHandler<
  T extends (...args: any[]) => Promise<any>
>(fn: T, context?: Record<string, unknown>): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { ...context, functionName: fn.name });
      throw error;
    }
  }) as T;
}
