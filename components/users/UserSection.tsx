"use client";

import { Separator } from "@/components/ui/separator";
import UserBanner, { UserBannerSkeleton } from "@/components/users/UserBanner";
import UserDetails, {
  UserDetailsSkeleton,
} from "@/components/users/UserDetails";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  userId: string;
}>;

const UserSection = ({ userId }: Props) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading user data</div>}>
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <UserBannerSkeleton />
      <UserDetailsSkeleton />
      <Separator />
    </div>
  );
};

const UserSectionSuspense = ({ userId }: Props) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ userId });

  return (
    <div className="flex flex-col">
      <UserBanner user={user} />
      <UserDetails user={user} />
      <Separator />
    </div>
  );
};

export default UserSection;
