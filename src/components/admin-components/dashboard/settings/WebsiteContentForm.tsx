import { useMemo, useRef, useState } from "react";
import UploadIcon from "../../../../assets/upload-icon";
import CaretDown from "../../../../assets/caret-down";
import DeleteIcon from "../../../../assets/delete-icon";
import TickIconSm from "../../../../assets/tick-icon-sm";
import PropertyImage1 from "../../../../assets/property-image-1.jpg";

type UploadState = "idle" | "uploading" | "completed";

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  status: "Available" | "Rented";
  date: string;
  image: string;
}

const mockProps: FeaturedProperty[] = [1, 2, 3, 4, 5].map((n) => ({
  id: `HP-${1020 + n}`,
  title: `#P-${1020 + n} . 2 - Bedroom Apartment`,
  location: "Lekki phase 1, Lagos",
  price: "₦850,000 / month",
  status: "Available",
  date: "12 August 2025",
  image: PropertyImage1,
}));

const WebsiteContentForm: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [bannerText, setBannerText] = useState("");
  // kept simple for now; dropdown is a static trigger in current UI
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const selectLabel = useMemo(
    () =>
      selectedIds.length
        ? `${selectedIds.length} selected`
        : "Select Properties to show on homepage",
    [selectedIds.length]
  );

  const onPick = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(
      `${file.name.split(".")[0]}.${file.name.split(".").pop()?.toUpperCase()}`
    );
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadState("uploading");
    setProgress(0);
    // Simulate upload
    const start = Date.now();
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 5);
        if (next === 100 || Date.now() - start > 4000) {
          clearInterval(timer);
          setUploadState("completed");
        }
        return next;
      });
    }, 150);
  };

  const removeFile = () => {
    setUploadState("idle");
    setProgress(0);
    setFileName("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit hook
  };

  return (
    <form onSubmit={onSubmit} className="p-[15px] md:p-6">
      <h2 className="text-[18px] font-semibold mb-4">Website Content</h2>

      {/* Homepage Banner */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-black/80">
          Homepage Banner
        </label>
        <span className="text-xs text-black/60">Upload images</span>
        <div className="rounded-[10px] border border-dashed border-black/20 bg-[#EAEAEA] h-[180px] md:h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-black/50 mb-3">
              Upload Homepage hero banner (1200x400PX)
            </p>
            <button
              type="button"
              onClick={onPick}
              className="mx-auto inline-flex items-center gap-2 bg-white shadow-sm rounded-[10px] px-4 py-2 text-sm"
            >
              <span>Upload</span>
              <UploadIcon />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
          </div>
        </div>

        {/* Upload list item under the drop area */}
        {uploadState !== "idle" && (
          <div className="mt-3 rounded-[10px] border border-black/10 bg-white p-3 flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
              <img
                src={previewUrl || PropertyImage1}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {fileName || "Image .JPEG"}
                </p>
                {uploadState === "completed" && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-black/60 hover:text-red-500"
                  >
                    <DeleteIcon width={15} height={15} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-black/60 flex items-center gap-1">
                <span>10 MB</span>
                {uploadState === "uploading" && (
                  <span className="text-black">Uploading...</span>
                )}
                {uploadState === "completed" && (
                  <span className="inline-flex items-center gap-1 text-[#009442]">
                    <TickIconSm />
                    Completed
                  </span>
                )}
              </p>
              {uploadState !== "completed" && (
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Banner text */}
      <div className="mt-4">
        <label className="block text-sm text-black/70 mb-1">Banner Text</label>
        <input
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          placeholder="Enter main tagline for homepage"
          className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
          type="text"
        />
      </div>

      {/* Featured Listing */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-black/80 mb-2">
          Featured Listing
        </h3>
        <label className="block text-xs text-black/60 mb-1">
          Select Properties
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full flex items-center justify-between rounded-[10px] border border-black/10 px-3 py-3 text-sm bg-transparent"
          >
            <span
              className={`${
                selectedIds.length ? "text-black" : "text-black/40"
              }`}
            >
              {selectLabel}
            </span>
            <span className="text-black/70">
              <CaretDown />
            </span>
          </button>
        </div>

        {/* table-like list (horizontally scrollable on small screens) */}
        <div className="mt-3 rounded-[10px] border border-black/10 overflow-x-auto">
          <div className="min-w-[720px]">
            {mockProps.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-3 py-3 border-b last:border-b-0 border-black/10 bg-white"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => toggleSelected(p.id)}
                  className="w-4 h-4"
                />
                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt="property"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <p className="text-black font-medium">{p.title}</p>
                  <p className="text-black/60">{p.location}</p>
                </div>
                <div className="text-xs text-black/80 w-28">{p.price}</div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {p.status}
                </span>
                <div className="text-xs text-black/60 w-32 text-right">
                  {p.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Duration */}
      <div className="mt-6">
        <label className="block text-sm text-black/70 mb-1">
          Featured Duration
        </label>
        <div className="relative">
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={`appearance-none w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm pr-10 ${
              duration ? "text-black" : "text-black/40"
            }`}
          >
            <option value="" disabled>
              Select how long will the properties be in the featured section
            </option>
            <option value="5 days">5 days</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="3 weeks">3 weeks</option>
            <option value="1 month">1 month</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70">
            <CaretDown />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-[10px] bg-black text-white py-3 text-sm font-medium hover:bg-black/90"
        >
          Save Website Content
        </button>
      </div>
    </form>
  );
};

export default WebsiteContentForm;
