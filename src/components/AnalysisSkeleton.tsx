import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { Shimmer } from "./Shimmer";
import { analysisStages } from "@/data/mock/diagnoses";

export function AnalysisSkeleton() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, analysisStages.length - 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
      <div className="flex items-center gap-5">
        <Shimmer className="size-[132px] shrink-0 rounded-full" />
        <div className="w-full space-y-3">
          <Shimmer className="h-5 w-28 rounded-full" />
          <Shimmer className="h-8 w-52" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-4/5" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Shimmer className="h-4 w-2/3" />
        <Shimmer className="h-4 w-1/2" />
      </div>

      <div className="mt-8 h-5 overflow-hidden">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="text-sm font-medium text-primary"
        >
          {analysisStages[stage]}
        </motion.p>
      </div>
    </div>
  );
}
