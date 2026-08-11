import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

import { primaryNav, secondaryNav } from "./nav-items";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-background/85 backdrop-blur-md md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link to="/" className="press flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">AgriShield</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {[...primaryNav, ...secondaryNav].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary data-[status=active]:font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/diagnose"
          className="press ml-auto rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/92"
        >
          Diagnose Now
        </Link>
      </div>
    </header>
  );
}
