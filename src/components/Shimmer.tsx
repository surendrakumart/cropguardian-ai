import { cn } from "@/lib/utils";

/** Shimmering placeholder block — used instead of spinners. */
export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("shimmer-sweep rounded-lg bg-muted", className)} />;
}
