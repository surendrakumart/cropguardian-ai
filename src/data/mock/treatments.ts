import type { Treatment } from "../types";

// MOCK: treatments normally derive from saved diagnoses; progress persists locally.
export const mockTreatments: Treatment[] = [
  {
    id: "tx-1",
    diagnosisId: "dx-late-blight",
    disease: "Late Blight",
    crop: "Tomato",
    severity: "high",
    startedAt: "2026-08-09",
    durationDays: 14,
    nextAction: "Second copper spray is due tomorrow morning, before 9am.",
    steps: [
      { id: "t1", label: "Remove and burn affected leaves", detail: "Day 1" },
      { id: "t2", label: "First copper fungicide application", detail: "Day 1, early morning" },
      { id: "t3", label: "Switch irrigation to base watering", detail: "Day 2" },
      { id: "t4", label: "Second copper application", detail: "Day 8" },
      { id: "t5", label: "Re-photograph the block for a follow-up diagnosis", detail: "Day 12" },
    ],
    completedStepIds: ["t1", "t2", "t3"],
  },
  {
    id: "tx-2",
    diagnosisId: "dx-leaf-rust",
    disease: "Leaf Rust",
    crop: "Wheat",
    severity: "medium",
    startedAt: "2026-08-02",
    durationDays: 21,
    nextAction: "Scout the flag leaves again this weekend and log pustule density.",
    steps: [
      { id: "t1", label: "Scout 10 plants across the block", detail: "Day 1" },
      { id: "t2", label: "Apply triazole fungicide", detail: "Day 2" },
      { id: "t3", label: "Pause nitrogen top-dressing", detail: "Day 2" },
      { id: "t4", label: "Second scouting pass", detail: "Day 12" },
      { id: "t5", label: "Order rust-tolerant seed for next season", detail: "Day 20" },
    ],
    completedStepIds: ["t1", "t2"],
  },
  {
    id: "tx-3",
    diagnosisId: "dx-powdery-mildew",
    disease: "Powdery Mildew",
    crop: "Cucumber",
    severity: "low",
    startedAt: "2026-07-24",
    durationDays: 21,
    nextAction: "Final bicarbonate spray, then close this treatment out.",
    steps: [
      { id: "t1", label: "Prune shaded lower leaves", detail: "Day 1" },
      { id: "t2", label: "First bicarbonate spray", detail: "Day 1" },
      { id: "t3", label: "Second bicarbonate spray", detail: "Day 8" },
      { id: "t4", label: "Third bicarbonate spray", detail: "Day 15" },
    ],
    completedStepIds: ["t1", "t2", "t3"],
  },
];
