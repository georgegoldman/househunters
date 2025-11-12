import { useRef, useState, useEffect } from "react";
import AvatarImg from "../../../../assets/avatar.jpg";
import EyeIconBlack from "../../../../assets/eye-icon-black";
import CameraIcon from "../../../../assets/camera-icon";
import { api } from "../../../../lib/api";

interface ProfileFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const ProfileSettingsForm: React.FC = () => {
  const [form, setForm] = useState<ProfileFormState>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(AvatarImg);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch admin information on component mount
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.admin.me();

        // Populate form with admin data
        setForm((prev) => ({
          ...prev,
          email: response.user.email,
          // Note: We don't have fullName or phone from the API response
          // These would need to be added to the backend if needed
        }));
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
        setError("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit hook
  };

  if (loading) {
    return (
      <div className="p-[15px] md:p-6">
        <h2 className="text-[18px] font-semibold mb-4">Profile Settings</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-[15px] md:p-6">
        <h2 className="text-[18px] font-semibold mb-4">Profile Settings</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="p-[15px] md:p-6">
      <h2 className="text-[18px] font-semibold mb-4">Profile Settings</h2>

      {/* Avatar section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px]">
          <img
            src={avatarPreview}
            alt="Profile avatar"
            className="w-full h-full rounded-full object-cover border border-black/10"
          />
          <button
            type="button"
            onClick={onPickAvatar}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/90"
            aria-label="Change avatar"
          >
            <CameraIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarSelected}
          />
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-black/70 mb-1">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="e,g John Deo"
            className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm text-black/70 mb-1">
            Email Address
          </label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="e,g Johndeo@gmail.com"
            className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm text-black/70 mb-1">
            Phone Number
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="e,g 09012345678"
            className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
            type="tel"
          />
        </div>

        <div>
          <label className="block text-sm text-black/70 mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="********"
              className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40 pr-10"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
              aria-label="Toggle password visibility"
            >
              <EyeIconBlack />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-[10px] bg-black text-white py-3 text-sm font-medium hover:bg-black/90"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
