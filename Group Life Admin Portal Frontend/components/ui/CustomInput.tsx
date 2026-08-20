"use client";

import React, { forwardRef, useState } from "react";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export interface CustomInputProps extends Omit<InputBaseProps, "error"> {
  containerStyle?: React.CSSProperties;
  error?: string | boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ containerStyle, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const hasError = typeof error === "string" ? !!error : error;
    const isPassword = type === "password";

    return (
      <Box style={containerStyle} sx={{ width: "100%" }}>
        <InputBase
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          inputRef={ref}
          fullWidth
          endAdornment={
            isPassword ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ) : null
          }
          sx={{
            width: "100%",
            height: "44px",
            padding: "0 12px",
            border: `1px solid ${
              hasError ? "var(--destructive, #ef4444)" : "#D9D9D9"
            }`,
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            bgcolor: "background.paper",
            ...props.sx,
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
