import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>youcandoitcloud — your files, your rules.</span>
        <div className="flex flex-wrap gap-4">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/mission" className="hover:text-foreground">
            Mission
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
