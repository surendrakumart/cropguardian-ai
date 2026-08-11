# CropGuardian AI

Build "Crop Doctor" (AgriShield) — a premium AI-powered crop health and climate resilience platform for farmers. This should feel like a real funded agtech product — think Linear/Vercel-level design polish applied to an earthy, organic agricultural context. NOT a cheesy stock-photo farm site. NOT a generic template look.

=== DESIGN SYSTEM ===

Colors: deep forest green (#2D4A2B) as primary, warm terracotta/clay (#C77B4A) as accent, cream/off-white background (#FAF7F0), charcoal text (#2A2A28). Use color with restraint — mostly neutral with green/terracotta as accents on buttons, icons, data highlights, and status indicators.

Typography: Fraunces (serif, headings — editorial and premium) + Inter (sans, body/UI). Large confident headlines, generous line-height on body copy.

Rounded corners, soft layered shadows, generous whitespace, nothing cramped.

Micro-interactions everywhere: buttons scale slightly on press, cards lift on hover, smooth page transitions, skeleton/shimmer loading states (never plain spinners).

Mobile-first responsive, but should look equally intentional on desktop.

No lorem ipsum anywhere — all placeholder copy should be real, farmer-relevant text.

=== PAGES ===

1. LANDING PAGE

Hero: bold headline about protecting crops with AI + climate intelligence, subheadline, primary CTA "Diagnose Now"

Animated subtle gradient blob or slow organic shape drifting in hero background

Stats row with count-up animation on scroll into view (e.g. "10,000+ diagnoses", "94% accuracy", "5-day climate forecasting")

"How it works" 3-step section with icons, staggered fade/slide-in on scroll

Feature cards (Disease Diagnosis, Climate Risk Forecast, Spray Safety Radar, Treatment Tracking) — each lifts slightly on hover

Footer with nav links to all pages

2. DIAGNOSE PAGE

Elegant photo upload zone (drag/drop + camera capture for mobile), nice empty-state icon/illustration

On upload: image preview, then shimmer skeleton loading state cycling through reassuring status texts ("Scanning leaf patterns...", "Cross-referencing disease database...", "Preparing treatment plan...")

Results card: disease name, confidence % shown as an animated radial progress ring that counts up on load, color-coded severity badge (low/medium/high) with a spring pop-in animation, plain-language explanation, clear step-by-step treatment recommendation

"Save to History" and "Diagnose Another" buttons

Uses MOCK data for now — structure to accept real API data via props later

3. WEATHER + SPRAY RADAR PAGE

Current weather card: temp, humidity, wind speed, rain chance, clean line-icon set with subtle idle motion (drifting cloud, pulsing sun)

Spray Radar: custom circular gauge/dial, needle animates smoothly into position on load (not an instant snap) showing Safe/Caution/Unsafe

Short plain-language reasoning below gauge (e.g. "Wind speed too high — spray drift risk")

3-day mini forecast strip

Uses MOCK data for now

4. CLIMATE RISK FORECAST PAGE (important — this page ties directly to the "climate resilience" theme)

5-day forecast displayed as a horizontal scroll of day-cards

Each card shows temp/humidity/rain PLUS a computed "disease risk" flag (e.g. "High fungal risk — warm + humid conditions")

High-risk days have a subtle pulsing glow/highlight border to draw the eye

A short explainer section: "Why climate affects crop disease" in plain language

Uses MOCK data for now, structured to accept real forecast API data later

5. HISTORY / TIMELINE DASHBOARD

Grid/list of past diagnoses as cards: photo thumbnail, disease name, date, severity badge

Cards stagger-fade in on page load

A simple trend line chart showing severity over time, animated to draw itself in when scrolled into view

Filter chips by severity or crop type (smooth filter transition, no jarring re-layout)

Friendly empty state for first-time users (illustration + "Your diagnosis history will appear here")

6. TREATMENT TRACKER PAGE

List of active treatments (linked from past diagnoses) as cards

Each has a checklist of treatment steps — checking a box gives a satisfying micro-bounce animation

Progress bar per treatment that fills smoothly as steps complete

"Day X of treatment" indicator with next-action reminder text

7. DISEASE LIBRARY PAGE

Searchable/filterable reference grid of 10-15 common crop diseases

Each entry: image, name, affected crops, symptoms, prevention tips

Search bar with smooth live-filtering (fade transition, not instant pop)

Filter chips by crop type

Tapping a card opens a detail view/modal with full info

8. ABOUT / IMPACT PAGE

Short, sincere mission statement on climate resilience + smallholder farmers

Simple animated stat counters or icons for impact framing

=== NAVIGATION ===

Clean bottom tab bar for mobile (Home, Diagnose, Climate, History, More) with a top nav fallback for desktop

Active tab clearly highlighted with smooth indicator transition

"More" or overflow menu can house Treatment Tracker, Disease Library, About if tab bar space is tight

=== TECHNICAL NOTES ===

React + Vite, fully responsive, mobile-first

All API-driven pages (Diagnose, Weather/Spray Radar, Climate Forecast) use clearly separated MOCK data for now, structured so real API responses can be dropped in later with minimal refactoring

History uses localStorage for persistence (no backend/auth needed)

Modular, clearly named components: DiagnosisCard, SprayRadarGauge, ClimateRiskCard, TreatmentChecklist, DiseaseLibraryCard, TrendChart, etc.

Keep animations snappy — 200-400ms, spring easing over linear where natural (buttons, badges, checkmarks)

=== TONE ===

Confident, calm, trustworthy — a tool a real farmer would rely on, not a flashy tech demo. Premium but grounded. Never gimmicky or overly playful.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f881803b-0486-4a88-978e-76b02258c177).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
