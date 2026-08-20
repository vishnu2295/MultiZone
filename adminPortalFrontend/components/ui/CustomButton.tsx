"use client";

import React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export interface CustomButtonProps extends MuiButtonProps {
  variantType?: "primary" | "secondary" | "danger" | "ghost" | "outlined";
  sizeType?: "sm" | "md" | "lg";
  customColor?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variantType = "primary",
  sizeType = "md",
  customColor,
  sx,
  ...props
}) => {
  const sizeStyles = {
    sm: {
      px: 2,
      py: 0.75,
      fontSize: "0.75rem",
    },
    md: {
      px: 3,
      py: 1,
      fontSize: "0.875rem",
    },
    lg: {
      px: 4,
      py: 1.25,
      fontSize: "1rem",
    },
  };

  const variantStyles = {
    primary: {
      bgcolor: "primary.main",
      color: "#fff",
      "&:hover": {
        bgcolor: "primary.dark",
      },
    },

    secondary: {
      bgcolor: "background.paper",
      color: "text.primary",
      border: "1px solid",
      borderColor: "divider",

      "&:hover": {
        bgcolor: "action.hover",
      },
    },

    danger: {
      bgcolor: "error.main",
      color: "#fff",

      "&:hover": {
        bgcolor: "error.dark",
      },
    },

    ghost: {
      bgcolor: "transparent",
      color: "text.secondary",

      "&:hover": {
        bgcolor: "action.hover",
        color: "text.primary",
      },
    },

    outlined: {
      bgcolor: "transparent",
      color: customColor || "primary.main",
      border: "1px solid",
      borderColor: customColor || "primary.main",

      "&:hover": {
        // Simple trick to get a faint background using the current color if it's a theme token.
        // We use primary.50 for the default primary color, and action.hover for custom colors.
        bgcolor: customColor ? "action.hover" : "primary.50",
      },
    },
  };

  return (
    <MuiButton
      disableElevation
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        minWidth: "auto",
        boxShadow: "0px 4px 12.2px 0px #C4C4C440",
        whiteSpace: "nowrap",
        ...sizeStyles[sizeType],
        ...variantStyles[variantType],
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
