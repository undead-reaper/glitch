"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);

    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // if (typeof window !== 'undefined') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            size="lg"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
