import { motion } from "motion/react";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";

import { ConfidenceRing } from "./ConfidenceRing";
import { SeverityBadge } from "./SeverityBadge";
import type { DiagnosisResult } from "@/data/types";

interface DiagnosisCardProps {
  result: DiagnosisResult;
  previewUrl?: string | null;
  saved?: boolean;
  onSave?: () => void;
  onReset?: () => void;
}

export function DiagnosisCard({
  result,
  previewUrl,
  saved,
  onSave,
  onReset,
}: DiagnosisCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift"
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:p-8">
        <ConfidenceRing value={result.confidence} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <SeverityBadge severity={result.severity} animate />
            <span className="text-xs text-muted-foreground">{result.crop}</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold">{result.disease}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
        </div>
      </div>

      {previewUrl ? (
        <div className="px-6 pb-6 md:px-8">
          <img
            src={previewUrl}
            alt="The leaf you submitted for diagnosis"
            className="h-44 w-full rounded-xl object-cover"
          />
        </div>
      ) : null}

      <div className="border-t border-border bg-secondary/40 p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold">What to do next</h3>
        <ol className="mt-5 space-y-4">
          {result.treatment.map((step, i) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
              className="flex gap-3.5"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                {step.detail ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onSave}
            disabled={saved}
            className="press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-70"
          >
            {saved ? <CheckCircle2 className="size-4" /> : <Save className="size-4" />}
            {saved ? "Saved to history" : "Save to History"}
          </button>
          <button
            onClick={onReset}
            className="press inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-secondary"
          >
            <RotateCcw className="size-4" />
            Diagnose Another
          </button>
        </div>
      </div>
    </motion.article>
  );
}
