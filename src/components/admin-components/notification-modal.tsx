import { useState, useEffect } from "react";
import SearchIcon from "../../assets/search-icon";
import CloseIcon from "../../assets/close-icon";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "inquiry" | "property" | "payment" | "listing";
  isRead: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange?: (count: number) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNotificationCountChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample notification data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Inquiry Received",
      description:
        "John Deo sent a request about 2-Bed Apartment in Lekki phase 1",
      timestamp: "2 mins ago",
      type: "inquiry",
      isRead: false,
    },
    {
      id: "2",
      title: "New Property Added",
      description:
        "Admin Sarah added 4-Bedroom Duplex in Abuja, Gwarimpa for sale",
      timestamp: "Yesterday 11:15 AM",
      type: "property",
      isRead: false,
    },
    {
      id: "3",
      title: "Payment Received",
      description:
        "Payment of ₦500,000 received for 3-Bedroom Apartment in Victoria Island",
      timestamp: "2 hours ago",
      type: "payment",
      isRead: true,
    },
    {
      id: "4",
      title: "Listing Updated",
      description:
        "Property listing for 2-Bedroom Flat in Ikeja has been updated",
      timestamp: "3 hours ago",
      type: "listing",
      isRead: true,
    },
  ];

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate unread notification count
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Pass the count to parent component
  useEffect(() => {
    if (onNotificationCountChange) {
      onNotificationCountChange(unreadCount);
    }
  }, [unreadCount, onNotificationCountChange]);

  const getActionButtons = (type: string) => {
    switch (type) {
      case "inquiry":
        return (
          <>
            <button className="p-[10px] flex-1 bg-black text-white text-sm rounded-[10px] hover:bg-gray-800 transition-colors">
              View Request
            </button>
            <button className="p-[10px] flex-1 bg-white text-black text-sm rounded-[10px] hover:bg-gray-50 transition-colors">
              Mark as Read
            </button>
          </>
        );
      case "property":
        return (
          <>
            <button className="p-[10px] flex-1 bg-black text-white text-sm rounded-[10px] hover:bg-gray-800 transition-colors">
              View Listing
            </button>
            <button className="p-[10px] flex-1 bg-white text-black text-sm rounded-[10px] hover:bg-gray-50 transition-colors">
              Edit Listing
            </button>
          </>
        );
      case "payment":
        return (
          <>
            <button className="p-[10px] flex-1 bg-black text-white text-sm rounded-[10px] hover:bg-gray-800 transition-colors">
              Review Payment
            </button>
            <button className="p-[10px] flex-1 bg-white text-black text-sm rounded-[10px] hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </>
        );
      case "listing":
        return (
          <>
            <button className="p-[10px] flex-1 bg-black text-white text-sm rounded-[10px] hover:bg-gray-800 transition-colors">
              View Listing
            </button>
            <button className="p-[10px] flex-1 bg-white text-black text-sm rounded-[10px] hover:bg-gray-50 transition-colors">
              Reply
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[691px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-[24px] font-bold text-black">Notifications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close notifications"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for property"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F4F4F4] rounded-lg border-none outline-none text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-[20px]">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Today</h3>
              <div className="flex flex-col gap-[20px]">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`py-[10px] px-[15px] rounded-[15px] bg-[#EBEBEB] flex flex-col gap-[10px]`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-black text-base">
                        {notification.title}
                      </h4>
                    </div>
                    <p className="text-xs text-black/60">
                      {notification.description}
                    </p>
                    <span className="text-[10px] text-black/60 flex justify-end">
                      {notification.timestamp}
                    </span>
                    <div className="flex items-center gap-[20px]">
                      {getActionButtons(notification.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
