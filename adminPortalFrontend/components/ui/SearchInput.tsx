import { Search } from "lucide-react";
import { Box, SxProps, Theme } from "@mui/material";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  sx,
}: SearchInputProps) {
  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "480px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "16px",
          color: "text.secondary",
          pointerEvents: "none",
          display: "flex",
        }}
      >
        <Search size={15} />
      </Box>

      <Box
        component="input"
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        sx={{
          width: "100%",
          height: "40px",
          borderRadius: "6px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          padding: "0 16px 0 36px",
          fontSize: "13px",
          color: "text.primary",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          "&:focus": {
            borderColor: "primary.main",
          },
        }}
      />
    </Box>
  );
}
