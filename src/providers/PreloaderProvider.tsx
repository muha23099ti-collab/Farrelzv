"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Tipe untuk context
interface PreloaderContextType {
  isLoaded: boolean;
  setLoaded: () => void;
}

// Buat context
const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined,
);

// Buat komponen Provider
export const PreloaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const setLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <PreloaderContext.Provider value={{ isLoaded, setLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloaderState = () => {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error("usePreloaderState must be used within a PreloaderProvider");
  }
  return context;
};