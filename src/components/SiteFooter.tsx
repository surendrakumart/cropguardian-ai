import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

import { primaryNav, secondaryNav } from "./nav-items";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="size-4" />
              </span>
              <span className="font-display text-lg font-semibold">AgriShield</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Crop Doctor puts field-grade disease diagnosis and climate risk in the hands of every
              smallholder farmer — offline-friendly, in plain language.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            {[...primaryNav, ...secondaryNav].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} AgriShield. Guidance is advisory — always confirm chemical
          rates with your local extension officer.
        </p>
      </div>
    </footer>
  );
}
