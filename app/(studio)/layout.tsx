import StudioNavbar from "@/components/studio/Navbar";
import StudioSidebar from "@/components/studio/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

const StudioLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-14 px-5">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
