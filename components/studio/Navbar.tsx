import AuthButton from "@/components/auth/AuthButton";
import StudioUploadButton from "@/components/studio/UploadButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-background flex items-center px-3 z-50 select-none">
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger />
          <Link
            prefetch
            href="/studio"
            className="p-3 text-xl font-semibold tracking-tight"
          >
            Glitch Studio
          </Link>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-4">
          <StudioUploadButton />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default StudioNavbar;
