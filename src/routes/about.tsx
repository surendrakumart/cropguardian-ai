import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Sprout, Users } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { StatCounter } from "@/components/StatCounter";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our mission — AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "Why we built Crop Doctor: climate resilience and early disease detection for smallholder farmers.",
      },
      { property: "og:title", content: "Our mission — AgriShield Crop Doctor" },
      {
        property: "og:description",
        content: "Climate resilience and early disease detection for smallholder farmers.",
      },
    ],
  }),
  component: About,
});

const impact = [
  { icon: Users, value: 2400, suffix: "", label: "Farms using Crop Doctor weekly" },
  { icon: Sprout, value: 31, suffix: "%", label: "Average reduction in crop loss reported" },
  { icon: HeartHandshake, value: 12, suffix: "", label: "Extension partners on the ground" },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 pt-14 pb-10 md:pt-24">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Our mission</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold text-balance md:text-5xl">
            Climate change moves faster than advice reaches the field
          </h1>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              A smallholder farmer typically waits days for an extension officer, and by then a
              treatable outbreak has already cost a third of the harvest. Warmer, wetter seasons have
              made that delay far more expensive than it used to be.
            </p>
            <p>
              Crop Doctor closes that gap. A photograph and a phone are enough to name the problem,
              understand how serious it is, and get a treatment plan written the way a neighbour
              would explain it — not the way a chemical label reads.
            </p>
            <p>
              We pair every diagnosis with local climate risk, because most crop disease is really a
              weather story. Knowing that Thursday will be warm and humid is often more useful than
              knowing what happened on Monday.
            </p>
            <p>
              We are not trying to replace agronomists. We are trying to make sure that the farmers
              who never had access to one still get an honest, timely answer.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {impact.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <item.icon className="size-5" />
                </span>
                <p className="mt-6 font-display text-4xl font-semibold text-primary">
                  <StatCounter to={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-4">
        <Reveal>
          <div className="rounded-2xl border border-accent/25 bg-accent-soft/40 p-7">
            <h2 className="font-display text-xl font-semibold">A note on accuracy</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Crop Doctor is confident, not certain. Every result carries a confidence score, and
              anything below 70% is flagged for a second photo or a human opinion. Chemical rates
              always vary by country and by product — confirm them with your local extension officer
              before you mix.
            </p>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
