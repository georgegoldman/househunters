import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import SearchIcon from "../../assets/search-icon";
import CalendarIcon from "../../assets/calendar-icon";
import NotifBigIcon from "../../assets/notif-big-icon";
import Avatar from "../../assets/avatar-3.svg";
import NotificationModal from "./notification-modal";

interface AdminNavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

interface UserProfile {
  name: string;
  avatar: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  title = "Dashboard",
  onMenuClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const userProfile: UserProfile = { name: "Admin User", avatar: Avatar };

  // Update current date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      // Show mobile menu for screens smaller than 1024px (includes tablets)
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleNotificationClick = (): void => {
    setIsNotificationModalOpen(true);
  };

  const handleNotificationCountChange = (count: number): void => {
    setNotificationCount(count);
  };

  const handleProfileClick = (): void => {
    // Handle profile click
  };

  return (
    <>
      <nav
        className="sticky top-0 z-30 flex items-center justify-between p-4 md:p-5  bg-gray-50 w-full border-b border-gray-200"
        role="banner"
        aria-label="Admin navigation"
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu button (hamburger) */}
          {isMobile && (
            <button
              aria-label="Open menu"
              onClick={onMenuClick}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
            >
              <Menu size={18} />
            </button>
          )}
          <h1 className="text-sm w-[140px] md:w-[200px] md:text-xl font-semibold text-gray-900 flex-shrink-0">
            {title}
          </h1>
        </div>

        {/*<form
          onSubmit={handleSearchSubmit}
          className={`
          relative
          bg-gray-100
          rounded-full
          flex
          items-center
          transition-all
          duration-200

          ${isMobile ? "hidden" : "w-64 lg:w-80 h-10"}
        `}
        >
          <label htmlFor="property-search" className="sr-only">
            Search for property
          </label>
          <input
            id="property-search"
            name="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for property..."
            className="
            px-12
            py-2
            placeholder:text-sm
            placeholder:text-black/50
            text-sm
            w-full
            bg-transparent
            border-none
            outline-none
            rounded-full
          "
          />
          <button
            type="submit"
            className="
            absolute
            left-3
            top-1/2
            transform
            -translate-y-1/2
            hover:scale-110
            transition-transform
          "
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </form>*/}

        <div className="flex gap-3 items-center">
          {!isMobile && (
            <div className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-full">
              <time
                dateTime={new Date().toISOString().split("T")[0]}
                className="text-sm text-black/70 font-medium whitespace-nowrap"
              >
                {currentDate}
              </time>
              <CalendarIcon />
            </div>
          )}

          {/* Notification Button */}
          <button
            onClick={handleNotificationClick}
            className="
            relative
            bg-gray-100
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            hover:bg-gray-200
            transition-all
            duration-200
            group
          "
            aria-label={`Notifications${
              notificationCount > 0 ? ` (${notificationCount} new)` : ""
            }`}
            title={`Notifications${
              notificationCount > 0 ? ` (${notificationCount} new)` : ""
            }`}
          >
            <div className="group-hover:scale-110 transition-transform">
              <NotifBigIcon />
            </div>
            {notificationCount > 0 && (
              <span
                className="
                absolute
                -top-1
                -right-1
                bg-red-500
                text-white
                text-xs
                font-bold
                rounded-full
                w-5
                h-5
                flex
                items-center
                justify-center
              "
                aria-hidden="true"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          <button
            onClick={handleProfileClick}
            className="
            relative
            hover:scale-105
            rounded-full
            transition-all
            duration-200
            group
          "
            aria-label={`User profile: ${userProfile.name}`}
            title={`User profile: ${userProfile.name}`}
          >
            <img
              src={userProfile.avatar}
              alt={`${userProfile.name}'s profile picture`}
              className="
              w-10
              h-10
              rounded-full
              object-cover
              ring-2
              ring-transparent
              group-hover:ring-gray-300
              transition-all
              duration-200
            "
            />
          </button>
        </div>
      </nav>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onNotificationCountChange={handleNotificationCountChange}
      />
    </>
  );
};

export default AdminNavbar;
