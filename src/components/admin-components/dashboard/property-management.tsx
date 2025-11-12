/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/pages/property-management/index.tsx
import { useEffect, useMemo, useState } from "react";
import EyeIcon from "../../../assets/eye-icon";
import EditIcon from "../../../assets/edit-icon";
import DeleteIcon from "../../../assets/delete-icon";
import PlusIconWhite from "../../../assets/plus-icon-white";
import AddPropertyModal from "../../add-property-modal";
import EditPropertyModal from "../../edit-property-modal";
import DeleteConfirmationModal from "../../delete-confirmation-modal";
import { api } from "../../../lib/api";
import type { Property } from "../../../types/property";
import { http } from "../../../lib/http"; // <-- use axios client so x-api-key is sent

// UI extension for table-only display
interface PropertyWithDate extends Property {
  dateAdded: string;
}

/** ---------- Upload helpers (DO Spaces via backend signer) ---------- */

type FileLike = File;

const isFileLike = (v: any): v is FileLike =>
  v && typeof v === "object" && "size" in v && "type" in v;

type SignedPut = {
  url: string;
  key: string;
  publicUrl: string;
  isPublic: boolean;
};

function normalizeFilename(name: string) {
  const cleaned = (name || "file")
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-");
  return cleaned || `file-${Date.now()}`;
}

function guessContentType(file: FileLike) {
  if (file.type) return file.type;
  const ext = file.name?.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    svg: "image/svg+xml",
  };
  return (ext && map[ext]) || "application/octet-stream";
}

/** Ask backend for a pre-signed PUT URL (uses axios http so x-api-key is included) */
async function getSignedPut(file: FileLike, folder = "properties") {
  const params = {
    filename: normalizeFilename(file.name || "file"),
    type: guessContentType(file),
    folder,
    public: "true", // set "false" if you want private objects (and no publicUrl)
  };
  const res = await http.get<SignedPut>("/api/sign-upload", { params });
  return res.data;
}

/** PUT raw file to Spaces using the signed URL */
async function putFile(url: string, file: FileLike) {
  const ct = guessContentType(file);
  const r = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": ct }, // must match the signed Content-Type
    body: file,
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`Upload failed (${r.status}) ${txt}`);
  }
  return r.headers.get("ETag") || undefined;
}

/** High-level: upload one file and return its public URL */
async function uploadOneToSpaces(
  file: FileLike,
  folder = "properties"
): Promise<string> {
  const meta = await getSignedPut(file, folder);
  await putFile(meta.url, file);
  return meta.publicUrl;
}

/** Replace any File-like values in the payload with Spaces URLs */
async function materializeUploads(updated: Property | any): Promise<Property> {
  const folder = `properties/${updated?.id ?? "temp"}`;

  // main_image: string | File
  let main_image = updated.main_image;
  if (isFileLike(main_image)) {
    main_image = await uploadOneToSpaces(main_image, folder);
  }

  // images: (string|File)[]
  let images = updated.images;
  if (Array.isArray(images)) {
    const resolved: string[] = [];
    for (const item of images) {
      if (!item) continue;
      if (isFileLike(item)) {
        const url = await uploadOneToSpaces(item, folder);
        resolved.push(url);
      } else if (typeof item === "string") {
        resolved.push(item);
      }
    }
    // dedupe and drop blanks
    images = Array.from(new Set(resolved.filter(Boolean)));
  }

  return { ...updated, main_image, images };
}

/** ------------------------------------------------------------------ */

/** Format NGN nicely */
const formatMoney = (n: number) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n}`;
  }
};

/** Derive status from backend booleans */
const resolveStatus = (p: Property) => {
  if (p.sold) return "Sold";
  if (p.rented) return "Rented";
  if (p.isForRent) return "For Rent";
  return "Available";
};

const asDateLabel = (d?: string | number | Date) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/** Map backend -> UI (adds date label if API returns createdAt/created_at) */
const mapApiToUi = (p: Property): PropertyWithDate => ({
  ...p,
  dateAdded: asDateLabel((p as any).createdAt ?? (p as any).created_at),
});

const PropertyManagement = () => {
  const [properties, setProperties] = useState<PropertyWithDate[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] =
    useState<PropertyWithDate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔎 NEW: search query
  const [query, setQuery] = useState("");

  // Load properties from API
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // fetch ALL items (sale + rent) for admin
        const res = await api.properties.list({
          all: true,
          forsale: "both",
          page,
        });
        const mapped = (res?.data ?? []).map(mapApiToUi);
        if (alive) {
          setProperties(mapped);
          // Check if there are more pages by seeing if we got a full page (50 items)
          // If we got fewer than 50 items, we're on the last page
          setHasNextPage(mapped.length === 50);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load properties");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page]);

  // 🔎 NEW: filtered list (address or city)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((p) => {
      const addr = (p.address || "").toLowerCase();
      const city = (p.city || "").toLowerCase();
      return addr.includes(q) || city.includes(q);
    });
  }, [properties, query]);

  const handleDeleteProperty = (property: PropertyWithDate) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await api.admin.deleteProperty(propertyToDelete.id);
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch (e) {
      console.error("Error deleting property:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProperty = (property: PropertyWithDate) => {
    const { dateAdded, ...rest } = property as PropertyWithDate & {
      dateAdded: string;
    };
    setSelectedProperty(rest);
    setIsEditModalOpen(true);
  };

  const handleSaveProperty = async (updated: Property | any) => {
    try {
      // 1) Upload any File objects and replace with URLs
      const ready = await materializeUploads(updated);

      // 2) Persist
      const saved = await api.admin.updateProperty(ready);

      // 3) Merge back into the list, preserving dateAdded
      setProperties((prev) =>
        prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p))
      );
    } catch (e) {
      console.error("Error updating property:", e);
      alert("Failed to update property (upload or save). Check console.");
    }
  };

  const handleCreateProperty = async (created: Property) => {
    try {
      const { id: _ignore, ...payload } = created as any;
      const saved = await api.admin.createProperty(payload);

      if (!saved || typeof saved.id !== "number") {
        console.error("Unexpected createProperty response:", saved);
        alert("Backend did not return the created property as expected.");
        return;
      }

      // Optimistic insert
      setProperties((prev) => [
        mapApiToUi(saved),
        ...prev.filter((p) => p.id !== saved.id),
      ]);
      setIsAddModalOpen(false);

      // Optional refresh of the single item
      try {
        const one = await api.properties.getById({ id: saved.id });
        const fresh = one?.data ?? saved;
        setProperties((prev) => {
          const found = prev.find((p) => p.id === fresh.id);
          if (!found) return [mapApiToUi(fresh), ...prev];
          return prev.map((p) => (p.id === fresh.id ? mapApiToUi(fresh) : p));
        });
      } catch (e) {
        console.warn("[create] getById failed; keeping optimistic row:", e);
      }
    } catch (e: any) {
      const serverMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message;

      console.error("Error creating property:", e?.response ?? e);
      alert(
        serverMsg || "Failed to create property. Check console for details."
      );
    }
  };

  const togglePropertyVisibility = async (id: number) => {
    const current = properties.find((p) => p.id === id);
    if (!current) return;
    const nextVisible = !current.show;

    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, show: nextVisible } : p))
    );

    try {
      if (nextVisible) {
        await api.admin.showProperty(id);
      } else {
        await api.admin.hideProperty(id);
      }
    } catch (e) {
      // Revert on failure
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, show: current.show } : p))
      );
      console.error("Failed to toggle visibility:", e);
    }
  };

  const hasAny = properties.length > 0;
  const hasFiltered = filtered.length > 0;

  return (
    <div className="p-3 sm:p-4 md:p-6 relative">
      {/* Toolbar: Search + Add */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by address or city…"
              className="w-full rounded-[10px] border border-gray-300 px-3 py-2 pr-8 text-sm outline-none focus:border-gray-400"
              type="text"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
                title="Clear"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-[10px] bg-black px-3 py-2 text-xs text-white transition-colors hover:bg-gray-800 sm:gap-[10px] sm:px-4 sm:py-2 sm:text-sm"
        >
          <PlusIconWhite />
          <span>Add Property</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-black/70">
          Loading properties…
        </div>
      ) : err ? (
        <div className="flex justify-center py-16 text-red-600">{err}</div>
      ) : !hasAny ? (
        <div className="absolute left-1/2 translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-4 text-center sm:gap-[15px]">
          <h4 className="text-xl font-bold sm:text-2xl">
            No Property Listed Yet?
          </h4>
          <p className="text-sm font-bold text-black/70 sm:text-base">
            Click Add New Property to get started.
          </p>
        </div>
      ) : !hasFiltered ? (
        <div className="flex justify-center py-16 text-black/70">
          No matching properties for “{query}”.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-[#FAFAFA] shadow">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-[#EAEAEA]">
                <tr>
                  <th>Image</th>
                  <th>Property ID/Title</th>
                  <th>Location</th>
                  <th>Price/Rent</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((property) => (
                  <tr key={property.id}>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-[6px]">
                        <img
                          src={property.main_image}
                          alt={property.address}
                          className="h-[50px] w-[50px] rounded-[10px] object-cover"
                        />
                        <div className="text-[14px] text-black/60">
                          +{property.images?.length ?? 0}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="text-sm font-medium text-black/90">
                        {property.address}{" "}
                        <span className="text-black/50">#{property.id}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="text-sm text-black/90">
                        {property.address}, {property.city}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="text-sm font-medium text-black/90">
                        {property.isForRent
                          ? `${formatMoney(property.price)}/mo`
                          : formatMoney(property.price)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="text-sm text-black/90">
                        {property.dateAdded}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black/90">
                          {resolveStatus(property)}
                        </span>
                        {!property.show && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Hidden
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-[10px]">
                        <button
                          onClick={() => togglePropertyVisibility(property.id)}
                          className={`flex h-[30px] w-[30px] items-center justify-center rounded-[10px] p-1 ${
                            property.show
                              ? "bg-[#0094421A] hover:bg-[#0094422A]"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          title={
                            property.show ? "Hide property" : "Show property"
                          }
                        >
                          <EyeIcon
                            width={18}
                            height={18}
                            className={
                              property.show ? "text-green-600" : "text-gray-500"
                            }
                          />
                        </button>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="h-[30px] w-[30px] rounded-[10px] bg-[#1B2BDE1A] p-1"
                          title="Edit property"
                        >
                          <EditIcon width={18} height={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property)}
                          className="h-[30px] w-[30px] rounded-[10px] bg-[#F931311A] p-1"
                          title="Delete property"
                        >
                          <DeleteIcon width={18} height={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Conditional Pagination - only show if there are multiple pages and no search is active */}
            {!query && (page > 0 || hasNextPage) && (
              <div className="flex items-center justify-end gap-2 p-3">
                <button
                  disabled={page <= 0}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Prev
                </button>
                <span className="text-sm">Page {page + 1}</span>
                <button
                  disabled={!hasNextPage}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateProperty}
      />

      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        onSave={handleSaveProperty}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={confirmDelete}
        propertyTitle={propertyToDelete?.address || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PropertyManagement;
