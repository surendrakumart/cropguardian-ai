import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Camera, CloudSun, ClipboardList, ScanLine, ShieldCheck, SprayCan } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { StatCounter } from "@/components/StatCounter";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriShield Crop Doctor — AI crop health & climate resilience" },
      {
        name: "description",
        content:
          "Photograph a leaf, get a diagnosis in seconds, and see the five-day climate risk to your crop. Built for smallholder farmers.",
      },
      { property: "og:title", content: "AgriShield Crop Doctor" },
      {
        property: "og:description",
        content:
          "AI crop disease diagnosis, spray safety and climate risk forecasting for smallholder farmers.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: Camera,
    title: "Photograph the leaf",
    body: "Snap the affected leaf in daylight. One clear photo is enough — no special equipment, no data plan needed for the capture.",
  },
  {
    icon: ScanLine,
    title: "Get a diagnosis in seconds",
    body: "Our model compares your photo against 40,000 field images and returns the likely disease with a confidence score you can judge for yourself.",
  },
  {
    icon: ClipboardList,
    title: "Follow the treatment plan",
    body: "Step-by-step actions in plain language, timed around the weather, and tracked day by day until the block recovers.",
  },
];

const features = [
  {
    icon: ScanLine,
    title: "Disease Diagnosis",
    body: "Identify blight, rust, mildew and 40+ other conditions from a single photo, with a confidence score and severity rating.",
    to: "/diagnose" as const,
  },
  {
    icon: CloudSun,
    title: "Climate Risk Forecast",
    body: "A five-day outlook that translates temperature and humidity into the fungal and bacterial risk your field actually faces.",
    to: "/climate" as const,
  },
  {
    icon: SprayCan,
    title: "Spray Safety Radar",
    body: "Know before you mix. Wind, rain and heat combine into one clear verdict: safe, caution, or wait.",
    to: "/spray" as const,
  },
  {
    icon: ClipboardList,
    title: "Treatment Tracking",
    body: "Every diagnosis becomes a checklist with reminders, so nothing is missed halfway through a fourteen-day programme.",
    to: "/treatments" as const,
  },
];

function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob-drift absolute -top-32 -left-24 size-[26rem] rounded-full bg-primary-soft blur-3xl opacity-70" />
          <div className="blob-drift-slow absolute -top-10 right-[-6rem] size-[22rem] rounded-full bg-accent-soft blur-3xl opacity-70" />
          <div className="blob-drift absolute top-64 left-1/3 size-[18rem] rounded-full bg-primary-soft blur-3xl opacity-50" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-28 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Trusted by 2,400 farms across three growing regions
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">
              Catch crop disease early. Farm ahead of the weather.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Crop Doctor reads a single photo of a struggling leaf, names the disease, and pairs it
              with a five-day climate risk forecast — so you treat at the right moment instead of
              guessing after the damage is done.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/diagnose"
                className="press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-lift hover:bg-primary/92"
              >
                <ScanLine className="size-4" />
                Diagnose Now
              </Link>
              <Link
                to="/climate"
                className="press inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium hover:bg-secondary"
              >
                See this week's risk
              </Link>
            </div>
          </motion.div>

          <Reveal delay={0.15} className="mt-16 md:mt-24">
            <dl className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-card/70 shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { value: 10000, suffix: "+", label: "Diagnoses run in the field" },
                { value: 94, suffix: "%", label: "Accuracy on the top 15 diseases" },
                { value: 5, suffix: "-day", label: "Climate risk forecasting" },
              ].map((stat) => (
                <div key={stat.label} className="px-6 py-7">
                  <dt className="font-display text-4xl font-semibold text-primary">
                    <StatCounter to={stat.value} suffix={stat.suffix} />
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-balance md:text-4xl">
            Three steps between a worrying leaf and a plan you can act on
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <step.icon className="size-5" />
                </span>
                <p className="mt-6 text-xs font-medium text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8 md:pb-16">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-semibold text-balance md:text-4xl">
            Everything a season demands, in one calm place
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <Link
                to={feature.to}
                className="group block h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                <span className="mt-5 inline-block text-sm font-medium text-primary">
                  Open
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
