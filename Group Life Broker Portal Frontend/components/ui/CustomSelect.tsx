"use client";

import React, { forwardRef } from "react";
import Select, { SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";

import FormHelperText from "@mui/material/FormHelperText";

export type CustomSelectProps = Omit<SelectProps, "input" | "error"> & {
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  error?: string | boolean;
};

// Wrapper to strip out the 'notched' prop that Select passes by default to outlined inputs
const BaseInputNoNotch = forwardRef((props: any, ref) => {
  const rest = { ...props };
  delete rest.notched;
  delete rest.label;
  return <InputBase {...rest} inputRef={ref} />;
});
BaseInputNoNotch.displayName = "BaseInputNoNotch";

export const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ containerStyle, children, placeholder = "", error, ...props }, ref) => {
    // Convert native option elements to MenuItem components
    const processedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        if (element.type === "option") {
          return (
            <MenuItem
              key={element.props.value}
              value={element.props.value}
              disabled={element.props.disabled}
              sx={element.props.hidden ? { display: "none" } : undefined}
            >
              {element.props.children}
            </MenuItem>
          );
        }
      }
      return child;
    });

    // Convert error string to boolean for MUI
    const hasError = typeof error === "string" ? !!error : error;

    return (
      <Box style={containerStyle} sx={{ width: "100%", position: "relative" }}>
        <Select
          inputRef={ref}
          fullWidth
          displayEmpty
          error={hasError}
          input={<BaseInputNoNotch />}
          sx={{
            background: "var(--input)",
            border: hasError ? "1.88px solid var(--destructive)" : "1.88px solid var(--input-border)",
            borderRadius: "6px",
            ...props.sx
          }}
          renderValue={(value: unknown) => {
            if (!value) {
              return <span style={{ color: "var(--text-secondary)" }}>{placeholder}</span>;
            }
            return value as React.ReactNode;
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            disablePortal: false,
            slotProps: {
              paper: {
                sx: {
                  marginTop: "4px",
                  zIndex: 9999,
                  maxHeight: "300px",
                  overflow: "auto",
                  width: "auto",
                },
              },
            },
          }}
          {...props}
        >
          {processedChildren}
        </Select>
        {typeof error === "string" && (
          <FormHelperText error sx={{ ml: 0 }}>
            {error}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
