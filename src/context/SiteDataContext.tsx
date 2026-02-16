import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteData, defaultSiteData } from "@/data/siteData";
import { API_ENDPOINTS } from "@/config/api";

interface SiteDataContextType {
  data: SiteData;
  updateData: (newData: Partial<SiteData>) => void;
  updateSection: <K extends keyof SiteData>(section: K, value: SiteData[K]) => void;
  resetToDefaults: () => void;
  loading: boolean;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

async function loadDataFromServer(): Promise<SiteData> {
  try {
    const response = await fetch(API_ENDPOINTS.siteData);
    const result = await response.json();
    
    if (result.success && result.data) {
      // Merge with defaults to ensure new fields exist
      return {
        ...defaultSiteData,
        ...result.data,
        detailedMenu: result.data.detailedMenu || defaultSiteData.detailedMenu,
        ourWorkPage: result.data.ourWorkPage || defaultSiteData.ourWorkPage,
      };
    }
  } catch (error) {
    console.error('Failed to load data from server:', error);
  }
  return defaultSiteData;
}

async function saveDataToServer(data: SiteData): Promise<boolean> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No auth token found');
      return false;
    }

    const response = await fetch(API_ENDPOINTS.siteData, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to save data to server:', error);
    return false;
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);

  // Load data from server on mount
  useEffect(() => {
    loadDataFromServer().then((loadedData) => {
      setData(loadedData);
      setLoading(false);
    });
  }, []);

  // Save to server whenever data changes (debounced)
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        saveDataToServer(data);
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [data, loading]);

  const updateData = (newData: Partial<SiteData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const updateSection = <K extends keyof SiteData>(section: K, value: SiteData[K]) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const resetToDefaults = () => {
    setData(defaultSiteData);
    saveDataToServer(defaultSiteData);
  };

  return (
    <SiteDataContext.Provider value={{ data, updateData, updateSection, resetToDefaults, loading }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}
