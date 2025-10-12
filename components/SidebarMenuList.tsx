import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/types/SidebarItem";
import { LucideIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { isValidElement } from "react";

type Props = Readonly<{
  items: SidebarItem[];
  activeUrl: string;
}>;

const SidebarMenuList = ({ items, activeUrl }: Props) => {
  const renderIcon = (icon: SidebarItem["icon"]) => {
    if (isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent />;
  };

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
              prefetch
              href={item.href as Route}
              target={item.openInNewTab ? "_blank" : "_self"}
            >
              {renderIcon(item.icon)}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarMenuList;
