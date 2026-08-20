"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserProvider } from "@/lib/context/UserContext";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { themeDark, themeLight } from "@/lib/theme";

interface ThemeToggleContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggleContext = createContext<ThemeToggleContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useThemeToggle = () => useContext(ThemeToggleContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load the persisted theme state from localStorage after mounting
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored !== null) {
      setIsDarkMode(stored === "true");
    }
  }, []);

  // Update global CSS variables dynamically when theme changes
  useEffect(() => {
    // Inject style to temporarily disable transitions
    const css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(
      document.createTextNode(
        `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`
      )
    );
    document.head.appendChild(css);

    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty("--background", "#181818");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--card", "#1E1E1E");
      root.style.setProperty("--border", "#30363D");
      root.style.setProperty("--sidebar-bg", "#0B0D10");
      root.style.setProperty("--sidebar-border", "#1D2A36");
      root.style.setProperty("--sidebar-foreground", "#C4CDD8");
      root.style.setProperty("--sidebar-icon-color", "#E8E8E8");
      root.style.setProperty("--sidebar-hover-bg", "rgba(255, 255, 255, 0.06)");
      root.style.setProperty("--sidebar-active-bg", "rgba(31, 195, 235, 0.14)");
      root.style.setProperty("--primary-dark", "#159DBC");
      
      // Sidebar additional buttons
      root.style.setProperty("--sidebar-back-border", "#1E3339");
      root.style.setProperty("--sidebar-back-bg", "#0F1619");
      root.style.setProperty("--sidebar-back-color", "var(--primary)");
      root.style.setProperty("--sidebar-back-hover-bg", "#141C20");
      root.style.setProperty("--sidebar-logout-color", "#8D98A5");
      root.style.setProperty("--sidebar-logout-hover-color", "#A7B1BC");
      
      root.style.setProperty("--card-primary", "rgba(24, 24, 24, 0.8)");
      root.style.setProperty("--card-secondary", "var(--card)");
      root.style.setProperty("--card-title-color", "#E6EDF3");
      root.style.setProperty("--quick-actions-bg", "#E6EDF3");
      root.style.setProperty("--table-header-bg", "#262626");
      root.style.setProperty("--input", "#262626");
      root.style.setProperty("--input-border", "#333333");
      
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#A0A0A0");
      root.style.setProperty("--text-muted", "#5E6A77");
      root.style.setProperty("--step-label", "#A4A4A4");
      root.style.setProperty("--step-bg", "#2A3340");
      root.style.setProperty("--icon-color", "#E3E3E3");
      root.style.setProperty("--text-heading", "#E6E6E6");
      root.style.setProperty("--header-icon-color", "var(--text-heading)");
      root.style.setProperty("--metric-label-color", "#C5C5C5");
      root.style.setProperty("--metric-card-bg", "var(--input)");
      root.style.setProperty("--quick-action-desc-color", "#8B949E");

      root.style.setProperty("--quote-card-bg", "#303030CC");
      root.style.setProperty("--quote-icon-bg", "#E6E6E61A");
      root.style.setProperty("--quote-icon-fill", "var(--text-primary)");
      root.style.setProperty("--dashboard-card-bg", "#303030CC");
      root.style.setProperty("--dashboard-card-icon-color", "var(--icon-color)");
      root.style.setProperty("--dashboard-card-hover-border", "#1FC3EB");
      root.style.setProperty("--dashboard-card-hover-bg", "#1fc3eb0d");
      root.style.setProperty("--dashboard-card-icon-wrapper-color", "var(--dashboard-card-hover-border)");
      
      root.style.setProperty("--button-primary-disabled-bg", "#2a7a8f");
      root.style.setProperty("--button-primary-color", "#0A0A0A");
      root.style.setProperty("--button-primary-disabled-color", "#ffffff");
      root.style.setProperty("--success", "#22c55e");

      root.style.setProperty("--slider-value-bg", "#121212");
      root.style.setProperty("--date-icon-filter", "invert(1) brightness(2)");
      root.style.setProperty("--color-scheme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.style.setProperty("--background", "#f7f7f7");
      root.style.setProperty("--foreground", "#0a0a0a");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--border", "#e2e8f0");
      root.style.setProperty("--sidebar-bg", "#ffffff");
      root.style.setProperty("--sidebar-border", "#e2e8f0");
      root.style.setProperty("--sidebar-foreground", "#334155");
      root.style.setProperty("--sidebar-icon-color", "#334155");
      root.style.setProperty("--sidebar-hover-bg", "rgba(0, 0, 0, 0.04)");
      root.style.setProperty("--sidebar-active-bg", "rgba(31, 195, 235, 0.1)");
      root.style.setProperty("--primary-dark", "#159DBC");
      
      // Sidebar additional buttons
      root.style.setProperty("--sidebar-back-border", "#1fc3eb4d");
      root.style.setProperty("--sidebar-back-bg", "#1fc3eb0f");
      root.style.setProperty("--sidebar-back-color", "#0090B0");
      root.style.setProperty("--sidebar-back-hover-bg", "#1fc3eb1f");
      root.style.setProperty("--sidebar-logout-color", "#8D98A5");
      root.style.setProperty("--sidebar-logout-hover-color", "#A7B1BC");
      
      root.style.setProperty("--card-primary", "rgba(255, 255, 255, 0.95)");
      root.style.setProperty("--card-secondary", "var(--card)");
      root.style.setProperty("--card-title-color", "#0f172a");
      root.style.setProperty("--quick-actions-bg", "#f1f5f9");
      root.style.setProperty("--table-header-bg", "#f1f5f9");
      root.style.setProperty("--input", "#ffffff");
      root.style.setProperty("--input-border", "#e2e8f0");
      
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--step-label", "#94a3b8");
      root.style.setProperty("--step-bg", "#e2e8f0");
      root.style.setProperty("--icon-color", "#0f172a");
      root.style.setProperty("--text-heading", "#0f172a");
      root.style.setProperty("--header-icon-color", "var(--text-heading)");
      root.style.setProperty("--metric-label-color", "#64748B");
      root.style.setProperty("--metric-card-bg", "var(--input)");
      root.style.setProperty("--quick-action-desc-color", "#64748B");

      root.style.setProperty("--quote-card-bg", "rgba(255, 255, 255, 0.8)");
      root.style.setProperty("--quote-icon-bg", "rgba(148,163,184,0.14)");
      root.style.setProperty("--quote-icon-fill", "var(--text-primary)");
      root.style.setProperty("--dashboard-card-bg", "rgba(255, 255, 255, 0.95)");
      root.style.setProperty("--dashboard-card-icon-color", "var(--icon-color)");
      root.style.setProperty("--dashboard-card-hover-border", "#1FC3EB");
      root.style.setProperty("--dashboard-card-hover-bg", "rgba(31, 195, 235, 0.05)");
      root.style.setProperty("--dashboard-card-icon-wrapper-color", "var(--dashboard-card-hover-border)");
      
      root.style.setProperty("--button-primary-disabled-bg", "#2a7a8f");
      root.style.setProperty("--button-primary-color", "#0A0A0A");
      root.style.setProperty("--button-primary-disabled-color", "#ffffff");
      root.style.setProperty("--success", "#22c55e");

      root.style.setProperty("--date-icon-filter", "none");
      root.style.setProperty("--slider-value-bg", "#e2e8f0");
      root.style.setProperty("--color-scheme", "light");
      root.style.colorScheme = "light";
    }

    // Force a reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window.getComputedStyle(css).opacity;

    // Remove the style block after a frame
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (document.head.contains(css)) {
          document.head.removeChild(css);
        }
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (document.head.contains(css)) {
        document.head.removeChild(css);
      }
    };
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", String(next));
      return next;
    });
  };

  return (
    <AppRouterCacheProvider>
      <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme }}>
        <ThemeProvider theme={isDarkMode ? themeDark : themeLight}>
          <CssBaseline />
          <SidebarProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </SidebarProvider>
        </ThemeProvider>
      </ThemeToggleContext.Provider>
    </AppRouterCacheProvider>
  );
}
