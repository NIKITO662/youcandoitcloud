import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Copy,
  Download,
  File as FileIcon,
  FileArchive,
  FileText,
  FilmIcon,
  Folder,
  FolderPlus,
  ImageIcon,
  Link2,
  Loader2,
  LogOut,
  Music,
  Pencil,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  BUCKET,
  QUOTA_BYTES,
  formatBytes,
  isImage,
  sanitizeSegment,
  type FileRow,
} from "@/lib/cloud";
import { createShare } from "@/lib/share.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";




export const Route = createFileRoute("/drive")({
  head: () => ({
    meta: [
      { title: "My Drive — youcandoitcloud" },
      {
        name: "description",
        content:
          "Browse, upload and organise your private files, folders and photos inside your youcandoitcloud drive.",
      },
      { property: "og:title", content: "My Drive — youcandoitcloud" },
      {
        property: "og:description",
        content: "Your private cloud drive for files, folders and photos.",
      },
    ],
  }),
  component: Drive,
});

type Crumb = { id: string | null; name: string };

function iconFor(row: FileRow) {
  if (row.is_folder) return Folder;
  const m = row.mime_type ?? "";
  if (m.startsWith("image/")) return ImageIcon;
  if (m.startsWith("video/")) return FilmIcon;
  if (m.startsWith("audio/")) return Music;
  if (m.includes("zip") || m.includes("rar") || m.includes("tar")) return FileArchive;
  if (m.startsWith("text/") || m.includes("pdf") || m.includes("document")) return FileText;
  return FileIcon;
}

function Drive() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [rows, setRows] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: "My Drive" }]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [newFolder, setNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renaming, setRenaming] = useState<FileRow | null>(null);
  const [zipping, setZipping] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState<number | null>(null);
  const [sharing, setSharing] = useState<FileRow | null>(null);
  const [sharePassword, setSharePassword] = useState("");
  const [shareHours, setShareHours] = useState("24");
  const [shareBusy, setShareBusy] = useState(false);
  const [shareLink, setShareLink] = useState<{ url: string; expiresAt: string } | null>(null);

  const makeShare = useServerFn(createShare);

  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const currentId = crumbs[crumbs.length - 1]!.id;
  const searching = query.trim().length > 0;

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadUsage = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("files").select("size").eq("is_folder", false);
    if (error) return;
    setUsage((data ?? []).reduce((sum, r) => sum + Number(r.size ?? 0), 0));
  }, [user]);

  useEffect(() => {
    void loadUsage();
  }, [loadUsage]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const term = query.trim();
    let request = supabase
      .from("files")
      .select("*")
      .order("is_folder", { ascending: false })
      .order("name");
    if (term) {
      request = request.ilike("name", `%${term.replace(/[%_]/g, "\\$&")}%`).limit(100);
    } else {
      request =
        currentId === null ? request.is("parent_id", null) : request.eq("parent_id", currentId);
    }
    const { data, error } = await request;
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const list = (data ?? []) as FileRow[];
    setRows(list);

    const images = list.filter((r) => !r.is_folder && isImage(r.mime_type) && r.storage_path);
    if (images.length) {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(images.map((r) => r.storage_path!), 3600);
      if (signed) {
        const next: Record<string, string> = {};
        signed.forEach((s, i) => {
          if (s.signedUrl) next[images[i]!.id] = s.signedUrl;
        });
        setThumbs((prev) => ({ ...prev, ...next }));
      }
    }
  }, [user, currentId, query]);


  useEffect(() => {
    void load();
    void loadUsage();
  }, [load]);

  async function ensureFolderPath(segments: string[], startParent: string | null) {
    let parent = startParent;
    for (const seg of segments) {
      const { data: existing } = await supabase
        .from("files")
        .select("id")
        .eq("name", seg)
        .eq("is_folder", true)
        .filter("parent_id", parent === null ? "is" : "eq", parent === null ? null : parent)
        .maybeSingle();
      if (existing) {
        parent = existing.id;
        continue;
      }
      const { data: created, error } = await supabase
        .from("files")
        .insert({ user_id: user!.id, parent_id: parent, name: seg, is_folder: true })
        .select("id")
        .single();
      if (error || !created) throw new Error(error?.message ?? "Could not create folder");
      parent = created.id;
    }
    return parent;
  }

  async function uploadFiles(files: File[]) {
    if (!user || !files.length) return;
    setUploading(files.length);
    let done = 0;
    for (const file of files) {
      try {
        const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath || "";
        const segments = relative ? relative.split("/").slice(0, -1) : [];
        const parent = segments.length
          ? await ensureFolderPath(segments, currentId)
          : currentId;

        const path = `${user.id}/${crypto.randomUUID()}-${sanitizeSegment(file.name)}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type || "application/octet-stream" });
        if (upErr) throw new Error(upErr.message);

        const { error: dbErr } = await supabase.from("files").insert({
          user_id: user.id,
          parent_id: parent,
          name: file.name,
          is_folder: false,
          storage_path: path,
          size: file.size,
          mime_type: file.type || null,
        });
        if (dbErr) throw new Error(dbErr.message);
        done += 1;
      } catch (err) {
        toast.error(`${file.name}: ${(err as Error).message}`);
      }
      setUploading(files.length - done);
    }
    setUploading(0);
    if (done) toast.success(`Uploaded ${done} item${done > 1 ? "s" : ""}`);
    void load();
  }

  async function createFolder() {
    const name = folderName.trim();
    if (!name || !user) return;
    const { error } = await supabase
      .from("files")
      .insert({ user_id: user.id, parent_id: currentId, name, is_folder: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    setFolderName("");
    setNewFolder(false);
    void load();
  }

  async function collectPaths(id: string): Promise<string[]> {
    const { data } = await supabase.from("files").select("*").eq("parent_id", id);
    const children = (data ?? []) as FileRow[];
    const paths: string[] = [];
    for (const child of children) {
      if (child.is_folder) paths.push(...(await collectPaths(child.id)));
      else if (child.storage_path) paths.push(child.storage_path);
    }
    return paths;
  }

  async function remove(row: FileRow) {
    const paths = row.is_folder
      ? await collectPaths(row.id)
      : row.storage_path
        ? [row.storage_path]
        : [];
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
    const { error } = await supabase.from("files").delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Deleted "${row.name}"`);
    void load();
    void loadUsage();
  }

  async function saveRename() {
    if (!renaming) return;
    const name = renameValue.trim();
    if (!name) return;
    const { error } = await supabase.from("files").update({ name }).eq("id", renaming.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRenaming(null);
    void load();
  }

  async function openFile(row: FileRow) {
    if (row.is_folder) {
      setCrumbs((c) => [...c, { id: row.id, name: row.name }]);
      return;
    }
    if (!row.storage_path) return;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, 3600);
    if (error || !data) {
      toast.error("Could not open this file");
      return;
    }
    if (isImage(row.mime_type)) setPreview({ name: row.name, url: data.signedUrl });
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function download(row: FileRow) {
    if (row.is_folder) {
      await downloadFolder(row);
      return;
    }
    if (!row.storage_path) return;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, 600, { download: row.name });
    if (error || !data) {
      toast.error("Could not prepare the download");
      return;
    }
    window.location.href = data.signedUrl;
  }

  async function collectTree(
    id: string,
    prefix: string,
  ): Promise<{ path: string; storagePath: string }[]> {
    const { data } = await supabase.from("files").select("*").eq("parent_id", id);
    const children = (data ?? []) as FileRow[];
    const out: { path: string; storagePath: string }[] = [];
    for (const child of children) {
      const next = prefix ? `${prefix}/${child.name}` : child.name;
      if (child.is_folder) out.push(...(await collectTree(child.id, next)));
      else if (child.storage_path) out.push({ path: next, storagePath: child.storage_path });
    }
    return out;
  }

  async function downloadFolder(row: FileRow) {
    setZipping(row.id);
    try {
      const entries = await collectTree(row.id, "");
      if (!entries.length) {
        toast.error("This folder is empty");
        return;
      }
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const entry of entries) {
        const { data, error } = await supabase.storage.from(BUCKET).download(entry.storagePath);
        if (error || !data) continue;
        zip.file(entry.path, await data.arrayBuffer());
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${row.name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded "${row.name}.zip"`);
    } catch {
      toast.error("Could not prepare the folder download");
    } finally {
      setZipping(null);
    }
  }

  async function submitShare() {
    if (!sharing) return;
    setShareBusy(true);
    try {
      const res = await makeShare({
        data: {
          fileId: sharing.id,
          password: sharePassword,
          hours: Number(shareHours),
        },
      });
      setShareLink({
        url: `${window.location.origin}/s/${res.token}`,
        expiresAt: res.expiresAt,
      });
      toast.success("Share link created");
    } catch (err) {
      toast.error((err as Error).message || "Could not create the link");
    } finally {
      setShareBusy(false);
    }
  }

  const usedPercent =
    usage === null ? 0 : Math.min(100, Math.round((usage / QUOTA_BYTES) * 1000) / 10);

  const totals = useMemo(() => {

    const files = rows.filter((r) => !r.is_folder);
    return {
      folders: rows.length - files.length,
      files: files.length,
      size: files.reduce((sum, r) => sum + Number(r.size ?? 0), 0),
    };
  }, [rows]);

  if (authLoading || !user) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="mt-6 h-64 w-full rounded-3xl" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="font-display text-lg font-bold">
          youcandoit<span className="text-brand-gradient">cloud</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <section className="glass-panel mt-8 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold">Storage</h2>
            <p className="text-xs text-muted-foreground">
              {usage === null
                ? "Calculating…"
                : `${formatBytes(usage)} of ${formatBytes(QUOTA_BYTES)} used`}
            </p>
          </div>
          <Progress value={usedPercent} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {usage === null
              ? "\u00a0"
              : `${formatBytes(Math.max(0, QUOTA_BYTES - usage))} remaining · ${usedPercent}% full`}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files and folders"
            aria-label="Search files and folders"
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-wrap items-end justify-between gap-4">

        <div>
          <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {crumbs.length > 1 && (
              <button
                onClick={() => setCrumbs((c) => c.slice(0, -1))}
                className="mr-1 rounded-md p-1 hover:text-foreground"
                aria-label="Go up one folder"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {crumbs.map((c, i) => (
              <span key={`${c.id ?? "root"}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span className="opacity-40">/</span>}
                <button
                  onClick={() => setCrumbs((prev) => prev.slice(0, i + 1))}
                  className={
                    i === crumbs.length - 1
                      ? "font-medium text-foreground"
                      : "hover:text-foreground"
                  }
                >
                  {c.name}
                </button>
              </span>
            ))}
          </nav>
          <p className="mt-2 text-xs text-muted-foreground">
            {searching
              ? `Search results for “${query.trim()}” — ${rows.length} match${rows.length === 1 ? "" : "es"}`
              : `${totals.folders} folders · ${totals.files} files · ${formatBytes(totals.size)}`}
          </p>

        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setNewFolder(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> New folder
          </Button>
          <Button variant="outline" size="sm" onClick={() => folderInput.current?.click()}>
            <Folder className="mr-2 h-4 w-4" /> Upload folder
          </Button>
          <Button
            size="sm"
            className="bg-brand-gradient text-primary-foreground"
            onClick={() => fileInput.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload files
          </Button>
        </div>
      </section>

      <input
        ref={fileInput}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          void uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <input
        ref={folderInput}
        type="file"
        multiple
        className="hidden"
        // @ts-expect-error non-standard but widely supported directory picker
        webkitdirectory="true"
        directory="true"
        onChange={(e) => {
          void uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void uploadFiles(Array.from(e.dataTransfer.files));
        }}
        className={`glass-panel mt-6 rounded-3xl p-4 transition-colors ${
          dragOver ? "border-primary bg-primary/5" : ""
        }`}
      >
        {uploading > 0 && (
          <p className="mb-4 rounded-xl bg-secondary/70 px-4 py-3 text-sm">
            Uploading… {uploading} item{uploading > 1 ? "s" : ""} left
          </p>
        )}

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            {searching ? (
              <Search className="h-8 w-8 text-primary" aria-hidden="true" />
            ) : (
              <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
            )}
            <h2 className="mt-4 text-lg font-semibold">
              {searching ? "No matches found" : "This folder is empty"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {searching
                ? "Try a different name or clear the search to browse your drive."
                : "Drop files here, or use the buttons above to upload files, whole folders and photos."}
            </p>
          </div>

        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
              const Icon = iconFor(row);
              const thumb = thumbs[row.id];
              return (
                <li
                  key={row.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/40 transition-colors hover:border-primary/50"
                >
                  <button
                    onClick={() => void openFile(row)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={row.name}
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background/60">
                        <Icon
                          className={`h-5 w-5 ${row.is_folder ? "text-primary" : "text-muted-foreground"}`}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{row.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {row.is_folder ? "Folder" : formatBytes(Number(row.size ?? 0))}
                      </span>
                    </span>
                  </button>

                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={zipping === row.id}
                      aria-label={
                        row.is_folder
                          ? `Download folder ${row.name} as zip`
                          : `Download ${row.name}`
                      }
                      onClick={() => void download(row)}
                    >
                      {zipping === row.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      aria-label={`Share ${row.name}`}
                      onClick={() => {
                        setSharing(row);
                        setSharePassword("");
                        setShareHours("24");
                        setShareLink(null);
                      }}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      aria-label={`Rename ${row.name}`}
                      onClick={() => {
                        setRenaming(row);
                        setRenameValue(row.name);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      aria-label={`Delete ${row.name}`}
                      onClick={() => void remove(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={newFolder} onOpenChange={setNewFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={folderName}
            placeholder="Folder name"
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void createFolder()}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewFolder(false)}>
              Cancel
            </Button>
            <Button className="bg-brand-gradient text-primary-foreground" onClick={() => void createFolder()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renaming} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void saveRename()}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button className="bg-brand-gradient text-primary-foreground" onClick={() => void saveRename()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!sharing}
        onOpenChange={(open) => {
          if (!open) {
            setSharing(null);
            setShareLink(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="truncate">Share “{sharing?.name}”</DialogTitle>
          </DialogHeader>

          {shareLink ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Anyone with this link and the password can open it until{" "}
                {new Date(shareLink.expiresAt).toLocaleString()}.
              </p>
              <div className="flex gap-2">
                <Input readOnly value={shareLink.url} onFocus={(e) => e.target.select()} />
                <Button
                  variant="outline"
                  aria-label="Copy share link"
                  onClick={async () => {
                    await navigator.clipboard.writeText(shareLink.url);
                    toast.success("Link copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Set a password and how long the link should stay alive.
              </p>
              <Input
                autoFocus
                type="password"
                placeholder="Link password (min 4 characters)"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
              />
              <Input
                type="number"
                min={1}
                max={720}
                placeholder="Expires in hours"
                value={shareHours}
                onChange={(e) => setShareHours(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setSharing(null);
                setShareLink(null);
              }}
            >
              {shareLink ? "Done" : "Cancel"}
            </Button>
            {!shareLink && (
              <Button
                disabled={shareBusy}
                className="bg-brand-gradient text-primary-foreground"
                onClick={() => void submitShare()}
              >
                {shareBusy ? "Creating…" : "Create link"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>

        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <img
              src={preview.url}
              alt={preview.name}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}

