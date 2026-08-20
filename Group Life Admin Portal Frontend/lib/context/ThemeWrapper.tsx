// ThemeWrapper.tsx
"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { useThemeToggle } from "@/lib/context/ThemeToggleContext";
import { COLORS } from "@/lib/colors";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, mounted } = useThemeToggle();

  // Use a stable "dark" default until the client has mounted and read localStorage.
  // This ensures SSR and the initial client render use identical theme values,
  // preventing the hydration mismatch caused by CSS class name differences.
  const effectiveDarkMode = mounted ? isDarkMode : true;

  const theme = useMemo(() => {
    const modeColors = effectiveDarkMode ? COLORS.dark : COLORS.light;
    const sidebarColors = effectiveDarkMode
      ? COLORS.sidebar.dark
      : COLORS.sidebar.light;

    return createTheme({
      palette: {
        mode: effectiveDarkMode ? "dark" : "light",

        primary: {
          main: COLORS.primary,
          light: COLORS.primaryLight,
          dark: COLORS.primaryDark,
        },
        light: {
          tableHeaderBg: COLORS.light.tableHeaderBg,
        },
        dark: {
          tableHeaderBg: COLORS.dark.tableHeaderBg,
        },
        error: {
          main: COLORS.error,
          light: COLORS.errorBg,
          dark: COLORS.errorText,
        },

        success: {
          main: COLORS.success,
        },

        iconDark: modeColors.icon,

        background: {
          default: modeColors.background,
          paper: modeColors.card,
        },

        text: {
          primary: modeColors.text,
          secondary: modeColors.textMuted,
          heading: modeColors.textHeading,
          valueText: isDarkMode
            ? modeColors.textHeading
            : COLORS.light.valueText,
        },

        status: {
          activeBg: effectiveDarkMode
            ? COLORS.status.activeBgDark
            : COLORS.status.activeBg,
          activeText: effectiveDarkMode
            ? COLORS.status.activeTextDark
            : COLORS.status.activeText,
          inactiveBg: effectiveDarkMode
            ? COLORS.status.inactiveBgDark
            : COLORS.status.inactiveBg,
          inactiveText: effectiveDarkMode
            ? COLORS.status.inactiveTextDark
            : COLORS.status.inactiveText,
          graceBg: effectiveDarkMode
            ? COLORS.status.graceBgDark
            : COLORS.status.graceBg,
          graceText: effectiveDarkMode
            ? COLORS.status.graceTextDark
            : COLORS.status.graceTextDark,
          lapsedBg: effectiveDarkMode
            ? COLORS.status.lapsedBgDark
            : COLORS.status.lapsedBg,
          lapsedText: effectiveDarkMode
            ? COLORS.status.lapsedTextDark
            : COLORS.textBlack,
          lightCyan: effectiveDarkMode
            ? COLORS.status.lightCyanDark
            : COLORS.status.lightCyan,
          cancelledBg: effectiveDarkMode
            ? COLORS.status.cancelledBgDark
            : COLORS.status.cancelledBg,
          cancelledText: effectiveDarkMode
            ? COLORS.status.cancelledTextDark
            : COLORS.textBlack,
          reInstatedBg: effectiveDarkMode
            ? COLORS.status.activeBgDark
            : COLORS.status.reInstatedBg,
          reInstatedText: effectiveDarkMode
            ? COLORS.status.activeTextDark
            : COLORS.status.activeText,
          ntuBg: effectiveDarkMode
            ? COLORS.status.lightCyanDark
            : COLORS.status.ntuBg,
          ntuText: effectiveDarkMode ? COLORS.primaryDark : COLORS.textBlack,
          unpaidBg: isDarkMode
            ? COLORS.status.lapsedBgDark
            : COLORS.status.unpaidBg,
          unpaidText: isDarkMode
            ? COLORS.status.lapsedTextDark
            : COLORS.status.unpaidText,
          awaitingBg: isDarkMode
            ? COLORS.status.awaitingBg
            : COLORS.status.awaitingBg,
          awaitingText: isDarkMode
            ? COLORS.status.awaitingText
            : COLORS.status.awaitingText,
          rejectedBg: isDarkMode
            ? COLORS.status.rejectedBg
            : COLORS.status.rejectedBg,
          rejectedText: isDarkMode
            ? COLORS.status.rejectedText
            : COLORS.status.rejectedText,
          rejectionAlertBg: isDarkMode
            ? COLORS.status.rejectionAlertBg
            : COLORS.status.rejectionAlertBg,
          rejectionAlertBorder: isDarkMode
            ? COLORS.status.rejectionAlertBorder
            : COLORS.status.rejectionAlertBorder,
          requestedInfoBg: isDarkMode
            ? COLORS.status.requestedInfoBg
            : COLORS.status.requestedInfoBg,
          requestedInfoText: isDarkMode
            ? COLORS.status.requestedInfoText
            : COLORS.status.requestedInfoText,
        },
        metrics: {
          valueText: isDarkMode ? modeColors.text : COLORS.metrics.valueText,
          descriptionText: isDarkMode
            ? modeColors.textMuted
            : COLORS.metrics.descriptionText,
          creditBalanceBg: isDarkMode
            ? COLORS.metrics.creditBalanceBgDark
            : COLORS.metrics.creditBalanceBg,
          creditBalanceBorder: isDarkMode
            ? COLORS.metrics.creditBalanceBorderDark
            : COLORS.metrics.creditBalanceBorder,
        },
        tabs: {
          background: isDarkMode ? "white" : COLORS.tabs.background,
        },

        sidebar: sidebarColors,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: modeColors.background,
              color: modeColors.text,
            },
          },
        },
      },
    });
  }, [effectiveDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
