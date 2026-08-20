"use client";

import React, { forwardRef } from "react";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";

export interface CustomInputProps extends Omit<InputBaseProps, "error"> {
  containerStyle?: React.CSSProperties;
  error?: string | boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ containerStyle, error, ...props }, ref) => {
    // Convert error string to boolean for MUI
    const hasError = typeof error === "string" ? !!error : error;

    return (
      <Box style={containerStyle} sx={{ width: "100%" }}>
        <InputBase
          {...props}
          error={hasError}
          inputRef={ref}
          fullWidth
          sx={{
            background: "var(--input)",
            border: hasError ? "1.88px solid var(--destructive)" : "1.88px solid var(--input-border)",
            borderRadius: "6px",
            ...props.sx
          }}
        />
        {typeof error === "string" && (
          <FormHelperText error sx={{ ml: 0 }}>
            {error}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;