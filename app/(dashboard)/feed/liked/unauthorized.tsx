import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ThumbsUp, UserCircle } from "lucide-react";

const HistoryUnauthorizedView = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <ThumbsUp className="size-28 mb-5" />
      <h1 className="font-medium text-2xl">Keep track of what you liked</h1>
      <p className="text-center mb-5 text-sm text-muted-foreground">
        Liked videos aren't available while signed out
      </p>
      <SignInButton>
        <Button
          variant="outline"
          className="rounded-full cursor-pointer hover:text-foreground!"
        >
          <UserCircle />
          <span>Sign In</span>
        </Button>
      </SignInButton>
    </div>
  );
};

export default HistoryUnauthorizedView;
