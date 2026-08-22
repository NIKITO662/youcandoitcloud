import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — youcandoitcloud" },
      {
        name: "description",
        content:
          "youcandoitcloud's terms of service: acceptable use, storage limits, disclaimers, and contact information.",
      },
      { property: "og:title", content: "Terms of Service — youcandoitcloud" },
      {
        property: "og:description",
        content: "Acceptable use, storage limits, disclaimers, and contact information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
          Terms of <span className="text-brand-gradient">Service</span>
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            These Terms of Service ("Terms") govern your access to and use of youcandoitcloud ("the
            service", "we", "us", or "our"). By creating an account or using the service, you agree to
            these Terms. If you do not agree, please do not use the service.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-5 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Free 15 GB</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Each account includes 15 GB of storage at no cost. No payment is required for basic use.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5 text-center">
            <XCircle className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No illegal content</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You may not upload malware, copyrighted material you don't own, or anything unlawful.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">Use at your own risk</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The service is provided as-is. We are not liable for data loss or service interruptions.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <TermsSection
            icon={Scale}
            title="1. Acceptance of terms"
            body={
              <p>
                By signing up, signing in, or using youcandoitcloud, you agree to be bound by these
                Terms and our Privacy Policy. If you are using the service on behalf of an organisation,
                you represent that you have authority to bind that organisation.
              </p>
            }
          />

          <TermsSection
            title="2. Description of service"
            body={
              <p>
                youcandoitcloud is a personal cloud storage service. It allows you to upload, store,
                organise, download, preview, and share files, folders, and photos through a web
                interface. Features may change over time as the service improves.
              </p>
            }
          />

          <TermsSection
            title="3. Accounts and eligibility"
            body={
              <>
                <p>To use the service, you must:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Be at least 13 years old.</li>
                  <li>Provide a valid email address and keep your password secure.</li>
                  <li>Not impersonate anyone or create accounts for abusive purposes.</li>
                </ul>
                <p className="mt-3">
                  You are responsible for everything that happens under your account. If you believe your
                  account has been compromised, contact us immediately.
                </p>
              </>
            }
          />

          <TermsSection
            title="4. Your content"
            body={
              <p>
                You retain ownership of anything you upload. You grant us only the limited rights needed
                to store, display, and transmit your files so the service can function. We do not claim
                ownership of your content, and we will not use it for anything outside of providing the
                service.
              </p>
            }
          />

          <TermsSection
            title="5. Prohibited use"
            body={
              <>
                <p>You may not use the service to upload, store, or share:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Illegal content or content that violates the rights of others.</li>
                  <li>Malware, viruses, exploits, or anything designed to harm systems or people.</li>
                  <li>Copyrighted material you do not have permission to distribute.</li>
                  <li>Content that is abusive, threatening, hateful, or discriminatory.</li>
                  <li>Personal data of third parties without lawful grounds.</li>
                </ul>
                <p className="mt-3">
                  You may not attempt to bypass security controls, access other users' accounts, abuse
                  storage limits, or use the service to send spam or phishing.
                </p>
              </>
            }
          />

          <TermsSection
            title="6. Storage limits and fair use"
            body={
              <p>
                Each account is currently entitled to 15 GB of storage. We may adjust this limit or add
                optional paid plans in the future. Excessive or automated use that degrades the service for
                others may be restricted. The service is intended for personal, non-commercial use.
              </p>
            }
          />

          <TermsSection
            title="7. Termination and suspension"
            body={
              <p>
                We may suspend or terminate your account if you violate these Terms, abuse the service,
                or if required by law. You may stop using the service at any time. Upon termination, your
                files and account data may be deleted. We are not obligated to return content after
                termination.
              </p>
            }
          />

          <TermsSection
            title="8. Disclaimers"
            body={
              <p>
                The service is provided "as is" and "as available" without warranties of any kind. We do
                not guarantee that the service will be uninterrupted, error-free, or completely secure.
                You are responsible for maintaining backups of any important content you upload.
              </p>
            }
          />

          <TermsSection
            title="9. Limitation of liability"
            body={
              <p>
                To the extent permitted by law, we are not liable for any indirect, incidental, special,
                or consequential damages arising from your use of the service, including data loss,
                even if we have been advised of the possibility. Our total liability is limited to the
                amount you have paid for the service (which is zero for free accounts).
              </p>
            }
          />

          <TermsSection
            title="10. Changes to these terms"
            body={
              <p>
                We may update these Terms from time to time. The updated version will be posted on this
                page with a new "Last updated" date. Continued use of the service after changes means you
                accept the revised Terms.
              </p>
            }
          />

          <TermsSection
            title="11. Governing law"
            body={
              <p>
                These Terms are governed by the laws of the jurisdiction where the service operator is
                based, without regard to conflict-of-law principles. Any disputes will be resolved in the
                courts of that jurisdiction.
              </p>
            }
          />

          <TermsSection
            title="12. Contact us"
            body={
              <p>
                If you have questions about these Terms, contact us at{" "}
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

function TermsSection({
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
