import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type {
  PartiesByDistrict,
  District,
  ElectionResult,
  ElectionSettings,
  Province,
  ResultLogEntry,
} from "../types";

interface AppContextValue {
  provinces: Province[];
  setProvinces: Dispatch<SetStateAction<Province[]>>;
  districts: District[];
  setDistricts: Dispatch<SetStateAction<District[]>>;
  parties: PartiesByDistrict;
  setParties: Dispatch<SetStateAction<PartiesByDistrict>>;
  settings: ElectionSettings;
  setSettings: Dispatch<SetStateAction<ElectionSettings>>;
  lastResult: ResultLogEntry | null;
  setLastResult: Dispatch<SetStateAction<ResultLogEntry | null>>;
  resultsLog: ResultLogEntry[];
  setResultsLog: Dispatch<SetStateAction<ResultLogEntry[]>>;
  appendResult: (result: ElectionResult) => ResultLogEntry;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Empty state keeps the assessment free of seeded/mock records. Connect the API here.
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [parties, setParties] = useState<PartiesByDistrict>({});
  const [settings, setSettings] = useState<ElectionSettings>({
    disqualifiedPercentage: 0,
  });
  const [lastResult, setLastResult] = useState<ResultLogEntry | null>(null);
  const [resultsLog, setResultsLog] = useState<ResultLogEntry[]>([]);

  const appendResult = (result: ElectionResult): ResultLogEntry => {
    const entry: ResultLogEntry = {
      ...result,
      logId:
        result.logId ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      calculatedAt: result.calculatedAt || new Date().toISOString(),
    };
    setResultsLog((previous) => [entry, ...previous]);
    setLastResult(entry);
    return entry;
  };

  const value = useMemo(
    () => ({
      provinces,
      setProvinces,
      districts,
      setDistricts,
      parties,
      setParties,
      settings,
      setSettings,
      lastResult,
      setLastResult,
      resultsLog,
      setResultsLog,
      appendResult,
    }),
    [provinces, districts, parties, settings, lastResult, resultsLog],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
