"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  FormHelperText,
  SxProps,
  Theme,
  Box,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
  placeholder?: string;
  renderValue?: (value: string) => React.ReactNode;
}

const BaseInputNoNotch = React.forwardRef((props: any, ref) => {
  const { notched, label, ...rest } = props;
  return <InputBase {...rest} inputRef={ref} />;
});
BaseInputNoNotch.displayName = "BaseInputNoNotch";

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  value,
  onChange,
  sx,
  placeholder,
  renderValue,
}) => {
  return (
    <FormControl size="small" error={!!error}>
      {label && <InputLabel>{label}</InputLabel>}

      <MuiSelect
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        displayEmpty
        input={<BaseInputNoNotch />}
        renderValue={(val) => {
          if (!val && placeholder) {
            return (
              <Box component="span" sx={{ color: "text.secondary" }}>
                {placeholder}
              </Box>
            );
          }
          if (renderValue) {
            return renderValue(val as string);
          }
          const selectedOption = options.find((opt) => opt.value === val);
          return selectedOption ? selectedOption.label : (val as string);
        }}
        sx={{
          width: "143px",
          height: "40px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: error ? "error.main" : "divider",
          bgcolor: "background.paper",
          fontSize: "13px",
          padding: "0 12px",
          gap: "10px",
          boxSizing: "border-box",
          ".MuiSelect-select": {
            padding: 0,
            paddingRight: "24px !important",
            display: "flex",
            alignItems: "center",
            height: "100%",
          },
          "&.Mui-focused": {
            borderColor: "primary.main",
          },
          ...(typeof sx === "object" ? sx : {}),
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
          slotProps: {
            paper: {
              sx: {
                marginTop: "4px",
                zIndex: 9999,
                maxHeight: "300px",
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && <FormHelperText sx={{ ml: 0 }}>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
