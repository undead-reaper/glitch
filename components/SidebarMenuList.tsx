import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/types/SidebarItem";
import { Route } from "next";
import Link from "next/link";

type Props = Readonly<{
  items: SidebarItem[];
  activeUrl: string;
}>;

const SidebarMenuList = ({ items, activeUrl }: Props) => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            isActive={activeUrl === item.href}
            className="px-3"
            tooltip={item.label}
            asChild
          >
            <Link
              href={item.href as Route}
              target={item.openInNewTab ? "_blank" : "_self"}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarMenuList;
