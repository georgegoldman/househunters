import { useState, useEffect } from "react";
import CloseIcon from "../../assets/close-icon";
import Logo from "../../assets/admin-house-hunters-logo.svg";
import AnalyticsIcon from "../../assets/analytics-icon";
import CollapsableIcon from "../../assets/collapsable-icon";
import DashboardIcon from "../../assets/dashboard-icon";
import HouseIcon from "../../assets/house-icon";
import SettingsIcon from "../../assets/settings-icon";
import UserIcon from "../../assets/user-icon";
import UsersIcon from "../../assets/users-icon";
// import UserGroupIcon from "../../assets/user-group-icon";
import ArrowDownIcon from "../../assets/arrow-down";
import LogoutIcon from "../../assets/logout-icon";
import { useAuth } from "../../lib/auth"; // Import the auth hook

interface IconProps {
  isActive: boolean;
}

interface SubNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  subtabs?: SubNavItem[];
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (item: NavItem) => void;
  onToggleExpand: (itemId: string) => void;
  activeSubtab?: string;
  onSubtabClick: (parentId: string, subtabId: string) => void;
}

interface SidebarProps {
  onLogout?: () => void; // Made optional since we handle auth internally now
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeSubtab?: string;
  onSubtabChange: (subtab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout, // Keep this for backward compatibility, but we'll use auth internally
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
  activeSubtab,
  onSubtabChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Use the auth hook to get logout function and user info
  const { logout, user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      // Show mobile behavior for screens smaller than 1024px (includes tablets)
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigationItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      id: "property",
      label: "Property Management",
      icon: HouseIcon,
    },
    {
      id: "customer",
      label: "Customer Request",
      icon: UsersIcon,
    },
    {
      id: "users",
      label: "User Management",
      icon: UserIcon,
    },
    {
      id: "analytics",
      label: "Reports & Analytics",
      icon: AnalyticsIcon,
    },
  ];

  const bottomItems: NavItem[] = [
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.subtabs) {
      // If item has subtabs, toggle expansion
      onToggleExpand(item.id);
    } else {
      // If no subtabs, navigate directly
      onSectionChange(item.id);
      // Close sidebar on mobile after navigation
      if (isMobile && !isCollapsed) {
        onToggleCollapse();
      }
    }
  };

  const handleSubtabClick = (parentId: string, subtabId: string) => {
    onSectionChange(parentId);
    onSubtabChange(subtabId);
    // Close sidebar on mobile after navigation
    if (isMobile && !isCollapsed) {
      onToggleCollapse();
    }
  };

  const onToggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);

    // Use the auth logout function directly
    logout();

    // Also call the onLogout prop if provided (for backward compatibility)
    if (onLogout) {
      onLogout();
    }
  };

  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const NavItem: React.FC<NavItemProps> = ({
    item,
    isActive,
    isExpanded,
    onClick,
    activeSubtab,
    onSubtabClick,
  }) => {
    const IconComponent = item.icon;
    const hasSubtabs = item.subtabs && item.subtabs.length > 0;
    const isParentActive = isActive || (hasSubtabs && activeSubtab);

    return (
      <div className="space-y-1">
        <button
          onClick={() => onClick(item)}
          className={`
            p-3
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            transition-all
            duration-200
            ease-in-out
            group
            ${
              isParentActive
                ? "bg-white text-black/70 hover:bg-gray-100"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }
            ${isCollapsed ? "justify-center" : ""}
          `}
          aria-label={item.label}
          title={isCollapsed ? item.label : undefined}
        >
          <div
            className={`flex-shrink-0 transition-colors ${
              isParentActive
                ? "text-black/70"
                : "text-white/70 group-hover:text-white"
            }`}
          >
            <IconComponent isActive={!!isParentActive} />
          </div>
          {!isCollapsed && (
            <>
              <span
                className={`
                text-sm
                font-medium
                transition-colors
                flex-1
                text-left
                ${
                  isParentActive
                    ? "text-black/70"
                    : "text-white/70 group-hover:text-white"
                }
              `}
              >
                {item.label}
              </span>
              {hasSubtabs && (
                <div
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <ArrowDownIcon />
                </div>
              )}
            </>
          )}
        </button>

        {/* Subtabs */}
        {hasSubtabs && isExpanded && !isCollapsed && (
          <div className="ml-6 space-y-1">
            {item.subtabs!.map((subtab) => {
              const SubtabIconComponent = subtab.icon;
              return (
                <button
                  key={subtab.id}
                  onClick={() => onSubtabClick(item.id, subtab.id)}
                  className={`
                    p-2
                    w-full
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    transition-all
                    duration-200
                    ease-in-out
                    text-sm
                    ${
                      activeSubtab === subtab.id
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  `}
                  aria-label={subtab.label}
                >
                  {SubtabIconComponent && <SubtabIconComponent />}
                  <span className="font-medium">{subtab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <aside
      className={`
        bg-[#1A1A1A]
        p-5
        flex
        flex-col
        justify-between
        h-screen
        text-white
        transition-all
        duration-300
        ease-in-out
        
        ${isCollapsed && !isMobile ? "w-16 md:w-20" : "w-64 md:w-80"}
        flex-shrink-0
        ${isMobile && !isCollapsed ? "admin-sidebar-content" : "hidden lg:flex"}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        {/* Logo and Collapse Button */}
        <div
          className={`
          flex
          items-center
          py-2
          pl-2
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}
        >
          {!isCollapsed && (
            <a
              href="/admin"
              className="flex-shrink-0 hover:opacity-80"
              aria-label="Go to homepage"
            >
              <img src={Logo} alt="House Hunters Admin Logo" className="h-8" />
            </a>
          )}

          {isMobile && !isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-md hover:bg-white/10"
              aria-label="Close menu"
              title="Close menu"
            >
              {/* <CloseIcon /> */}
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className={`
                cursor-pointer
                p-2
                rounded-md
                hover:bg-white/10
                transition-all
                ${isCollapsed ? "rotate-180" : ""}
              `}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CollapsableIcon />
            </button>
          )}
        </div>

        {/* User Info Section (Optional - shows logged in user) */}
        {!isCollapsed && user && (
          <div className="px-3 py-2 bg-white/5 rounded-lg">
            <p className="text-xs text-white/60">Logged in as</p>
            <p className="text-sm text-white font-medium truncate">
              {user.email}
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              isExpanded={expandedItems.includes(item.id)}
              onClick={handleNavClick}
              onToggleExpand={onToggleExpand}
              activeSubtab={activeSubtab}
              onSubtabClick={handleSubtabClick}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 mt-auto">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            isExpanded={false}
            onClick={handleNavClick}
            onToggleExpand={onToggleExpand}
            activeSubtab={activeSubtab}
            onSubtabClick={handleSubtabClick}
          />
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            p-3
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            transition-all
            duration-200
            ease-in-out
            text-white/70
            hover:text-white
            hover:bg-red-500/20
            group
            ${isCollapsed ? "justify-center" : ""}
          `}
          aria-label="Logout"
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className="flex-shrink-0 text-white/70 group-hover:text-red-400 transition-colors">
            <LogoutIcon />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-medium text-white/70 group-hover:text-red-400 transition-colors">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeLogoutModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-[20px] overflow-hidden">
              <div className="flex items-center justify-center relative px-5 py-4">
                <h3 className="text-[18px] font-semibold text-black">Logout</h3>
                <button
                  className="absolute right-4"
                  aria-label="Close"
                  onClick={closeLogoutModal}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="px-5 py-6 flex flex-col items-center justify-center gap-[30px]">
                <p className="text-base text-center text-black">
                  Are you sure you want to logout?
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    className="flex-1 py-3 rounded-[20px] bg-[#EAEAEA] text-[#F93131] text-xs font-medium hover:bg-red-50"
                    onClick={confirmLogout}
                  >
                    Yes, Logout
                  </button>
                  <button
                    className="flex-1 py-3 rounded-[20px] bg-black text-white text-xs font-medium hover:bg-black/90"
                    onClick={closeLogoutModal}
                  >
                    No, Don't Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );

  if (isMobile && !isCollapsed) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onToggleCollapse}
        />
        {sidebarContent}
      </>
    );
  }

  return sidebarContent;
};

export default Sidebar;
