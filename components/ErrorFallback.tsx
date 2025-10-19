"use client";

import { Button } from "@/components/ui/button";
import type { ErrorFallbackProps } from "@/lib/error-handler";
import { getUserFriendlyMessage } from "@/lib/error-handler";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const message = getUserFriendlyMessage(error);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
      <div className="mb-4 rounded-full bg-destructive/20 p-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-destructive">
        Something went wrong
      </h3>

      <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>

      <Button onClick={resetErrorBoundary} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

export function MinimalErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <p className="flex-1 text-sm text-muted-foreground">
        {getUserFriendlyMessage(error)}
      </p>
      <Button onClick={resetErrorBoundary} variant="ghost" size="sm">
        Retry
      </Button>
    </div>
  );
}
