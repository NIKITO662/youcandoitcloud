import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Ban, Cookie, CreditCard, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";


export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Our mission — youcandoitcloud" },
      {
        name: "description",
        content:
          "youcandoitcloud's mission: end the sale of personal data, end forced cookie acceptance, and end subscriptions for things advertised as free.",
      },
      { property: "og:title", content: "Our mission — youcandoitcloud" },
      {
        property: "og:description",
        content:
          "A manifesto for a web that doesn't sell your data, doesn't force cookies, and doesn't bait you into paying for 'free' services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionPage,
});

function MissionPage() {
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
          A manifesto for the web we actually want
        </p>

        <h1 className="text-4xl font-bold leading-[1.05] md:text-5xl">
          Our <span className="text-brand-gradient">mission</span>
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            My mission is simple: an end to the sale of data on the internet, an end to cookie acceptance, and an end to
            payments and subscriptions for things advertised as free.
          </p>
          <p>
            I've had enough of all this nonsense. Big platforms promise "free" storage, then turn around and sell your
            attention, your habits, and your personal information. They bury you in cookie pop-ups, then collect data
            anyway. They lock features behind subscriptions for services they called free five minutes ago.
          </p>
          <p>
            youcandoitcloud is my answer. It is a quiet place on the internet where your files belong to you, where you
            are not the product, and where "free" actually means free. No bait-and-switch. No hidden subscriptions. No
            selling your data to keep the lights on.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-5 text-center">
            <Database className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No data for sale</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your uploads, metadata and activity are never sold, rented, or packaged for advertisers.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5 text-center">
            <Cookie className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No cookie walls</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If a feature doesn't need a cookie, we don't set one. No tracking consent banners required.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5 text-center">
            <CreditCard className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Free means free</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              15 GB of storage at no cost. No surprise charges, no paywalled basics, no "upgrade to continue" traps.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
          <div className="flex items-start gap-4">
            <Ban className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold">What we refuse to do</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Show ads based on your files or behavior.</li>
                <li>Use dark patterns to make you accept tracking.</li>
                <li>Gate basic features behind a subscription.</li>
                <li>Share information with data brokers or marketers.</li>
                <li>Change the privacy policy quietly to permit more tracking.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button asChild size="lg" className="bg-brand-gradient text-primary-foreground">
            <Link to="/auth">Join the movement</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

