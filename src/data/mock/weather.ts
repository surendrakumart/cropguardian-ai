import type { ForecastDay, SprayConditions } from "../types";

// MOCK: replace with a weather provider response mapped to SprayConditions.
export const mockSprayConditions: SprayConditions = {
  temperatureC: 29,
  humidityPct: 74,
  windKph: 21,
  rainChancePct: 35,
  condition: "Partly cloudy",
  sprayScore: 42,
  verdict: "caution",
  reasoning:
    "Wind is gusting at 21 km/h — above the 15 km/h drift threshold for fine droplets. Spraying now risks losing product onto the neighbouring plot. Winds ease after 6pm; that is your safest window today.",
  updatedAt: "2026-08-11T11:20:00.000Z",
};

// MOCK: replace with a 5-day forecast endpoint mapped to ForecastDay[].
export const mockForecast: ForecastDay[] = [
  {
    date: "2026-08-11",
    label: "Today",
    highC: 29,
    lowC: 21,
    humidityPct: 74,
    rainChancePct: 35,
    windKph: 21,
    condition: "Partly cloudy",
    diseaseRisk: "medium",
    riskNote: "Humidity climbing after midday — watch for early mildew on shaded leaves.",
  },
  {
    date: "2026-08-12",
    label: "Wed",
    highC: 31,
    lowC: 23,
    humidityPct: 86,
    rainChancePct: 70,
    windKph: 12,
    condition: "Thundery showers",
    diseaseRisk: "high",
    riskNote: "High fungal risk — warm, humid and 8+ hours of leaf wetness expected.",
  },
  {
    date: "2026-08-13",
    label: "Thu",
    highC: 30,
    lowC: 23,
    humidityPct: 88,
    rainChancePct: 65,
    windKph: 10,
    condition: "Humid and overcast",
    diseaseRisk: "high",
    riskNote: "Second wet day in a row — blight and downy mildew spread quickly in this window.",
  },
  {
    date: "2026-08-14",
    label: "Fri",
    highC: 28,
    lowC: 20,
    humidityPct: 62,
    rainChancePct: 20,
    windKph: 16,
    condition: "Breezy, clearing",
    diseaseRisk: "medium",
    riskNote: "Drying out. Good day to inspect and remove any lesions from the wet spell.",
  },
  {
    date: "2026-08-15",
    label: "Sat",
    highC: 27,
    lowC: 18,
    humidityPct: 48,
    rainChancePct: 5,
    windKph: 9,
    condition: "Clear and dry",
    diseaseRisk: "low",
    riskNote: "Low risk. Calm and dry — the best spray window of the week.",
  },
];
