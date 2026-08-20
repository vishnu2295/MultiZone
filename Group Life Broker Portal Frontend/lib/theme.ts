"use client";

import { createTheme } from "@mui/material/styles";

export const themeDark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#3a9bfb",
      main: "#1CCAFF", // Replicates the exact primary brand color from Client Connect FrontEnd
      contrastText: "#333333",
    },
    secondary: {
      main: "#0FFFB3",
      contrastText: "#333333",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#333333",
    },
    background: {
      paper: "#202020",
      default: "#191919",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0A0",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          border: "1px solid #333333",
          borderRadius: "6px",
          backgroundColor: "#202020",
          padding: "0 12px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(31, 195, 235, 0.5)",
          },
          "&.Mui-focused": {
            borderColor: "#1FC3EB",
            boxShadow: "0 0 0 4px rgba(31, 195, 235, 0.2)",
          },
          "&.Mui-error": {
            borderColor: "#ef4444",
          },
          "&.Mui-error.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.2)",
          },
        },
        input: {
          padding: "0",
          fontSize: "14px",
          color: "#FFFFFF",
          height: "100%",
          "&::placeholder": {
            color: "#A0A0A0",
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "0 !important",
          fontSize: "14px",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          height: "100%",
          minHeight: "44px",
          "&[value='']": {
            color: "#A0A0A0",
          },
        },
        icon: {
          right: "8px",
          fontSize: "20px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          height: "32px",
          minHeight: "32px",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "rgba(31, 195, 235, 0.1)",
          },
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #333333",
          color: "#A0A0A0",
          backgroundColor: "transparent",
          textTransform: "none",
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          padding: "8px 16px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            color: "#0A0A0A",
            backgroundColor: "#1CCAFF",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#0DB5D8",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
  },
});

export const themeLight = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#3a9bfb",
      main: "#1DC2EA",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#14a37f",
      contrastText: "#F4F4F4",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#FFFFFF",
    },
    background: {
      paper: "#FFFFFF",
      default: "#F7F7F7",
    },
    text: {
      primary: "#0A0A0A",
      secondary: "#616161",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          borderRadius: "6px",
          backgroundColor: "#FFFFFF",
          padding: "0 12px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(29, 194, 234, 0.5)",
          },
          "&.Mui-focused": {
            borderColor: "#1DC2EA",
            boxShadow: "0 0 0 4px rgba(29, 194, 234, 0.2)",
          },
          "&.Mui-error": {
            borderColor: "#ef4444",
          },
          "&.Mui-error.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.2)",
          },
        },
        input: {
          padding: "0",
          fontSize: "14px",
          color: "#0A0A0A",
          height: "100%",
          "&::placeholder": {
            color: "#616161",
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "0 !important",
          fontSize: "14px",
          color: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          height: "100%",
          minHeight: "44px",
          "&[value='']": {
            color: "#616161",
          },
        },
        icon: {
          right: "8px",
          fontSize: "20px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          height: "32px",
          minHeight: "32px",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "rgba(29, 194, 234, 0.1)",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          color: "#475569",
          backgroundColor: "transparent",
          textTransform: "none",
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          padding: "8px 16px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            color: "#FFFFFF",
            backgroundColor: "#1DC2EA",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#0DB5D8",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
  },
});
