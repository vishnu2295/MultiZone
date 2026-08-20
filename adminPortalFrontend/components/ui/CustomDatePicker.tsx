import { useState } from "react";
import { Box, TextField, Typography, SxProps, Theme } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

export interface DateRange {
  start: string;
  end: string;
}

export interface CustomDatePickerProps {
  isRange?: boolean;
  value: string | DateRange;
  onChange: (value: any) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

interface DateFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  sx?: any;
}

function DateField({ value, onChange, placeholder, sx }: DateFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box sx={{ position: "relative", border: "none", outline: "none", ...sx }}>
      <TextField
        type="date"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        fullWidth
        slotProps={{
          htmlInput: {
            min: "1900-01-01",
            max: "2100-12-31",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            cursor: "pointer",

            "& .MuiOutlinedInput-notchedOutline": {
              border: value || isFocused ? undefined : "none",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid",
            },
          },

          "& input": {
            color: !value && !isFocused ? "transparent" : "inherit",
            cursor: "pointer",
          },
        }}
      />
      {!value && !isFocused && (
        <Box
          sx={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            bgcolor: "background.paper", // Ensure it covers native text
            pointerEvents: "none",
            borderRadius: 1.5,
            border: "1px solid #d9d9d9",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ color: "text.secondary", fontSize: 15 }}>
            {placeholder}
          </Typography>
          <CalendarTodayOutlinedIcon
            sx={{ fontSize: 20, color: "text.primary" }}
          />
        </Box>
      )}
    </Box>
  );
}

export default function CustomDatePicker({
  isRange = false,
  value,
  onChange,
  placeholder = "Date",
  sx,
}: CustomDatePickerProps) {
  const commonSx = {
    "& .MuiOutlinedInput-root": {
      height: 44,
      borderRadius: 2,
      fontSize: 14,
    },
    ...sx,
  };

  if (isRange) {
    const rangeVal =
      typeof value === "object" && value !== null
        ? value
        : { start: "", end: "" };

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DateField
          value={rangeVal.start || ""}
          onChange={(val) => onChange({ ...rangeVal, start: val })}
          placeholder="Start"
          sx={{ width: 140, ...commonSx }}
        />
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          to
        </Typography>
        <DateField
          value={rangeVal.end || ""}
          onChange={(val) => onChange({ ...rangeVal, end: val })}
          placeholder="End"
          sx={{ width: 140, ...commonSx }}
        />
      </Box>
    );
  }

  const singleVal = typeof value === "string" ? value : "";

  return (
    <DateField
      value={singleVal}
      onChange={(val) => onChange(val)}
      placeholder={placeholder}
      sx={{
        width: 140,
        ...commonSx,
      }}
    />
  );
}
