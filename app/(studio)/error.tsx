"use client";

import { Button } from "@/components/ui/button";
import { getUserFriendlyMessage, logError } from "@/lib/error-handler";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { location: "studio" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Studio Error</h2>
          <p className="text-muted-foreground">
            {getUserFriendlyMessage(error)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            onClick={() => (window.location.href = "/studio")}
            variant="outline"
          >
            Go to studio
          </Button>
        </div>
      </div>
    </div>
  );
}
