import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useState } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { cropFilters, diseaseLibrary } from "@/data/mock/library";
import type { Disease } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Disease library — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "A plain-language reference for the most common crop diseases: symptoms, spread conditions and prevention.",
      },
      { property: "og:title", content: "Disease library — AgriShield" },
      {
        property: "og:description",
        content: "Symptoms, spread conditions and prevention for common crop diseases.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("All crops");
  const [active, setActive] = useState<Disease | null>(null);

  const results = diseaseLibrary.filter((d) => {
    const matchesCrop = crop === "All crops" || d.cropTag === crop;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.crops.join(" ").toLowerCase().includes(q) ||
      d.symptoms.toLowerCase().includes(q);
    return matchesCrop && matchesQuery;
  });

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Library</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          Know it before you see it
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Twelve of the diseases we see most often, with the conditions that bring them on and the
          practices that keep them out.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="relative block max-w-md">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a disease, crop or symptom"
              className="w-full rounded-full border border-border bg-card py-3.5 pr-4 pl-11 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {cropFilters.map((c) => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                className={cn(
                  "press shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                  crop === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((d) => (
              <motion.button
                key={d.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28 }}
                onClick={() => setActive(d)}
                className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <img
                  src={d.image}
                  alt={`${d.name} symptoms`}
                  loading="lazy"
                  width={768}
                  height={576}
                  className="h-40 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="font-display text-lg font-semibold">{d.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{d.crops.join(" · ")}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {d.symptoms}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {results.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Nothing matches "{query}". Try the crop name instead.
          </p>
        ) : null}
      </section>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card shadow-lift sm:rounded-3xl"
            >
              <div className="relative">
                <img
                  src={active.image}
                  alt={`${active.name} symptoms`}
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="press absolute top-4 right-4 rounded-full bg-card/90 p-2"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-semibold">{active.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Affects {active.crops.join(", ")}
                </p>

                <h3 className="mt-6 text-sm font-semibold">Symptoms</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {active.symptoms}
                </p>

                <h3 className="mt-5 text-sm font-semibold">When it spreads</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {active.spreads}
                </p>

                <h3 className="mt-5 text-sm font-semibold">Prevention</h3>
                <ul className="mt-2 space-y-2">
                  {active.prevention.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
