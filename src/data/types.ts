// Shared domain types. Mock data conforms to these shapes today; real API
// responses can be mapped into them later with no component changes.

export type Severity = "low" | "medium" | "high";

export interface TreatmentStep {
  id: string;
  label: string;
  detail?: string;
}

export interface DiagnosisResult {
  id: string;
  disease: string;
  crop: string;
  confidence: number; // 0-100
  severity: Severity;
  summary: string;
  treatment: TreatmentStep[];
  imageUrl?: string;
  diagnosedAt: string; // ISO date
}

export interface SprayConditions {
  temperatureC: number;
  humidityPct: number;
  windKph: number;
  rainChancePct: number;
  condition: string;
  sprayScore: number; // 0-100, higher is safer
  verdict: "safe" | "caution" | "unsafe";
  reasoning: string;
  updatedAt: string;
}

export interface ForecastDay {
  date: string; // ISO date
  label: string; // "Today", "Wed"
  highC: number;
  lowC: number;
  humidityPct: number;
  rainChancePct: number;
  windKph: number;
  condition: string;
  diseaseRisk: Severity;
  riskNote: string;
}

export interface Disease {
  id: string;
  name: string;
  crops: string[];
  cropTag: string;
  symptoms: string;
  prevention: string[];
  spreads: string;
  image: string;
}

export interface Treatment {
  id: string;
  diagnosisId: string;
  disease: string;
  crop: string;
  severity: Severity;
  startedAt: string; // ISO date
  durationDays: number;
  nextAction: string;
  steps: TreatmentStep[];
  completedStepIds: string[];
}
