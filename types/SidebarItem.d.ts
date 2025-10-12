import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type SidebarItem = {
  label: string;
  href: string;
  icon: ReactNode | LucideIcon;
  openInNewTab?: boolean;
};
