import type { DiagnosisResult } from "../types";

// MOCK: replace with POST /api/diagnose response mapped to DiagnosisResult.
export const mockDiagnoses: DiagnosisResult[] = [
  {
    id: "dx-late-blight",
    disease: "Late Blight",
    crop: "Tomato",
    confidence: 94,
    severity: "high",
    summary:
      "Dark, water-soaked patches with pale green edges on the upper leaves — a classic late blight signature. Cool nights and long leaf wetness let it move fast, so treat within 24 hours to protect the rest of the field.",
    treatment: [
      {
        id: "s1",
        label: "Remove and burn affected leaves today",
        detail: "Do not compost them — spores survive and re-infect the next planting.",
      },
      {
        id: "s2",
        label: "Apply a copper-based fungicide in the early morning",
        detail: "Cover the underside of leaves; repeat after 7 days if rain continues.",
      },
      {
        id: "s3",
        label: "Widen plant spacing where you can",
        detail: "Better airflow dries leaves faster and slows the spread.",
      },
      {
        id: "s4",
        label: "Switch to drip or base watering",
        detail: "Keep water off the foliage, especially in the evening.",
      },
      {
        id: "s5",
        label: "Re-check the field in 5 days",
        detail: "Photograph any new lesions and run a fresh diagnosis.",
      },
    ],
    diagnosedAt: "2026-08-09T06:40:00.000Z",
  },
  {
    id: "dx-leaf-rust",
    disease: "Leaf Rust",
    crop: "Wheat",
    confidence: 88,
    severity: "medium",
    summary:
      "Small orange-brown pustules scattered along the leaf blade. Yield loss is modest if you act before the flag leaf is covered.",
    treatment: [
      { id: "s1", label: "Scout 10 plants across the block and note pustule density" },
      { id: "s2", label: "Apply a triazole fungicide if more than 5% of leaf area is affected" },
      { id: "s3", label: "Avoid extra nitrogen for the next two weeks" },
      { id: "s4", label: "Plan a rust-tolerant variety for the next season" },
    ],
    diagnosedAt: "2026-08-02T05:15:00.000Z",
  },
  {
    id: "dx-powdery-mildew",
    disease: "Powdery Mildew",
    crop: "Cucumber",
    confidence: 91,
    severity: "low",
    summary:
      "A light dusting of white powder on the older leaves. Caught early, a simple spray schedule and better airflow usually settle it.",
    treatment: [
      { id: "s1", label: "Prune the lowest shaded leaves" },
      { id: "s2", label: "Spray potassium bicarbonate solution weekly for three weeks" },
      { id: "s3", label: "Water at the base in the morning only" },
    ],
    diagnosedAt: "2026-07-24T07:05:00.000Z",
  },
  {
    id: "dx-bacterial-wilt",
    disease: "Bacterial Wilt",
    crop: "Maize",
    confidence: 79,
    severity: "high",
    summary:
      "Leaves are wilting during the day and only partly recovering overnight — a strong sign of vascular infection rather than drought stress.",
    treatment: [
      { id: "s1", label: "Pull and destroy collapsed plants with the root ball intact" },
      { id: "s2", label: "Disinfect tools between rows" },
      { id: "s3", label: "Hold off replanting maize in this block for one season" },
    ],
    diagnosedAt: "2026-07-11T09:30:00.000Z",
  },
];

// The result returned by the mock "analysis" on the Diagnose page.
export const mockDiagnosisResponse: DiagnosisResult = mockDiagnoses[0]!;

export const analysisStages = [
  "Scanning leaf patterns...",
  "Comparing against 40,000 field images...",
  "Cross-referencing disease database...",
  "Checking local humidity and rainfall...",
  "Preparing treatment plan...",
];
