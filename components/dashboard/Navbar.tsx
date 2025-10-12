import AuthButton from "@/components/auth/AuthButton";
import Searchbar from "@/components/dashboard/Searchbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const DashboardNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-background flex items-center px-3 z-50 select-none">
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger />
          <Link
            prefetch
            href="/"
            className="p-3 text-xl font-semibold tracking-tight"
          >
            Glitch
          </Link>
        </div>
        <div className="flex-1 flex justify-end md:justify-center ml-auto md:mr-auto">
          <Searchbar />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
