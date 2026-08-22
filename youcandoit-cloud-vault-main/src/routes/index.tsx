import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudUpload, FolderLock, ImageIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "youcandoitcloud — Your Own Private Cloud Drive" },
      {
        name: "description",
        content:
          "youcandoitcloud is a private, encrypted-by-access cloud drive for your files, folders and photos. Only you can see what you upload.",
      },
      { property: "og:title", content: "youcandoitcloud — Your Own Private Cloud Drive" },
      {
        property: "og:description",
        content: "youcandoitcloud is a private, encrypted-by-access cloud drive for your files, folders and photos. Only you can see what you upload.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: CloudUpload,
    title: "Upload anything",
    body: "Drag in documents, zips, videos or whole folders. Multi-file uploads run in parallel.",
  },
  {
    icon: FolderLock,
    title: "Real folders",
    body: "Nest folders as deep as you like and move between them with a live breadcrumb trail.",
  },
  {
    icon: ImageIcon,
    title: "Photo previews",
    body: "Pictures get instant thumbnails and a full-size preview, straight from private storage.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Every file lives behind your account. Links are short-lived and signed just for you.",
  },
];

function Landing() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          youcandoit<span className="text-brand-gradient">cloud</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/about">About us</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/mission">Our mission</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Private storage, zero clutter
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
          A cloud drive that belongs to <span className="text-brand-gradient">you alone</span>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Create your vault, then upload files, build folders and keep your photos somewhere calm
          and permanent. Nobody else gets a key.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-brand-gradient text-primary-foreground">
            <Link to="/auth">Create my cloud</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/drive">Open my drive</Link>
          </Button>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass-panel rounded-2xl p-5">
              <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-base font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

