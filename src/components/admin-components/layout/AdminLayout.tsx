import Sidebar from "../sidebar";
import AdminNavbar from "../navbar";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../../lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Use the auth hook for logout functionality
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop sidebar - only show on large screens (1024px+) */}
      <div
        className="hidden lg:block
        fixed
        top-0
        left-0
        z-40"
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onSubtabChange={() => {}}
        />
      </div>
      {/* Mobile/Tablet overlay sidebar (expanded only when opened) */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setIsMobileSidebarOpen(false);
            }}
            onLogout={handleLogout}
            isCollapsed={false}
            onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            onSubtabChange={() => {}}
          />
        </div>
      )}
      <div className={`flex flex-col min-h-screen w-full`}>
        <div className="">
          <AdminNavbar
            title={pageTitle}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
