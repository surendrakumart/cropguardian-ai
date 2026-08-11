import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Camera, ImageUp, Leaf } from "lucide-react";
import { useRef, useState } from "react";

import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { SiteFooter } from "@/components/SiteFooter";
import type { DiagnosisResult } from "@/data/types";
import { STORAGE_KEYS, useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diagnose")({
  head: () => ({
    meta: [
      { title: "Diagnose a leaf - AgriShield Crop Doctor" },
      {
        name: "description",
        content:
          "Upload or photograph an affected leaf and get a disease diagnosis, severity rating and step-by-step treatment plan.",
      },
      { property: "og:title", content: "Diagnose a leaf - AgriShield Crop Doctor" },
      {
        property: "og:description",
        content: "Photo in, diagnosis and treatment plan out - in seconds.",
      },
    ],
  }),
  component: DiagnosePage,
});

type Phase = "idle" | "analysing" | "result" | "error";

function fileToBase64(file: File): Promise<string> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result as string);
    };
    reader.onerror = function (err) {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}

function DiagnosePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const history = useLocalStorage<DiagnosisResult[]>(STORAGE_KEYS.history, []);

  async function runDiagnosis(file: File) {
    setSaved(false);
    setErrorMessage("");
    setPreview(URL.createObjectURL(file));
    setPhase("analysing");

    try {
      const base64Image = await fileToBase64(file);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Diagnosis failed, please try again.";
        throw new Error(msg);
      }

      const finalResult: DiagnosisResult = {
        ...data,
        id: "dx-" + Date.now(),
        diagnosedAt: new Date().toISOString(),
      };

      setResult(finalResult);
      setPhase("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Diagnosis failed, please try again.";
      setErrorMessage(msg);
      setPhase("error");
    }
  }

  function onFiles(files: FileList | null) {
    const file = files ? files[0] : null;
    if (file) {
      runDiagnosis(file);
    }
  }

  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 md:pt-20">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Diagnose</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
          Show us the leaf
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          One clear photo in daylight works best - fill the frame with the affected leaf and keep
          your shadow out of the shot.
        </p>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {phase === "idle" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  onDragOver={function (e) {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={function () {
                    setDragging(false);
                  }}
                  onDrop={function (e) {
                    e.preventDefault();
                    setDragging(false);
                    onFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "rounded-2xl border-2 border-dashed bg-card px-6 py-14 text-center transition-colors",
                    dragging ? "border-primary bg-primary-soft/40" : "border-border"
                  )}
                >
                  <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Leaf className="size-7" />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-semibold">
                    Drop a leaf photo here
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    JPG or PNG, up to 10MB. Nothing leaves your phone until you press diagnose.
                  </p>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={function () {
                        if (cameraInput.current) cameraInput.current.click();
                      }}
                      className="press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground sm:hidden"
                    >
                      <Camera className="size-4" />
                      Take a photo
                    </button>
                    <button
                      onClick={function () {
                        if (fileInput.current) fileInput.current.click();
                      }}
                      className="press inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-secondary"
                    >
                      <ImageUp className="size-4" />
                      Choose from gallery
                    </button>
                  </div>

                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={function (e) {
                      onFiles(e.target.files);
                    }}
                  />
                  <input
                    ref={cameraInput}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={function (e) {
                      onFiles(e.target.files);
                    }}
                  />
                </div>
              </motion.div>
            ) : null}

            {phase === "analysing" ? (
              <motion.div
                key="analysing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Uploaded leaf awaiting diagnosis"
                    className="h-52 w-full rounded-2xl object-cover shadow-soft"
                  />
                ) : null}
                <AnalysisSkeleton />
              </motion.div>
            ) : null}

            {phase === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border bg-card px-6 py-10 text-center"
              >
                <p className="text-sm font-medium text-destructive">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={function () {
                    setPreview(null);
                    setErrorMessage("");
                    setPhase("idle");
                  }}
                  className="press mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Try again
                </button>
              </motion.div>
            ) : null}

            {phase === "result" && result ? (
              <motion.div key="result" exit={{ opacity: 0 }}>
                <DiagnosisCard
                  result={result}
                  previewUrl={preview}
                  saved={saved}
                  onSave={function () {
                    history.setValue(function (prev) {
                      const entry = preview ? { ...result, imageUrl: preview } : result;
                      return [entry, ...prev];
                    });
                    setSaved(true);
                  }}
                  onReset={function () {
                    setPreview(null);
                    setSaved(false);
                    setResult(null);
                    setPhase("idle");
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
                    }
