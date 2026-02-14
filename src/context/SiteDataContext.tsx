import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteData, defaultSiteData } from "@/data/siteData";

interface SiteDataContextType {
  data: SiteData;
  updateData: (newData: Partial<SiteData>) => void;
  updateSection: <K extends keyof SiteData>(section: K, value: SiteData[K]) => void;
  resetToDefaults: () => void;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

const STORAGE_KEY = "catering-site-data";

function loadData(): SiteData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSiteData, ...parsed };
    }
  } catch {}
  return defaultSiteData;
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadData);

  useEffect(() => {
    // Only save non-default image URLs (user-uploaded ones)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<SiteData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const updateSection = <K extends keyof SiteData>(section: K, value: SiteData[K]) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultSiteData);
  };

  return (
    <SiteDataContext.Provider value={{ data, updateData, updateSection, resetToDefaults }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}
