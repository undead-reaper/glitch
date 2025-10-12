import SidebarMenuList from "@/components/SidebarMenuList";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import { trpc } from "@/services/trpc/client";
import { SidebarItem } from "@/types/SidebarItem";
import { SignedIn } from "@clerk/nextjs";
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

export const LoadingSkeleton = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem className="animate-pulse" key={index}>
              <SidebarMenuButton disabled>
                <Skeleton className="size-6 rounded-full shrink-0 bg-muted" />
                <Skeleton className="h-4 w-full shrink-0 bg-muted" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

const SidebarSubscriptions = () => {
  const pathname = usePathname();

  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const SUBSCRIPTIONS_DATA = data?.pages
    .flatMap((page) => page.items)
    .map((subscription) => {
      const item: SidebarItem = {
        label: subscription.user.name,
        href: `/users/${subscription.user.id}`,
        icon: (
          <UserAvatar
            size="xs"
            imageUrl={subscription.user.imageUrl}
            name={subscription.user.name}
          />
        ),
      };
      return item;
    })
    .concat({
      href: "/subscriptions",
      icon: List,
      label: "All Subscriptions",
    });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <SignedIn>
      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuList
            items={SUBSCRIPTIONS_DATA ?? []}
            activeUrl={pathname}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SignedIn>
  );
};

export default SidebarSubscriptions;
