// Tiny client store for the current analysis session (no account needed).
// Persists to sessionStorage so a refresh on /analysis keeps the result.
import { useSyncExternalStore } from "react";
import { DEMO_DOCUMENT } from "./demo-data";

export interface AnalysisState {
  status: "idle" | "analyzed";
  fileName: string | null;
  source: "demo" | "upload" | null;
  analyzedAt: string | null;
  pendingDemo: boolean;
  simpleMode: boolean;
}

const KEY = "finsight-analysis";
const initial: AnalysisState = {
  status: "idle",
  fileName: null,
  source: null,
  analyzedAt: null,
  pendingDemo: false,
  simpleMode: false,
};

let state: AnalysisState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw), pendingDemo: false };
  } catch {
    /* ignore */
  }
}

function set(patch: Partial<AnalysisState>) {
  load();
  state = { ...state, ...patch };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export const analysisStore = {
  requestDemo: () => set({ pendingDemo: true }),
  consumeDemo: () => set({ pendingDemo: false }),
  complete: (fileName: string, source: "demo" | "upload") =>
    set({ status: "analyzed", fileName, source, analyzedAt: new Date().toISOString(), pendingDemo: false }),
  completeDemo: () => analysisStore.complete(DEMO_DOCUMENT.fileName, "demo"),
  reset: () => set({ ...initial }),
  setSimpleMode: (simpleMode: boolean) => set({ simpleMode }),
  get: () => {
    load();
    return state;
  },
};

export function useAnalysis(): AnalysisState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => analysisStore.get(),
    () => initial,
  );
}
