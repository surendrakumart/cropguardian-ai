import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MoreHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

import { primaryNav, secondaryNav } from "./nav-items";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const moreActive = secondaryNav.some((i) => pathname.startsWith(i.to));

  return (
    <>
      {moreOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[2px] md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-5 pb-28 shadow-lift"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">More tools</h2>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="press rounded-full bg-secondary p-2 text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-2">
              {secondaryNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="press flex items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-3.5 text-sm font-medium"
                >
                  <item.icon className="size-4.5 text-primary" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {primaryNav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative flex flex-col items-center gap-1 px-1 pt-3 pb-2.5"
                >
                  {active ? (
                    <motion.span
                      layoutId="tab-indicator"
                      transition={{ type: "spring", stiffness: 480, damping: 36 }}
                      className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
                    />
                  ) : null}
                  <item.icon
                    className={cn(
                      "size-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] transition-colors",
                      active ? "font-medium text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="relative flex w-full flex-col items-center gap-1 px-1 pt-3 pb-2.5"
            >
              {moreActive && !moreOpen ? (
                <motion.span
                  layoutId="tab-indicator"
                  transition={{ type: "spring", stiffness: 480, damping: 36 }}
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
                />
              ) : null}
              <MoreHorizontal
                className={cn(
                  "size-5 transition-colors",
                  moreActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[11px] transition-colors",
                  moreActive ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                More
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
