"use client";

import React, { useRef, useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useThemeToggle } from "@/app/providers";
import InputBase from "@mui/material/InputBase";
import {
  formatToDateMask,
  toDbFormat,
  toDisplayFormat,
  isValidDate,
} from "@/utils/date";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLInputElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function DateInput({
  value,
  onChange,
  inputStyle,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
}: DateInputProps) {
  const { isDarkMode } = useThemeToggle();
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  useEffect(() => {
    const displayVal = toDisplayFormat(value);
    if (toDbFormat(displayVal) !== toDbFormat(inputValueRef.current)) {
      setInputValue(displayVal);
    }
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const masked = formatToDateMask(rawValue);
    setInputValue(masked);

    if (isValidDate(masked)) {
      onChange(toDbFormat(masked));
    } else {
      onChange("");
    }
  };

  const handleCalendarClick = () => {
    if (hiddenInputRef.current) {
      if (typeof hiddenInputRef.current.showPicker === "function") {
        hiddenInputRef.current.showPicker();
      } else {
        hiddenInputRef.current.click();
      }
    }
  };

  const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate && isValidDate(selectedDate)) {
      const displayDate = toDisplayFormat(selectedDate);
      setInputValue(displayDate);
      onChange(selectedDate);
    }
  };

  const iconColor = isDarkMode ? "#ffffff" : "#475569";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        ref={hiddenInputRef}
        type="date"
        value={value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
        onChange={handleHiddenInputChange}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <InputBase
        placeholder="dd/mm/yyyy"
        value={inputValue}
        onChange={handleTextChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        fullWidth
        sx={{
          background: "var(--input)",
          border: "1.88px solid var(--input-border)",
          borderRadius: "6px",
          color: !value
            ? isDarkMode
              ? "#A0A0A0"
              : "rgb(71, 85, 105)"
            : "inherit",
          ...inputStyle,
          boxSizing: "border-box",
          paddingRight: "40px",
          width: "100%",
        }}
      />

      {/* Visible calendar icon — clicking triggers the native picker */}
      <span
        onClick={handleCalendarClick}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: iconColor,
          zIndex: 1,
        }}
      >
        <Calendar size={17} strokeWidth={2} />
      </span>
    </div>
  );
}
