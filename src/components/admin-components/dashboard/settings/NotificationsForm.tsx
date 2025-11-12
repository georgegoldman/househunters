import { useState } from "react";

interface NotificationSettings {
  emailNotification: boolean;
  pushNotification: boolean;
  requestAlert: boolean;
  viewAlert: boolean;
}

const NotificationsForm: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotification: false,
    pushNotification: false,
    requestAlert: false,
    viewAlert: false,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Save preferences logic here
    console.log("Saving notification preferences:", settings);
  };

  const ToggleSwitch: React.FC<{
    isOn: boolean;
    onChange: () => void;
  }> = ({ isOn, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
        ${isOn ? "bg-[#04B252]" : "bg-[#DDDDDD]"}
      `}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm
          ${isOn ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );

  return (
    <div className="p-[15px] flex flex-col gap-[23px] md:p-6">
      <h2 className="text-[16px] font-bold">Notifications</h2>

      <div className="flex flex-col gap-[23px] rounded-[10px] overflow-hidden">
        {/* Email Notification */}
        <div className="flex items-center justify-between px-4 py-4 border rounded-[10px] border-black/10">
          <span className="text-sm text-black/80">Email Notification</span>
          <ToggleSwitch
            isOn={settings.emailNotification}
            onChange={() => handleToggle("emailNotification")}
          />
        </div>

        {/* Push Notification */}
        <div className="flex items-center justify-between px-4 py-4 border rounded-[10px] border-black/10">
          <span className="text-sm text-black/80">Push Notification</span>
          <ToggleSwitch
            isOn={settings.pushNotification}
            onChange={() => handleToggle("pushNotification")}
          />
        </div>

        {/* Request Alert */}
        <div className="flex items-center justify-between px-4 py-4 border rounded-[10px] border-black/10">
          <span className="text-sm text-black/80">Request Alert</span>
          <ToggleSwitch
            isOn={settings.requestAlert}
            onChange={() => handleToggle("requestAlert")}
          />
        </div>

        {/* View Alert */}
        <div className="flex items-center justify-between px-4 py-4 border rounded-[10px] border-black/10">
          <span className="text-sm text-black/80">View Alert</span>
          <ToggleSwitch
            isOn={settings.viewAlert}
            onChange={() => handleToggle("viewAlert")}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-[10px] bg-black text-white py-3 text-sm font-medium hover:bg-black/90"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationsForm;
