import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Lock, EyeOff, Server, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — youcandoitcloud" },
      {
        name: "description",
        content:
          "youcandoitcloud's privacy policy: what we collect, how we protect your files, and what we never track or sell.",
      },
      { property: "og:title", content: "Privacy Policy — youcandoitcloud" },
      {
        property: "og:description",
        content:
          "What we collect, how we protect your files, and what we never track or sell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
          Last updated: 23 August 2026
        </p>

        <h1 className="text-4xl font-bold leading-[1.05] md:text-5xl">
          Privacy <span className="text-brand-gradient">Policy</span>
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            This Privacy Policy explains what information youcandoitcloud collects, how we use it,
            how we keep it safe, and what you can do about it. We built this service to be as private
            as possible by default, and we want to be transparent about exactly what happens to your
            data.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl p-5">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Private by default</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your files are stored in isolated storage paths. Row-level security rules ensure only
              your authenticated account can read, modify, or delete them.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Encrypted in transit & at rest</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              All uploads and downloads use TLS (HTTPS). Files are stored on encrypted infrastructure.
              This is not client-side end-to-end encryption: the storage provider handles the encryption
              keys for the underlying disks.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <EyeOff className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No tracking or cookies</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We do not use marketing cookies, analytics scripts, or advertising trackers. We do not
              sell, rent, or share your data for advertising.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <Server className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Minimal logging</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We only log what is technically necessary to run the service and fix errors. We do not log
              your file contents or browse your folders.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <PolicySection
            icon={FileText}
            title="1. What we collect"
            body={
              <>
                <p>We collect only the information needed to provide the service:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-foreground">Account information:</strong> your email
                    address, a hashed password, and your authentication provider profile (if you sign in
                    with Google). We do not ask for your real name, phone number, or payment details.
                  </li>
                  <li>
                    <strong className="text-foreground">Files and metadata:</strong> anything you
                    upload, including file names, folder names, sizes, MIME types, and storage paths.
                    We need this to display, organise, and retrieve your content.
                  </li>
                  <li>
                    <strong className="text-foreground">Share links:</strong> when you create a share
                    link, we store the item reference, a random token, a hashed password, and an expiry
                    time. We cannot read the original password.
                  </li>
                  <li>
                    <strong className="text-foreground">Technical identifiers:</strong> your user ID,
                    session tokens, and timestamps from authentication and storage requests.
                  </li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="2. What we do NOT collect"
            body={
              <>
                <p>We do not collect or use any of the following:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Payment or billing information.</li>
                  <li>Phone numbers, physical addresses, or government IDs.</li>
                  <li>Marketing or behavioural analytics, including third-party trackers.</li>
                  <li>Cookies for advertising or profiling.</li>
                  <li>Your contacts, location, or device identifiers beyond what your browser sends in standard HTTP requests.</li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="3. How we use your data"
            body={
              <p>
                We use your data only to operate the service: to keep you signed in, to store and
                retrieve your files, to show your folder structure, to create share links when you ask
                for them, and to diagnose errors or abuse. We do not use your content for machine
                learning, advertising, or any purpose other than providing the cloud drive to you.
              </p>
            }
          />

          <PolicySection
            title="4. Encryption and security model"
            body={
              <>
                <p>
                  Files are transferred over TLS/HTTPS and stored on encrypted storage infrastructure.
                  Access is enforced by database row-level security policies tied to your account ID.
                </p>
                <p className="mt-3">
                  <strong className="text-foreground">Important clarification:</strong> this is not
                  client-side or "zero-knowledge" end-to-end encryption. The service operator and the
                  storage provider have the technical ability to access encrypted storage and metadata
                  because they manage the keys and infrastructure. We do not browse your files, but we
                  cannot claim that we are mathematically unable to access them.
                </p>
              </>
            }
          />

          <PolicySection
            title="5. What we log"
            body={
              <>
                <p>We keep logs only for operational and security purposes:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Authentication events (sign in, sign out, sign up) tied to your account.</li>
                  <li>File operations such as upload, delete, rename, and share-link creation.</li>
                  <li>Error logs and server-side exceptions to help us fix bugs.</li>
                  <li>Storage access requests and their outcomes (success or failure).</li>
                </ul>
                <p className="mt-3">
                  We do not log the contents of your files, the names of files in a way that is shared
                  with third parties, or your browsing history outside of the service.
                </p>
              </>
            }
          />

          <PolicySection
            title="6. Storage and retention"
            body={
              <p>
                Your files are stored until you delete them or close your account. We reserve the right
                to remove inactive accounts and their data after a long period of inactivity, but we will
                attempt to notify you first. Share links expire automatically based on the expiry you set
                when creating them.
              </p>
            }
          />

          <PolicySection
            title="7. Sharing and third parties"
            body={
              <p>
                We do not sell or share your personal data with advertisers, data brokers, or marketers.
                We use infrastructure providers (including our hosting and database services) to run the
                service. These providers only process data on our behalf and are bound by their own
                security and privacy obligations.
              </p>
            }
          />

          <PolicySection
            title="8. Cookies and tracking"
            body={
              <p>
                We do not use marketing or analytics cookies. The only cookies or local storage entries
                used are those strictly necessary for authentication (session tokens and refresh
                tokens). You may see a standard browser cookie because of the authentication mechanism,
                but there are no tracking or advertising cookies.
              </p>
            }
          />

          <PolicySection
            title="9. Your rights"
            body={
              <>
                <p>You can:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Access, download, or delete any file you upload.</li>
                  <li>Revoke share links at any time.</li>
                  <li>Close your account by contacting us. Account closure will delete your files and account record.</li>
                  <li>Request a copy of the personal data we hold about you.</li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="10. Children's privacy"
            body={
              <p>
                youcandoitcloud is not directed at children under 13. If you are under 13, please do not
                create an account or upload content. If we learn that we have collected personal data
                from a child under 13, we will delete it.
              </p>
            }
          />

          <PolicySection
            title="11. Changes to this policy"
            body={
              <p>
                We may update this Privacy Policy from time to time. The "Last updated" date at the top
                of the page shows the current version. If we make material changes, we will notify you
                by posting an update on the site or, if you have provided an email, by contacting you.
              </p>
            }
          />

          <PolicySection
            title="12. Contact us"
            body={
              <p>
                If you have questions about this Privacy Policy or your data, contact us at{" "}
                <a href="mailto:crackedspotify26@gmail.com" className="text-foreground underline underline-offset-2">
                  crackedspotify26@gmail.com
                </a>{" "}
                or on Discord at{" "}
                <a href="https://discord.com/users/somewhereniki" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-2">
                  somewhereniki
                </a>.
              </p>
            }
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PolicySection({
  icon: Icon,
  title,
  body,
}: {
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-8">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden={true} />}

        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</div>
        </div>
      </div>
    </div>
  );
}
