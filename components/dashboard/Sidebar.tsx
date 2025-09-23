import SidebarMenuList from "@/components/SidebarMenuList";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DASHBOARD_SIDEBAR_MAIN,
  DASHBOARD_SIDEBAR_YOU,
} from "@/constants/sidebar";
import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <Sidebar
      collapsible="icon"
      className="md:pt-14 z-40 border-none select-none"
    >
      <SidebarHeader className="block md:hidden">
        <div className="flex ml-1 items-center shrink-0">
          <SidebarTrigger />
          <Link
            href="/"
            className="px-3 py-1.5 text-xl font-semibold tracking-tight"
          >
            Glitch
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuList items={DASHBOARD_SIDEBAR_MAIN} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>You</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuList items={DASHBOARD_SIDEBAR_YOU} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
