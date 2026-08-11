# Crop Doctor (AgriShield) — Build Plan

A premium AI crop-health and climate-resilience app: 8 pages, mobile-first, mock data now, real APIs later.

## Design system

- Colors as tokens in `src/styles.css` (oklch): forest green primary `#2D4A2B`, terracotta accent `#C77B4A`, cream background `#FAF7F0`, charcoal text `#2A2A28`, plus severity tokens (low/medium/high) and a soft layered shadow set.
- Fonts loaded via `<link>` in the root route: Fraunces (headings) + Inter (body), registered as `--font-display` / `--font-sans`.
- Rounded corners, generous whitespace, restrained color — green/terracotta only on CTAs, icons, status, and data highlights.
- Motion: 200–400ms, spring easing. Button press-scale, card hover-lift, staggered scroll reveals, shimmer skeletons (never spinners).

## Navigation

- Mobile: fixed bottom tab bar — Home, Diagnose, Climate, History, More — with a sliding active indicator; "More" sheet holds Spray Radar, Treatment Tracker, Disease Library, About.
- Desktop: top nav with the same routes; bottom bar hidden.

## Pages

1. **Landing `/`** — hero with drifting organic gradient blob, "Diagnose Now" CTA; count-up stats row on scroll; 3-step "How it works" with staggered reveal; 4 feature cards with hover lift; footer nav.
2. **Diagnose `/diagnose`** — drag/drop + camera capture upload, illustrated empty state; preview then shimmer skeleton cycling reassuring status lines; results card with animated radial confidence ring, spring pop-in severity badge, plain-language explanation, step-by-step treatment; "Save to History" (localStorage) and "Diagnose Another".
3. **Weather + Spray Radar `/spray`** — current conditions card with idle-motion line icons; custom SVG circular gauge whose needle eases into Safe/Caution/Unsafe; plain-language reasoning; 3-day mini forecast strip.
4. **Climate Risk `/climate`** — horizontal scroll of 5 day-cards with temp/humidity/rain plus computed disease-risk flag; high-risk cards get a pulsing glow border; "Why climate affects crop disease" explainer.
5. **History `/history`** — stagger-fade diagnosis cards (thumbnail, disease, date, severity), severity/crop filter chips with smooth layout transitions, self-drawing severity trend line chart on scroll, friendly empty state.
6. **Treatment Tracker `/treatments`** — active treatment cards with checklists (micro-bounce on check), smooth progress bar, "Day X of treatment" and next-action reminder; state in localStorage.
7. **Disease Library `/library`** — 12 diseases: image, name, affected crops, symptoms, prevention; live-filtering search with fade transition, crop filter chips, detail modal.
8. **About / Impact `/about`** — sincere mission statement on climate resilience and smallholder farmers, animated impact counters.

## Technical approach

- TanStack Start file routes under `src/routes/`, one file per page, each with its own `head()` metadata.
- `src/data/mock/*.ts` holds diagnosis, weather, forecast, library, and treatment fixtures behind typed interfaces (`DiagnosisResult`, `SprayConditions`, `ForecastDay`, ...) so real API responses drop in without refactoring components.
- `src/lib/storage.ts` — typed localStorage hooks for history and treatment progress (SSR-safe, read in effects).
- Components: `DiagnosisCard`, `ConfidenceRing`, `SeverityBadge`, `SprayRadarGauge`, `WeatherCard`, `ClimateRiskCard`, `TreatmentChecklist`, `ProgressBar`, `DiseaseLibraryCard`, `DiseaseDetailModal`, `TrendChart`, `StatCounter`, `Shimmer`, `BottomTabBar`, `TopNav`.
- Animation via Motion (`motion/react`) plus CSS keyframes for ambient motion; charts and gauges hand-rolled in SVG (no chart library).
- Disease library and hero imagery generated as assets (organic, editorial photography style — no cheesy stock farm look).
- No backend, no auth.

## Notes

- Everything ships with realistic farmer-facing copy; no lorem ipsum.
- Build order: design tokens + nav shell → landing → diagnose → climate/spray → history/treatments → library/about.
