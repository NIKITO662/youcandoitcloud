import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Shield, Lock, EyeOff, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — youcandoitcloud" },
      {
        name: "description",
        content:
          "Meet the creator behind youcandoitcloud, a private cloud drive built to stop tracking, cookies and data selling.",
      },
      { property: "og:title", content: "About us — youcandoitcloud" },
      {
        property: "og:description",
        content:
          "A small-scale project built out of frustration with tracking, cookies and data selling. Your files, your rules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
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

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-8 md:pt-16">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 gap-1 text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </Button>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Built by one person, for everyone
        </p>

        <h1 className="text-4xl font-bold leading-[1.05] md:text-5xl">
          About <span className="text-brand-gradient">youcandoitcloud</span>
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            I'm a small-scale site creator who—just like you—is fed up with being tracked, having my data sold,
            constantly accepting cookies, and paying for things that are supposedly free. Enough is enough.
          </p>
          <p>
            YouCanDoItCloud offers you a safe, free space where you don't have to pay or accept cookies; all I ask is
            that you sign up and share it with friends. You get 15 GB of space just for yourself—upload whatever you
            want; this is your cloud.
          </p>
          <p>
            I don't collect any data, and everything is protected behind your account. There are no third-party trackers,
            no advertising scripts, and no analytics selling your behavior. I built this because I believe privacy online
            should be the default, not a premium feature you have to pay for.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl p-5">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Private by default</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your files live in isolated storage paths that only your authenticated session can reach. Nobody else can
              browse, open, or download them.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Encrypted in transit & at rest</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Connections use TLS in transit and storage is encrypted at rest. Your account gates every request through
              row-level security rules.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <EyeOff className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No tracking, no cookies</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              There are no cookie banners because there are no marketing cookies. We don't track what you upload, what you
              preview, or where you click.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <Fingerprint className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Anonymous & simple</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Sign up with an email or Google. No real-name requirements, no phone number, no credit card. Your identity
              inside the app is just your account ID.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Create an account</strong> with email/password or Google. We only store
              what we need to keep you signed in.
            </li>
            <li>
              <strong className="text-foreground">Open your drive</strong> and start uploading files, folders or photos.
              Each item is recorded under your unique user ID.
            </li>
            <li>
              <strong className="text-foreground">Organize freely</strong> with nested folders, rename, move, preview
              and download. Everything is scoped to your account.
            </li>
            <li>
              <strong className="text-foreground">Share only when you want</strong> by creating optional password-protected
              links that expire automatically. No public folders by default.
            </li>
          </ol>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold">Get in touch</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2">
              <a href="mailto:crackedspotify26@gmail.com">
                <Mail className="h-4 w-4" />
                crackedspotify26@gmail.com
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href="https://discord.com/users/somewhereniki" target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Discord: somewhereniki
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

