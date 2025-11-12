import React, { useState, useEffect } from "react";
import CloseIcon from "../assets/close-icon";
import SuccessModal from "./success-modal";
import UploadIcon from "../assets/upload-icon";
import type { Property } from "../types/property";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (updatedProperty: Property) => void;
}

type FormData = {
  main_image: string;
  images: string[];
  description: string;
  area: number | "";
  price: number | "";
  owner: string;
  owner_phone: string;
  address: string;
  city: string;
  sold: boolean;
  rented: boolean;
  show: boolean;
  isForRent: boolean;
  imagesFiles: File[];
};

const emptyForm: FormData = {
  main_image: "",
  images: [],
  description: "",
  area: "",
  price: "",
  owner: "",
  owner_phone: "",
  address: "",
  city: "",
  sold: false,
  rented: false,
  show: true,
  isForRent: false,
  imagesFiles: [],
};

/** ---------- Cloudinary (unsigned) helpers ---------- */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const CLOUDINARY_BASE_FOLDER = "house_hunters/properties";

function requireEnv(v: string | undefined, name: string) {
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

async function uploadToCloudinaryUnsigned(
  file: File,
  folder: string
): Promise<string> {
  requireEnv(CLOUD_NAME, "VITE_CLOUDINARY_CLOUD_NAME");
  requireEnv(UPLOAD_PRESET, "VITE_CLOUDINARY_UPLOAD_PRESET");

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  if (folder) fd.append("folder", folder);

  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}) ${txt}`);
  }
  const json = await res.json();
  return json.secure_url as string;
}

async function uploadMany(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) {
    urls.push(await uploadToCloudinaryUnsigned(f, folder));
  }
  return urls;
}
/** --------------------------------------- */

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  onClose,
  property,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!property) {
      setFormData(emptyForm);
      setErrors({});
      return;
    }
    setFormData({
      main_image: property.main_image || "",
      images: property.images || [],
      description: property.description || "",
      area: property.area ?? "",
      price: property.price ?? "",
      owner: property.owner || "",
      owner_phone: property.owner_phone || "",
      address: property.address || "",
      city: property.city || "",
      sold: !!property.sold,
      rented: !!property.rented,
      show: !!property.show,
      isForRent: !!property.isForRent,
      imagesFiles: [],
    });
    setErrors({});
  }, [property]);

  if (!isOpen || !property) return null;

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (formData.price === "" || Number.isNaN(Number(formData.price)))
      e.price = "Valid price is required";
    if (formData.area === "" || Number.isNaN(Number(formData.area)))
      e.area = "Valid area is required";

    const hasUpload = formData.imagesFiles.length > 0;
    if (!hasUpload && !formData.main_image.trim())
      e.main_image = "Provide a main image URL or upload a file";

    if (!formData.description.trim()) e.description = "Description is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // file handlers
  const handleFileInput = (files: File[]) => setField("imagesFiles", files);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileInput(Array.from(e.target.files || []));
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileInput(Array.from(e.dataTransfer.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      // 1) Upload files to Cloudinary (browser → Cloudinary)
      let uploadedUrls: string[] = [];
      if (formData.imagesFiles.length > 0) {
        const folder = `${CLOUDINARY_BASE_FOLDER}/${property.id}`;
        uploadedUrls = await uploadMany(formData.imagesFiles, folder);
      }

      // 2) Merge URLs
      const existing = (formData.images || []).filter(
        (u) => u && u.trim() !== ""
      );
      const images = Array.from(new Set([...existing, ...uploadedUrls]));

      // 3) Choose main image
      const main_image =
        (formData.main_image || "").trim() ||
        uploadedUrls[0] ||
        property.main_image ||
        "";

      // 4) Build backend payload and let parent save to API
      const updated: Property = {
        ...property,
        main_image,
        images,
        description: formData.description,
        area: Number(formData.area),
        price: Number(formData.price),
        owner: formData.owner,
        owner_phone: formData.owner_phone,
        address: formData.address,
        city: formData.city,
        sold: formData.sold,
        rented: formData.rented,
        show: formData.show,
        isForRent: formData.isForRent,
      };
      await onSave(updated); // parent calls api.admin.updateProperty(updated.id, updated)
      setShowSuccess(true);
      setField("imagesFiles", []);
    } catch (error) {
      console.error("Error updating property:", error);
      alert((error as Error).message || "Upload failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="absolute inset-0 w-full max-w-full overflow-auto bg-white p-2 shadow-lg sm:top-0 sm:right-0 sm:left-auto sm:h-full sm:max-w-[clamp(25rem,50vw,50rem)] sm:p-[clamp(0.5rem,2vw,1rem)]">
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="flex cursor-pointer p-2 sm:p-[clamp(0.5rem,1vw,1rem)]"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          className="flex flex-col gap-6 p-4 sm:gap-[clamp(2rem,4vw,3.125rem)] sm:p-[clamp(1rem,3vw,1.5rem)]"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <header className="flex flex-col items-center gap-3 text-center sm:gap-[clamp(0.75rem,2vw,1rem)]">
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900 sm:text-[clamp(1.25rem,3vw,2rem)]"
            >
              Edit Property
            </h2>
            <p className="max-w-[clamp(20rem,40vw,35rem)] text-sm leading-relaxed text-black/60 sm:text-[clamp(0.875rem,2vw,1rem)]">
              Update the details below and save your changes.
            </p>
          </header>

          {/* Details (address, city, price, area, owner, phone, description) */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Address */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="address"
              >
                Address
              </label>
              <input
                id="address"
                value={formData.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="32 Asimou Bamgbose St, Surulere"
                className={`rounded-lg border px-3 py-3 text-sm ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                required
              />
              {errors.address && (
                <span className="text-sm text-red-500">{errors.address}</span>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Lagos"
                className={`rounded-lg border px-3 py-3 text-sm ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                required
              />
              {errors.city && (
                <span className="text-sm text-red-500">{errors.city}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="price"
              >
                Price (NGN)
              </label>
              <input
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setField(
                    "price",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="250000"
                className={`rounded-lg border px-3 py-3 text-sm ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                type="number"
                min={0}
                required
              />
              {errors.price && (
                <span className="text-sm text-red-500">{errors.price}</span>
              )}
            </div>

            {/* Area */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="area"
              >
                Area (m²)
              </label>
              <input
                id="area"
                value={formData.area}
                onChange={(e) =>
                  setField(
                    "area",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="120"
                className={`rounded-lg border px-3 py-3 text-sm ${
                  errors.area ? "border-red-500" : "border-gray-300"
                }`}
                type="number"
                min={0}
                required
              />
              {errors.area && (
                <span className="text-sm text-red-500">{errors.area}</span>
              )}
            </div>

            {/* Owner */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="owner"
              >
                Owner
              </label>
              <input
                id="owner"
                value={formData.owner}
                onChange={(e) => setField("owner", e.target.value)}
                placeholder="Jane Doe"
                className="rounded-lg border border-gray-300 px-3 py-3 text-sm"
                type="text"
              />
            </div>

            {/* Owner Phone */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="owner_phone"
              >
                Owner Phone
              </label>
              <input
                id="owner_phone"
                value={formData.owner_phone}
                onChange={(e) => setField("owner_phone", e.target.value)}
                placeholder="+2349063423921"
                className="rounded-lg border border-gray-300 px-3 py-3 text-sm"
                type="tel"
              />
            </div>

            {/* Description (full width) */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="3-bed, 2-bath apartment with balcony and parking."
                rows={4}
                className={`resize-vertical rounded-lg border px-3 py-3 text-sm ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description}
                </span>
              )}
            </div>
          </section>

          {/* Images */}
          <section className="flex flex-col gap-4">
            {/* Main Image URL */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="main_image"
              >
                Main Image URL
              </label>
              <input
                id="main_image"
                value={formData.main_image}
                onChange={(e) => setField("main_image", e.target.value)}
                placeholder="https://res.cloudinary.com/.../image/upload/v.../photo.jpg"
                className={`rounded-lg border px-3 py-3 text-sm ${
                  errors.main_image ? "border-red-500" : "border-gray-300"
                }`}
                type="url"
              />
              {errors.main_image && (
                <span className="text-sm text-red-500">
                  {errors.main_image}
                </span>
              )}
            </div>

            {/* Extra Image URLs list */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Extra Image URLs
              </label>
              {formData.images.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = [...formData.images];
                      next[i] = e.target.value;
                      setField("images", next);
                    }}
                    placeholder="https://res.cloudinary.com/.../image/upload/..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm"
                    type="url"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "images",
                        formData.images.filter((_, idx) => idx !== i)
                      )
                    }
                    className="rounded border px-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setField("images", [...formData.images, ""])}
                className="self-start rounded border px-3 py-1 text-sm"
              >
                + Add URL
              </button>
            </div>

            {/* Drag/drop file uploads */}
            <div
              className={`rounded-lg border-1 border-dashed bg-[#EAEAEA] p-4 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-black/50">
                  Drop image files here (optional)
                </p>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("images")?.click()}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-black/90"
                >
                  <span>Upload</span>
                  <UploadIcon />
                </button>
              </div>
              {formData.imagesFiles.length > 0 && (
                <div className="mt-3 space-y-1 text-left">
                  {formData.imagesFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm text-black/70"
                    >
                      <span>{f.name}</span>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() =>
                          setField(
                            "imagesFiles",
                            formData.imagesFiles.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <CloseIcon width={15} height={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Status & Flags */}
          <section className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.sold}
                onChange={(e) => setField("sold", e.target.checked)}
              />
              <span>Sold</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.rented}
                onChange={(e) => setField("rented", e.target.checked)}
              />
              <span>Rented</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isForRent}
                onChange={(e) => setField("isForRent", e.target.checked)}
              />
              <span>For Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.show}
                onChange={(e) => setField("show", e.target.checked)}
              />
              <span>Visible (Show)</span>
            </label>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className={`relative w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white ${
                isSaving ? "cursor-not-allowed opacity-70" : "hover:bg-gray-800"
              }`}
            >
              <span className={isSaving ? "opacity-0" : ""}>Save</span>
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        title="Property Updated Successfully!"
        description="Your property has been updated successfully."
      />
    </div>
  );
};

export default EditPropertyModal;
