import { createFileRoute } from "@tanstack/react-router";
import { CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SprayRadarGauge } from "@/components/SprayRadarGauge";
import { mockForecast, mockSprayConditions } from "@/data/mock/weather";

export const Route = createFileRoute("/spray")({
  head: () => ({
    meta: [
      { title: "Spray Safety Radar — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "Live wind, humidity and rain conditions turned into one clear spray verdict: safe, caution or wait.",
      },
      { property: "og:title", content: "Spray Safety Radar — AgriShield" },
      {
        property: "og:description",
        content: "Know before you mix — wind, rain and heat in one clear verdict.",
      },
    ],
  }),
  component: SprayPage,
});

function SprayPage() {
  const w = mockSprayConditions;

  const metrics = [
    { icon: Thermometer, label: "Temperature", value: `${w.temperatureC}°C` },
    { icon: Droplets, label: "Humidity", value: `${w.humidityPct}%` },
    { icon: Wind, label: "Wind", value: `${w.windKph} km/h` },
    { icon: CloudRain, label: "Rain chance", value: `${w.rainChancePct}%` },
  ];

  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-16 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Spray radar</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          Conditions right now
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {w.condition}. Updated{" "}
          {new Date(w.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
        </p>

        <Reveal className="mt-9">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <m.icon
                  className={`size-5 text-primary ${m.label === "Temperature" ? "icon-sun" : "icon-cloud"}`}
                />
                <p className="mt-4 font-display text-2xl font-semibold">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-6" delay={0.1}>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-soft md:p-9">
            <SprayRadarGauge score={w.sprayScore} verdict={w.verdict} />
            <p className="mx-auto mt-7 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
              {w.reasoning}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-6" delay={0.15}>
          <h2 className="font-display text-xl font-semibold">Next three days</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {mockForecast.slice(1, 4).map((day) => (
              <div key={day.date} className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft">
                <p className="text-xs font-medium text-muted-foreground">{day.label}</p>
                <Sun className="icon-sun mx-auto mt-3 size-5 text-accent" />
                <p className="mt-3 font-display text-lg font-semibold">{day.highC}°</p>
                <p className="text-xs text-muted-foreground">{day.rainChancePct}% rain</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
