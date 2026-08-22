export const BUCKET = "cloud-files";

/** Total storage available per drive. */
export const QUOTA_BYTES = 15 * 1024 * 1024 * 1024;

export type FileRow = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  is_folder: boolean;
  storage_path: string | null;
  size: number;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
};

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function isImage(mime: string | null): boolean {
  return !!mime && mime.startsWith("image/");
}

export function sanitizeSegment(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}
