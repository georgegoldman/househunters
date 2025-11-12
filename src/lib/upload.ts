// src/lib/uploads.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../lib/http";

type SignedPut = { url: string; key: string; publicUrl: string; isPublic: boolean };

function normalizeFilename(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "") // strip weird chars
    .replace(/\s+/g, "-");      // spaces -> dashes
  return cleaned || `file-${Date.now()}`;
}

function guessContentType(file: File) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
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

/** Ask backend for a pre-signed PUT URL (uses axios instance so x-api-key is included) */
export async function getSignedPut(
  file: File,
  opts?: { folder?: string; isPublic?: boolean }
): Promise<SignedPut> {
  const params = {
    filename: normalizeFilename(file.name || "file"),
    type: guessContentType(file),
    folder: opts?.folder ?? "images",
    public: String(opts?.isPublic ?? true),
  };

  const res = await http.get<SignedPut>("/api/sign-upload", { params });
  return res.data;
}

/** PUT raw file to Spaces using the signed URL */
export async function putFile(url: string, file: File) {
  const ct = guessContentType(file);
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": ct }, // must match the type used to sign
    body: file,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}) ${txt}`);
  }
  return res.headers.get("ETag") ?? undefined; // requires ETag exposed in CORS
}

/** Convenience helper: returns the final public URL */
export async function uploadToSpaces(
  file: File,
  opts?: { folder?: string; isPublic?: boolean }
): Promise<string> {
  const { url, publicUrl } = await getSignedPut(file, opts);
  await putFile(url, file);
  return publicUrl;
}
