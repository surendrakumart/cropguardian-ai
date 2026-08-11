import { createFileRoute } from "@tanstack/react-router";
import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SeverityBadge } from "@/components/SeverityBadge";
import { SiteFooter } from "@/components/SiteFooter";
import { mockForecast } from "@/data/mock/weather";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/climate")({
  head: () => ({
    meta: [
      { title: "Climate Risk Forecast — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "A five-day forecast that translates temperature, humidity and rainfall into the disease risk facing your crop.",
      },
      { property: "og:title", content: "Climate Risk Forecast — AgriShield" },
      {
        property: "og:description",
        content: "Five days of weather translated into real crop disease risk.",
      },
    ],
  }),
  component: ClimatePage,
});

function ClimatePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">
          Climate risk
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          The next five days, read as disease risk
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Weather alone does not tell you much. Here is what this week's conditions mean for the
          pathogens already sitting in your field.
        </p>
      </section>

      <section className="no-scrollbar overflow-x-auto px-6 pb-4">
        <div className="mx-auto flex max-w-6xl gap-4 pb-4">
          {mockForecast.map((day, i) => (
            <Reveal key={day.date} delay={i * 0.08}>
              <article
                className={cn(
                  "flex h-full w-[248px] shrink-0 flex-col rounded-2xl border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1",
                  day.diseaseRisk === "high"
                    ? "risk-glow border-risk-high/40"
                    : "border-border",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-lg font-semibold">{day.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{day.condition}</p>

                <p className="mt-5 font-display text-4xl font-semibold">
                  {day.highC}°<span className="text-lg text-muted-foreground">/{day.lowC}°</span>
                </p>

                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Droplets className="size-4 text-primary" /> {day.humidityPct}% humidity
                  </li>
                  <li className="flex items-center gap-2">
                    <CloudRain className="size-4 text-primary" /> {day.rainChancePct}% rain
                  </li>
                  <li className="flex items-center gap-2">
                    <Wind className="size-4 text-primary" /> {day.windKph} km/h wind
                  </li>
                </ul>

                <div className="mt-6 border-t border-border pt-5">
                  <SeverityBadge
                    severity={day.diseaseRisk}
                    label={`${day.diseaseRisk} disease risk`}
                    className="capitalize"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {day.riskNote}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-soft md:p-9">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Thermometer className="size-5" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold">
              Why climate affects crop disease
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Most crop diseases are fungi or bacteria, and they need three things to take hold:
                warmth, moisture and time. When a leaf stays wet for more than six hours at
                temperatures between 20 and 30°C, spores germinate and push into the leaf tissue.
              </p>
              <p>
                That is why two humid nights in a row matter far more than a single heavy downpour.
                Rain that dries off by mid-morning gives the pathogen no window; warm drizzle that
                lingers gives it a whole one.
              </p>
              <p>
                Reading the forecast this way changes the timing of your work. Treat before a wet
                spell rather than after it, spray on the calm dry day, and inspect the field the
                morning a humid run breaks.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
