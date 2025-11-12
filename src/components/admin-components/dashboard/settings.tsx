import { useState } from "react";
import UserIconSm from "../../../assets/user-icon-sm";
import BillIcon from "../../../assets/bill-icon";
import WriteIcon from "../../../assets/write-icon";
import NotificationBlackIcon from "../../../assets/notification-black-icon";
import ProfileSettingsForm from "./settings/ProfileSettingsForm";
import PaymentMethodForm from "./settings/PaymentMethodForm";
import WebsiteContentForm from "./settings/WebsiteContentForm";
import NotificationsForm from "./settings/NotificationsForm";

type SettingsTabKey = "profile" | "payment" | "content" | "notifications";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("profile");

  const tabs: {
    key: SettingsTabKey;
    label: string;
    Icon: React.ComponentType;
  }[] = [
    { key: "profile", label: "Profile Settings", Icon: UserIconSm },
    { key: "payment", label: "Payment Method", Icon: BillIcon },
    { key: "content", label: "Website Content", Icon: WriteIcon },
    {
      key: "notifications",
      label: "Notifications",
      Icon: NotificationBlackIcon,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsForm />;
      case "payment":
        return <PaymentMethodForm />;
      case "content":
        return <WebsiteContentForm />;
      case "notifications":
        return <NotificationsForm />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Tabs */}
        <div className="md:col-span-1 bg-[#FAFAFA] rounded-[15px] p-[10px] border border-black/5">
          <div className="flex flex-col gap-2.5">
            {tabs.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-3 rounded-tr-[20px] rounded-br-[20px] transition-colors ${
                    isActive
                      ? "bg-[#DBDBDB] border-l-[3px] border-[#000000]"
                      : "hover:bg-[#DBDBDB]"
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <Icon />
                  </span>
                  <span className="text-sm font-normal font-rubik text-black/70">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-3 bg-[#FAFAFA] rounded-[20px] border border-black/5 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
