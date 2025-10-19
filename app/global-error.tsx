"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="mx-auto max-w-md space-y-6 px-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Critical Error
              </h1>
              <p className="text-muted-foreground">
                A critical error has occurred. Please refresh the page or
                contact support if the issue persists.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <Button onClick={() => reset()} size="lg">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
