import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

/**
 * Error types for consistent error handling across the application
 */
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
  DATABASE = "DATABASE",
  INTERNAL = "INTERNAL",
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    code?: string;
    details?: unknown;
    timestamp: string;
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  type: ErrorType,
  message: string,
  code?: string,
  details?: unknown
): ErrorResponse {
  return {
    success: false,
    error: {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Handle TRPC errors and convert them to standard format
 */
export function handleTRPCError(error: unknown): ErrorResponse {
  if (error instanceof TRPCError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        return createErrorResponse(
          ErrorType.AUTHENTICATION,
          error.message || "You must be logged in to perform this action",
          error.code
        );
      case "FORBIDDEN":
        return createErrorResponse(
          ErrorType.AUTHORIZATION,
          error.message || "You don't have permission to perform this action",
          error.code
        );
      case "NOT_FOUND":
        return createErrorResponse(
          ErrorType.NOT_FOUND,
          error.message || "The requested resource was not found",
          error.code
        );
      case "BAD_REQUEST":
        return createErrorResponse(
          ErrorType.VALIDATION,
          error.message || "Invalid request data",
          error.code
        );
      case "TOO_MANY_REQUESTS":
        return createErrorResponse(
          ErrorType.RATE_LIMIT,
          error.message || "Too many requests, please try again later",
          error.code
        );
      case "TIMEOUT":
        return createErrorResponse(
          ErrorType.EXTERNAL_SERVICE,
          "The request timed out, please try again",
          error.code
        );
      case "INTERNAL_SERVER_ERROR":
      default:
        return createErrorResponse(
          ErrorType.INTERNAL,
          "An unexpected error occurred. Please try again later",
          error.code
        );
    }
  }

  if (error instanceof ZodError) {
    return createErrorResponse(
      ErrorType.VALIDATION,
      "Validation failed",
      "VALIDATION_ERROR",
      error
    );
  }

  if (error instanceof Error) {
    return createErrorResponse(
      ErrorType.INTERNAL,
      error.message || "An unexpected error occurred",
      "UNKNOWN_ERROR"
    );
  }

  return createErrorResponse(
    ErrorType.INTERNAL,
    "An unexpected error occurred",
    "UNKNOWN_ERROR"
  );
}

/**
 * Log error to monitoring service
 * TODO: Integrate with Sentry, LogRocket, or other monitoring service
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const errorInfo = handleTRPCError(error);

  // Console log for development
  console.error("[Error Handler]", {
    ...errorInfo,
    context,
  });

  // TODO: Send to monitoring service in production
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     extra: { ...context, errorInfo },
  //   });
  // }
}

/**
 * Error boundary fallback props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof TRPCError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        return "Please sign in to continue";
      case "FORBIDDEN":
        return "You don't have permission to do that";
      case "NOT_FOUND":
        return "We couldn't find what you're looking for";
      case "TOO_MANY_REQUESTS":
        return "You're doing that too fast. Please slow down";
      case "BAD_REQUEST":
        return "Please check your input and try again";
      default:
        return "Something went wrong. Please try again";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}
