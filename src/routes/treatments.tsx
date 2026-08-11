import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, CalendarClock } from "lucide-react";

import { SeverityBadge } from "@/components/SeverityBadge";
import { SiteFooter } from "@/components/SiteFooter";
import { mockTreatments } from "@/data/mock/treatments";
import { STORAGE_KEYS, useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/treatments")({
  head: () => ({
    meta: [
      { title: "Treatment tracker — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "Work through each treatment programme step by step, with progress and next-action reminders per block.",
      },
      { property: "og:title", content: "Treatment tracker — AgriShield" },
      {
        property: "og:description",
        content: "Track every treatment programme through to the last spray.",
      },
    ],
  }),
  component: TreatmentsPage,
});

function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(1, Math.floor(ms / 86_400_000) + 1);
}

function TreatmentsPage() {
  const { value: progress, setValue } = useLocalStorage<Record<string, string[]>>(
    STORAGE_KEYS.treatments,
    {},
  );

  const toggle = (treatmentId: string, stepId: string, initial: string[]) => {
    setValue((prev) => {
      const current = prev[treatmentId] ?? initial;
      const next = current.includes(stepId)
        ? current.filter((s) => s !== stepId)
        : [...current, stepId];
      return { ...prev, [treatmentId]: next };
    });
  };

  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Treatments</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          Active treatment programmes
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Tick each step as you finish it in the field. Progress is saved on this device.
        </p>

        <div className="mt-10 space-y-5">
          {mockTreatments.map((t) => {
            const done = progress[t.id] ?? t.completedStepIds;
            const pct = Math.round((done.length / t.steps.length) * 100);
            const day = Math.min(daysSince(t.startedAt), t.durationDays);

            return (
              <article
                key={t.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{t.crop}</p>
                    <h2 className="mt-0.5 font-display text-xl font-semibold">{t.disease}</h2>
                  </div>
                  <SeverityBadge severity={t.severity} />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Day {day} of {t.durationDays}
                    </span>
                    <span>{pct}% complete</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 160, damping: 24 }}
                    />
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {t.steps.map((step) => {
                    const checked = done.includes(step.id);
                    return (
                      <li key={step.id}>
                        <button
                          onClick={() => toggle(t.id, step.id, t.completedStepIds)}
                          className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/70"
                        >
                          <motion.span
                            animate={
                              checked
                                ? { scale: [1, 1.25, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.32, ease: "easeOut" }}
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background",
                            )}
                          >
                            {checked ? <Check className="size-3.5" /> : null}
                          </motion.span>
                          <span>
                            <span
                              className={cn(
                                "text-sm font-medium transition-colors",
                                checked && "text-muted-foreground line-through",
                              )}
                            >
                              {step.label}
                            </span>
                            {step.detail ? (
                              <span className="block text-xs text-muted-foreground">
                                {step.detail}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent-soft/50 p-4">
                  <CalendarClock className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed">{t.nextAction}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
