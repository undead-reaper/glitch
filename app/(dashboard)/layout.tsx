import DashboardNavbar from "@/components/dashboard/Navbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

const DashboardLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <DashboardNavbar />
        <div className="flex min-h-screen p-14">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
