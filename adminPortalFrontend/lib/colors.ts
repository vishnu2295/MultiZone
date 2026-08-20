// Central color palette configuration for the Admin Portal.
// These match the values shown in the design and are referenced throughout the application.
export const COLORS = {
  primary: "#00C0E8", // Cyan / main accent color
  primaryHover: "#18a8cb", // Slightly darker cyan for hovers
  primaryLight: "#e8f9fd", // Light cyan background for selected items
  primaryDark: "#0b3f4d", // Dark cyan background for selected items in dark mode
  textBlack: "#303030",
  error: "#B85C5C",
  errorBg: "#FFEFEF",
  errorHoverBg: "#FFCDD2",
  errorText: "#E16464",
  success: "#009260",

  light: {
    icon: "#1E3339",
    background: "#f4f6f9", // Soft light blue-gray background
    card: "#ffffff", // Pure white card background
    text: "#353535", // Slate-800 for primary text
    textMuted: "#606060", // Custom slate gray for secondary text
    textHeading: "#191A1C", // Dark color for page headings
    valueText: "#161A23", // Custom value text color
    border: "#e5e7eb", // Light gray border
    inputBg: "#ffffff", // Input background
    tableHeaderBg: "#F5F5F5", // Table header background
    tableRowHover: "#f3f4f6", // Table row hover background
  },

  dark: {
    icon: "#f9fafb",
    background: "#0f172a", // Slate-900 background
    card: "#1e293b", // Slate-800 card background
    text: "#f9fafb", // Slate-50 for primary text
    textMuted: "#9ca3af", // Gray-400 for secondary text
    textHeading: "#f9fafb", // White color for page headings in dark mode
    border: "#374151", // Dark gray border
    inputBg: "#1e293b", // Input background
    tableHeaderBg: "#1e293b", // Table header background
    tableRowHover: "#334155", // Table row hover background
  },

  status: {
    activeBg: "#E2F8EB", // Light green for active user status
    activeText: "#009260", // Active text color
    activeBgDark: "#064e3b", // Dark green background
    activeTextDark: "#4ade80", // Dark green text

    inactiveBg: "#F0F4F8", // Light gray for inactive user status
    inactiveText: "#4B5563", // Inactive text color
    inactiveBgDark: "#374151", // Dark mode inactive status bg
    inactiveTextDark: "#9ca3af", // Dark mode inactive status text

    lapsedBg: "#FBEBEB", // Red background for lapsed/error
    lapsedBgDark: "#7f1d1d",
    lapsedTextDark: "#fca5a5",

    lightCyan: "#e0f2fe", // Light blue/cyan for icon backgrounds
    lightCyanDark: "#0c4a6e",

    cancelledBg: "#DADADA",
    cancelledBgDark: "#7f1d1d",
    cancelledTextDark: "#fca5a5",

    graceBg: "#FBF5EB",
    graceBgDark: "#7c2d12",
    graceTextDark: "#BD6800",

    reInstatedBg: "#F1FBEB",
    ntuBg: "#EBF9FB",
    unpaidBg: "#FBEBEB",
    unpaidText: "#555555",

    awaitingBg: "#FFF6E5",
    awaitingText: "#AD650D",

    rejectedBg: "#F8E2E2",
    rejectedText: "#D95757",
    rejectionAlertBg: "#FFF5F5",
    rejectionAlertBorder: "#F9DADA",
    requestedInfoBg: "#E8F9FD",
    requestedInfoText: "#00C0E8",
  },

  sidebar: {
    light: {
      bg: "#ffffff",
      border: "#e5e7eb",
      foreground: "#606060",
      foregroundMuted: "#202020",
      activeBg: "#00C0E8",
      activeText: "#ffffff",
      hover: "#0b3f4d",
    },
    dark: {
      bg: "#1e293b",
      border: "#374151",
      foreground: "#f8fafc",
      foregroundMuted: "#9ca3af",
      activeBg: "#0b3f4d",
      activeText: "#00C0E8",
    },
  },

  tabs: {
    background: "#202020B2",
  },

  metrics: {
    valueText: "#0D1526",
    descriptionText: "#5E6C8A",
    creditBalanceBg: "#F6FDFF",
    creditBalanceBgDark: "#0c3b47",
    creditBalanceBorder: "#9DE4F2",
    creditBalanceBorderDark: "#187a92",
  },
};
