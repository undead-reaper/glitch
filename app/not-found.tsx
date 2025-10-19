import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
