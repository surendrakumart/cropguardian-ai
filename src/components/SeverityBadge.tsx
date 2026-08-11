import { motion } from "motion/react";

import type { Severity } from "@/data/types";
import { cn } from "@/lib/utils";

const styles: Record<Severity, string> = {
  low: "bg-risk-low-soft text-risk-low",
  medium: "bg-risk-medium-soft text-risk-medium",
  high: "bg-risk-high-soft text-risk-high",
};

const labels: Record<Severity, string> = {
  low: "Low severity",
  medium: "Medium severity",
  high: "High severity",
};

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
  animate?: boolean;
  className?: string;
}

export function SeverityBadge({ severity, label, animate, className }: SeverityBadgeProps) {
  const content = (
    <>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label ?? labels[severity]}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
    styles[severity],
    className,
  );

  if (!animate) return <span className={classes}>{content}</span>;

  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
      className={classes}
    >
      {content}
    </motion.span>
  );
}
