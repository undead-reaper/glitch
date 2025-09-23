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
}>;

const SidebarMenuList = ({ items }: Props) => {


  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton className="px-3" tooltip={item.label} asChild>
            <Link href={item.href as Route}>
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
