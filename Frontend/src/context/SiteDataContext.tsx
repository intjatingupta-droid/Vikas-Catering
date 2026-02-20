import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
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
    // Add cache-busting parameter to ensure fresh data
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(API_ENDPOINTS.siteData + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
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
      // Silently skip save if not authenticated (public users)
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
    
    // If unauthorized, clear the token
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return false;
    }
    
    return result.success;
  } catch (error) {
    console.error('Failed to save data to server:', error);
    return false;
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const savingRef = useRef(false);

  // Load data from server on mount
  useEffect(() => {
    console.log('📥 Loading data from server...');
    loadDataFromServer().then((loadedData) => {
      console.log('✓ Data loaded from server');
      setData(loadedData);
      setLoading(false);
    });
  }, []);

  // Save to server whenever data changes (debounced) - only if authenticated
  useEffect(() => {
    // Skip if still loading, already saving, or not authenticated
    if (loading || savingRef.current || !localStorage.getItem("token")) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      console.log('💾 Saving data to server...');
      savingRef.current = true;
      
      const success = await saveDataToServer(data);
      
      savingRef.current = false;
      
      if (success) {
        console.log('✓ Data saved to server successfully');
      } else {
        console.error('✗ Failed to save data to server');
      }
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
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
