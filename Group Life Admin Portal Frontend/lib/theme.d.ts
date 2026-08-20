import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    heading?: string;
    valueText?: string;
  }
  interface Palette {
    iconDark: string;
    status: {
      activeBg: string;
      activeText: string;
      inactiveBg: string;
      inactiveText: string;
      graceBg: string;
      graceText: string;
      lapsedBg: string;
      lapsedText: string;
      lightCyan: string;
      cancelledBg: string;
      cancelledText: string;
      reInstatedBg: string;
      reInstatedText: string;
      ntuBg: string;
      ntuText: string;
      unpaidBg: string;
      unpaidText: string;
      awaitingBg: string;
      awaitingText: string;
      rejectedBg: string;
      rejectedText: string;
      rejectionAlertBg: string;
      rejectionAlertBorder: string;
      requestedInfoBg: string;
      requestedInfoText: string;
    };
    light: {
      tableHeaderBg: string;
    };
    dark: {
      tableHeaderBg: string;
    };
    sidebar: {
      bg: string;
      border: string;
      foreground: string;
      foregroundMuted: string;
      activeBg: string;
      activeText: string;
    };
    metrics: {
      valueText: string;
      descriptionText: string;
      creditBalanceBg: string;
      creditBalanceBorder: string;
    };
    tabs: {
      background: string;
    };
  }

  interface PaletteOptions {
    iconDark?: string;
    status?: {
      activeBg?: string;
      activeText?: string;
      inactiveBg?: string;
      inactiveText?: string;
      graceBg?: string;
      graceText?: string;
      lapsedBg?: string;
      lapsedText?: string;
      lightCyan?: string;
      cancelledBg?: string;
      cancelledText?: string;
      reInstatedBg?: string;
      reInstatedText?: string;
      ntuBg?: string;
      ntuText?: string;
      unpaidBg?: string;
      unpaidText?: string;
      awaitingBg?: string;
      awaitingText?: string;
      rejectedBg?: string;
      rejectedText?: string;
      rejectionAlertBg?: string;
      rejectionAlertBorder?: string;
      requestedInfoBg?: string;
      requestedInfoText?: string;
    };
    light: {
      tableHeaderBg?: string;
    };
    dark: {
      tableHeaderBg?: string;
    };
    sidebar?: {
      bg?: string;
      border?: string;
      foreground?: string;
      foregroundMuted?: string;
      activeBg?: string;
      activeText?: string;
    };
    metrics?: {
      valueText?: string;
      descriptionText?: string;
      creditBalanceBg?: string;
      creditBalanceBorder?: string;
    };
    tabs?: {
      background?: string;
    };
  }
}
