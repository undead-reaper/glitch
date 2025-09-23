import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";

const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm font-medium rounded-full cursor-pointer"
          >
            <UserCircle />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
