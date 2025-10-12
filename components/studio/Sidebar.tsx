"use client";

import SidebarMenuList from "@/components/SidebarMenuList";
import StudioSidebarHeader from "@/components/studio/SidebarHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { STUDIO_SIDEBAR_MAIN } from "@/constants/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="md:pt-14 z-40 border-none select-none"
    >
      <SidebarHeader className="block md:hidden">
        <div className="flex ml-1 items-center shrink-0">
          <SidebarTrigger />
          <Link
            prefetch
            href="/"
            className="px-3 py-1.5 text-xl font-semibold tracking-tight"
          >
            Glitch Studio
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <StudioSidebarHeader />
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarMenuList items={STUDIO_SIDEBAR_MAIN} activeUrl={pathname} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;
