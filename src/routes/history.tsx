import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ImageOff, Leaf } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { SeverityBadge } from "@/components/SeverityBadge";
import { SiteFooter } from "@/components/SiteFooter";
import { mockDiagnoses } from "@/data/mock/diagnoses";
import type { DiagnosisResult, Severity } from "@/data/types";
import { STORAGE_KEYS, useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Diagnosis history — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "Every past diagnosis in one timeline, with a severity trend so you can see whether the season is improving.",
      },
      { property: "og:title", content: "Diagnosis history — AgriShield" },
      {
        property: "og:description",
        content: "Your field's diagnosis timeline and severity trend.",
      },
    ],
  }),
  component: HistoryPage,
});

const severityValue: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

function TrendChart({ items }: { items: DiagnosisResult[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const points = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => +new Date(a.diagnosedAt) - +new Date(b.diagnosedAt),
    );
    const w = 560;
    const h = 150;
    return sorted.map((d, i) => {
      const x = sorted.length === 1 ? w / 2 : (i / (sorted.length - 1)) * (w - 40) + 20;
      const y = h - 20 - ((severityValue[d.severity] - 1) / 2) * (h - 50);
      return { x, y, d };
    });
  }, [items]);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold">Severity over time</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Each point is a saved diagnosis, plotted from low to high severity.
      </p>
      <svg viewBox="0 0 560 150" className="mt-5 w-full">
        {[20, 85, 150 - 20].map((y) => (
          <line key={y} x1={10} x2={550} y1={y} y2={y} className="stroke-border" strokeWidth={1} />
        ))}
        <path
          d={path}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: inView ? 0 : 2000,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {points.map((p) => (
          <circle
            key={p.d.id}
            cx={p.x}
            cy={p.y}
            r={4.5}
            className="fill-card stroke-primary"
            strokeWidth={2.5}
            style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.8s" }}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>Oldest</span>
        <span>Most recent</span>
      </div>
    </div>
  );
}

function HistoryPage() {
  const { value: stored, hydrated } = useLocalStorage<DiagnosisResult[]>(STORAGE_KEYS.history, []);
  const [filter, setFilter] = useState<string>("All");

  // Saved diagnoses first, then the sample field records shipped with the app.
  const items = useMemo(() => [...stored, ...mockDiagnoses], [stored]);

  const crops = Array.from(new Set(items.map((i) => i.crop)));
  const chips = ["All", "high", "medium", "low", ...crops];

  const visible = items.filter((i) =>
    filter === "All" ? true : i.severity === filter || i.crop === filter,
  );

  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-16 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">History</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          Your field's record
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Every diagnosis you save stays on this device. Patterns here often explain more than any
          single result.
        </p>

        {hydrated && items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <ImageOff className="size-7" />
            </span>
            <h2 className="mt-6 font-display text-xl font-semibold">
              Your diagnosis history will appear here
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Run your first leaf diagnosis and save it — we'll keep the photo, the result and the
              treatment plan together.
            </p>
            <Link
              to="/diagnose"
              className="press mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <Leaf className="size-4" />
              Diagnose a leaf
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-9">
              <TrendChart items={items} />
            </div>

            <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setFilter(chip)}
                  className={cn(
                    "press shrink-0 rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                    filter === chip
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>

            <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visible.map((item, i) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.32, delay: Math.min(i * 0.05, 0.3) }}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={`${item.disease} on ${item.crop}`}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-primary">
                          <Leaf className="size-6" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.crop}</p>
                      <h3 className="mt-0.5 font-display text-lg font-semibold">{item.disease}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(item.diagnosedAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {item.confidence}% confidence
                      </p>
                      <SeverityBadge severity={item.severity} className="mt-2.5" />
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
