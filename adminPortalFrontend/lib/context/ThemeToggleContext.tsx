"use client";

import React, { createContext, useContext, useState } from "react";

interface ThemeToggleContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeToggleContext = createContext<ThemeToggleContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  mounted: false,
});

export const useThemeToggle = () => useContext(ThemeToggleContext);

export function ThemeToggleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      setIsDarkMode(storedTheme === "true");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", String(next));
      return next;
    });
  };

  return (
    <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
      {children}
    </ThemeToggleContext.Provider>
  );
}
