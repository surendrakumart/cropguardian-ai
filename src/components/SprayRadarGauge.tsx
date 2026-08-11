import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface SprayRadarGaugeProps {
  score: number; // 0-100, higher is safer
  verdict: "safe" | "caution" | "unsafe";
}

const verdictLabel = { safe: "Safe to spray", caution: "Spray with caution", unsafe: "Do not spray" };
const verdictColor = { safe: "text-risk-low", caution: "text-risk-medium", unsafe: "text-risk-high" };

/** Semi-circular dial whose needle eases into position on load. */
export function SprayRadarGauge({ score, verdict }: SprayRadarGaugeProps) {
  const [angle, setAngle] = useState(-90);

  useEffect(() => {
    const target = -90 + (score / 100) * 180;
    const id = setTimeout(() => setAngle(target), 120);
    return () => clearTimeout(id);
  }, [score]);

  const arc = (from: number, to: number) => {
    const r = 88;
    const p = (deg: number) => {
      const rad = ((deg - 180) * Math.PI) / 180;
      return [110 + r * Math.cos(rad), 110 + r * Math.sin(rad)];
    };
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="w-full max-w-[320px]">
        <path d={arc(0, 60)} fill="none" strokeWidth={14} strokeLinecap="round" className="stroke-risk-high/80" />
        <path d={arc(62, 118)} fill="none" strokeWidth={14} strokeLinecap="round" className="stroke-risk-medium/80" />
        <path d={arc(120, 180)} fill="none" strokeWidth={14} strokeLinecap="round" className="stroke-risk-low/80" />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "110px 110px",
            transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <line x1="110" y1="110" x2="110" y2="36" strokeWidth={4} strokeLinecap="round" className="stroke-foreground" />
        </g>
        <circle cx="110" cy="110" r="8" className="fill-foreground" />
      </svg>

      <p className={cn("mt-2 font-display text-2xl font-semibold", verdictColor[verdict])}>
        {verdictLabel[verdict]}
      </p>
      <div className="mt-1 flex w-full max-w-[320px] justify-between px-2 text-[11px] text-muted-foreground">
        <span>Unsafe</span>
        <span>Caution</span>
        <span>Safe</span>
      </div>
    </div>
  );
}
