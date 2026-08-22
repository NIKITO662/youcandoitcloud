import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Folder, Lock, ShieldAlert } from "lucide-react";
import { openShare } from "@/lib/share.functions";
import { formatBytes } from "@/lib/cloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/s/$token")({
  head: () => ({
    meta: [
      { title: "Protected share — youcandoitcloud" },
      {
        name: "description",
        content:
          "Enter the password to open a time-limited shared file or folder from a youcandoitcloud drive.",
      },
      { property: "og:title", content: "Protected share — youcandoitcloud" },
      {
        property: "og:description",
        content: "A password-protected, time-limited share link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharePage,
});

type Result = Awaited<ReturnType<typeof openShare>>;

function SharePage() {
  const { token } = Route.useParams();
  const open = useServerFn(openShare);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<Result, { ok: true }> | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await open({ data: { token, password } });
      if (res.ok) setResult(res);
      else
        setError(
          res.reason === "expired"
            ? "This link has expired."
            : res.reason === "not_found"
              ? "This link is no longer available."
              : "Incorrect password.",
        );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-bold">
        youcandoit<span className="text-brand-gradient">cloud</span>
      </h1>

      {!result ? (
        <form onSubmit={submit} className="glass-panel mt-8 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/70">
              <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Password required</h2>
              <p className="text-sm text-muted-foreground">
                This share link is protected and expires automatically.
              </p>
            </div>
          </div>

          <Input
            className="mt-6"
            type="password"
            autoFocus
            placeholder="Share password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" /> {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={busy}
            className="mt-4 w-full bg-brand-gradient text-primary-foreground"
          >
            {busy ? "Unlocking…" : "Unlock"}
          </Button>
        </form>
      ) : (
        <section className="glass-panel mt-8 rounded-3xl p-6">
          <h2 className="truncate text-lg font-semibold">{result.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Access expires {new Date(result.expiresAt).toLocaleString()}
          </p>
          <ul className="mt-6 space-y-2">
            {result.items.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.isFolder ? "Folder" : formatBytes(item.size)}
                  </span>
                </span>
                {item.isFolder ? (
                  <Folder className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  item.url && (
                    <Button asChild size="sm" variant="outline">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Open
                      </a>
                    </Button>
                  )
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
