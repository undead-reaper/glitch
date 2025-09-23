"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import { useUser } from "@clerk/nextjs";
import { Route } from "next";
import Link from "next/link";

const StudioSidebarHeader = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4 animate-pulse">
        <Skeleton className="size-[7rem] rounded-full bg-muted-foreground" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[5rem] bg-muted-foreground" />
          <Skeleton className="h-3 w-[6.25rem] bg-muted-foreground" />
        </div>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href={"/users/current" as Route}>
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName!}
          className="group-data-[collapsible=icon]:size-[2rem] size-[7rem] hover:opacity-80 transition-all text-3xl font-bold cursor-pointer"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1 group-data-[collapsible=icon]:hidden text-nowrap">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-xs text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
