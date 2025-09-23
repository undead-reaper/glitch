import { SidebarItem } from "@/types/SidebarItem";
import {
  Clock,
  Flame,
  History,
  Home,
  ListVideo,
  PlaySquare,
  SquareLibrary,
  ThumbsUp,
} from "lucide-react";

export const DASHBOARD_SIDEBAR_MAIN: SidebarItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Subcriptions",
    href: "/feed/subscriptions",
    icon: PlaySquare,
  },
  {
    label: "Trending",
    href: "/feed/trending",
    icon: Flame,
  },
];

export const DASHBOARD_SIDEBAR_YOU: SidebarItem[] = [
  {
    label: "History",
    href: "/feed/history",
    icon: History,
  },
  {
    label: "Playlists",
    href: "/feed/playlists",
    icon: ListVideo,
  },
  {
    label: "Your Videos",
    href: "/studio/content",
    icon: SquareLibrary,
  },
  {
    label: "Watch Later",
    href: "/playlist?list=WL",
    icon: Clock,
  },
  {
    label: "Liked Videos",
    href: "/playlist?list=LL",
    icon: ThumbsUp,
  },
];