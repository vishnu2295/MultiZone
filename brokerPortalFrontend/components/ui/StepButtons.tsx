"use client";

import React from "react";
import Button from "@mui/material/Button";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

interface NextButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        width: 78,
        height: 33,
        borderRadius: "100px",
        borderWidth: "1px",
        opacity: 1,
        gap: "10px",
        padding: "8px 22px",
        textTransform: "none",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
    >
      {label}
    </Button>
  );
}

interface SaveDraftButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export function SaveDraftButton({ onClick, label = "Save Draft", disabled = false }: SaveDraftButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outlined"
      sx={{
        width: 115,
        height: 33,
        borderRadius: "100px",
        borderWidth: "1px",
        opacity: 1,
        gap: "10px",
        padding: "8px 22px",
        textTransform: "none",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
        fontSize: "0.875rem",
        fontWeight: 400,
        whiteSpace: "nowrap",
        transition: "all 0.15s ease",
        "&.Mui-disabled": {
          opacity: 0.6,
        },
        "&:hover": {
          borderColor: "var(--text-secondary)",
          color: "var(--text-primary)",
          bgcolor: "transparent",
        },
      }}
    >
      {label}
    </Button>
  );
}

interface NextButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  variant?: "contained" | "outlined";
}

export function NextButton({ onClick, label = "Next Step", disabled = false, variant = "contained" }: NextButtonProps) {
  const isOutlined = variant === "outlined";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: "fit-content",
        padding: "8px 24px",
        height: 36,
        borderRadius: "8px",
        bgcolor: isOutlined ? "transparent" : (disabled ? "var(--button-primary-disabled-bg)" : "var(--primary)"),
        border: isOutlined ? "1px solid var(--border)" : "none",
        color: isOutlined ? "var(--text-primary)" : "var(--button-primary-color)",
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "none",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
        "&.Mui-disabled": {
          opacity: 0.6,
          bgcolor: isOutlined ? "transparent" : "var(--button-primary-disabled-bg)",
          borderColor: isOutlined ? "var(--border)" : "none",
          color: isOutlined ? "var(--text-secondary)" : "var(--button-primary-disabled-color)",
        },
        "&:hover": {
          opacity: isOutlined ? 1 : 0.85,
          bgcolor: isOutlined ? "var(--border)" : (disabled ? "var(--button-primary-disabled-bg)" : "var(--primary)"),
        },
      }}
    >
      {label}
    </Button>
  );
}
