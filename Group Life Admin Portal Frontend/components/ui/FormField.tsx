import React from "react";
import { Box, Typography } from "@mui/material";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      {children}
    </Box>
  );
};

export default FormField;
