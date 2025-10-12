"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Clapperboard, User, UserCircle, Video } from "lucide-react";
import { usePathname } from "next/navigation";

const AuthButton = () => {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {isStudio ? (
              <UserButton.Link
                label="Glitch"
                href="/"
                labelIcon={<Video className="size-4" />}
              />
            ) : (
              <UserButton.Link
                label="Glitch Studio"
                href="/studio"
                labelIcon={<Clapperboard className="size-4" />}
              />
            )}
            <UserButton.Link
              label="Your Channel"
              href="/users/current"
              labelIcon={<User className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
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
