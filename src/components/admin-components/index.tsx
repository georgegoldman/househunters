import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./sidebar";
import AdminNavbar from "./navbar";
import Dashboard from "./dashboard/dashboard";
import PropertyManagement from "./dashboard/property-management";
import CustomerRequests from "./dashboard/customer-requests";
import UserManagement from "./dashboard/user-management";
import Analytics from "./dashboard/analytics";
import Settings from "./dashboard/settings";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubtab, setActiveSubtab] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize active section from URL on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveSection(tabFromUrl);
    }
  }, [searchParams]);

  const handleLogout = () => {
    console.log("Logging out...");
    // Handle logout logic here
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Update URL with the new tab
    setSearchParams({ tab: section });
  };

  const handleSubtabChange = (subtab: string) => {
    setActiveSubtab(subtab);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "property":
        return <PropertyManagement />;
      case "customer":
        return <CustomerRequests />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const getNavbarTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "property":
        return "Property Management";
      case "customer":
        return "Customer Request/Review";
      case "users":
        return "User Management";
      case "analytics":
        return "Reports & Analytics";
      case "settings":
        return "Settings";

      default:
        return "Dashboard";
    }
  };

  const shouldShowNavbar = true;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop sidebar - only show on large screens (1024px+) */}
      <div
        className="hidden lg:block 
        fixed
        top-0
        left-0
        z-40"
      >
        <Sidebar
          onLogout={handleLogout}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          activeSubtab={activeSubtab}
          onSubtabChange={handleSubtabChange}
        />
      </div>
      {/* Mobile/Tablet overlay sidebar (expanded only when opened) */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden">
          <Sidebar
            onLogout={handleLogout}
            activeSection={activeSection}
            onSectionChange={(section) => {
              handleSectionChange(section);
              setIsMobileSidebarOpen(false);
            }}
            isCollapsed={false}
            onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            activeSubtab={activeSubtab}
            onSubtabChange={handleSubtabChange}
          />
        </div>
      )}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
        }`}
      >
        {shouldShowNavbar && (
          <AdminNavbar
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            title={getNavbarTitle()}
          />
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-x-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
