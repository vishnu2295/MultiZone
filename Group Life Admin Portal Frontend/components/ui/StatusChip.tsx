import { Chip, ChipProps, useTheme } from "@mui/material";

interface StatusChipProps extends Omit<ChipProps, "color"> {
  status: string;
}

const STATUS_VARIANTS: Record<string, keyof typeof STATUS_GROUPS> = {
  active: "active",
  approved: "active",
  verified: "active",
  paid: "active",
  allocated: "active",
  successful: "active",
  open: "active",
  "off-sett applied": "active",
  clear: "active",

  inactive: "inactive",
  unverified: "inactive",

  cancelled: "cancelled",
  declined: "cancelled",
  rejected: "rejected",
  removed: "rejected",

  lapsed: "lapsed",
  error: "lapsed",
  failed: "lapsed",
  suspended: "lapsed",
  blacklisted: "lapsed",
  "marked as cancelled": "lapsed",

  "grace period": "grace",
  pending: "grace",
  "awaiting docs": "grace",
  "submitted for reversal": "grace",

  "re-instated": "reInstated",

  ntu: "ntu",
  "in review": "ntu",

  unpaid: "unpaid",
  unallocated: "unpaid",
  reversed: "unpaid",

  "awaiting approval": "awaitingApproval", // Map to ntu (usually yellow/orange)
  "requested info": "requestedInfo",

  low: "active",
  medium: "awaitingApproval",
  high: "rejected",
};

const STATUS_GROUPS = {
  active: {
    bg: "activeBg",
    text: "activeText",
  },
  inactive: {
    bg: "inactiveBg",
    text: "inactiveText",
  },
  cancelled: {
    bg: "cancelledBg",
    text: "cancelledText",
  },
  lapsed: {
    bg: "lapsedBg",
    text: "lapsedText",
  },
  grace: {
    bg: "graceBg",
    text: "graceText",
  },
  reInstated: {
    bg: "reInstatedBg",
    text: "reInstatedText",
  },
  ntu: {
    bg: "ntuBg",
    text: "ntuText",
  },
  unpaid: {
    bg: "unpaidBg",
    text: "unpaidText",
  },
  awaitingApproval: {
    bg: "awaitingBg",
    text: "awaitingText",
  },
  rejected: {
    bg: "rejectedBg",
    text: "rejectedText",
  },
  requestedInfo: {
    bg: "requestedInfoBg",
    text: "requestedInfoText",
  },
} as const;

export function StatusChip({ status, sx, ...props }: StatusChipProps) {
  const theme = useTheme();

  const normalizedStatus = status?.toLowerCase().split(":")[0].trim() || "";
  const variant = STATUS_VARIANTS[normalizedStatus] ?? "inactive";
  console.log("pppppppppppppppppp", normalizedStatus, variant);
  const { bg, text } = STATUS_GROUPS[variant];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: 12,
        bgcolor: theme.palette.status[bg],
        color: theme.palette.status[text],
        ...sx,
      }}
      {...props}
    />
  );
}
