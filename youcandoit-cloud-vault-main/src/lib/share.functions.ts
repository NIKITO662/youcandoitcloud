import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { BUCKET } from "@/lib/cloud";

function hash(password: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${password}`, "utf8").digest("hex");
}

function matches(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

export const createShare = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string; password: string; hours: number }) => {
    if (!data.fileId) throw new Error("Missing item");
    if (!data.password || data.password.length < 4)
      throw new Error("Password must be at least 4 characters");
    if (!Number.isFinite(data.hours) || data.hours <= 0 || data.hours > 720)
      throw new Error("Choose an expiry between 1 and 720 hours");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("files")
      .select("id, name")
      .eq("id", data.fileId)
      .maybeSingle();
    if (error || !row) throw new Error("Item not found");

    const salt = randomBytes(16).toString("hex");
    const token = randomBytes(16).toString("base64url");
    const expiresAt = new Date(Date.now() + data.hours * 3600_000).toISOString();

    const { error: insErr } = await supabase.from("shares").insert({
      user_id: userId,
      file_id: row.id,
      token,
      password_salt: salt,
      password_hash: hash(data.password, salt),
      expires_at: expiresAt,
    });
    if (insErr) throw new Error(insErr.message);

    return { token, expiresAt, name: row.name };
  });

export const listShares = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("shares")
      .select("id, token, file_id, expires_at, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const revokeShare = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("shares").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

type SharedItem = {
  name: string;
  size: number;
  mimeType: string | null;
  url: string | null;
  isFolder: boolean;
};

export const openShare = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; password: string }) => {
    if (!data.token) throw new Error("Missing link");
    return data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: share } = await supabaseAdmin
      .from("shares")
      .select("id, file_id, password_salt, password_hash, expires_at")
      .eq("token", data.token)
      .maybeSingle();

    if (!share) return { ok: false as const, reason: "not_found" as const };
    if (new Date(share.expires_at).getTime() < Date.now())
      return { ok: false as const, reason: "expired" as const };
    if (!matches(hash(data.password ?? "", share.password_salt), share.password_hash))
      return { ok: false as const, reason: "password" as const };

    const { data: root } = await supabaseAdmin
      .from("files")
      .select("id, name, is_folder, size, mime_type, storage_path")
      .eq("id", share.file_id)
      .maybeSingle();
    if (!root) return { ok: false as const, reason: "not_found" as const };

    const items: SharedItem[] = [];
    const ttl = 3600;

    async function sign(path: string | null): Promise<string | null> {
      if (!path) return null;
      const { data: signed } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(path, ttl);
      return signed?.signedUrl ?? null;
    }

    if (root.is_folder) {
      const walk = async (parentId: string, prefix: string) => {
        const { data: children } = await supabaseAdmin
          .from("files")
          .select("id, name, is_folder, size, mime_type, storage_path")
          .eq("parent_id", parentId)
          .order("is_folder", { ascending: false })
          .order("name");
        for (const child of children ?? []) {
          if (child.is_folder) {
            items.push({
              name: `${prefix}${child.name}/`,
              size: 0,
              mimeType: null,
              url: null,
              isFolder: true,
            });
            await walk(child.id, `${prefix}${child.name}/`);
          } else {
            items.push({
              name: `${prefix}${child.name}`,
              size: Number(child.size ?? 0),
              mimeType: child.mime_type,
              url: await sign(child.storage_path),
              isFolder: false,
            });
          }
        }
      };
      await walk(root.id, "");
    } else {
      items.push({
        name: root.name,
        size: Number(root.size ?? 0),
        mimeType: root.mime_type,
        url: await sign(root.storage_path),
        isFolder: false,
      });
    }

    return {
      ok: true as const,
      name: root.name,
      isFolder: root.is_folder,
      expiresAt: share.expires_at,
      items,
    };
  });
