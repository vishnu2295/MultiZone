"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  /** Minimum width of the bar. Pass "1200px" for wide tables, omit for card layouts. */
  minWidth?: string;
}

export default function PaginationBar({
  page,
  totalPages,
  totalItems,
  onPageChange,
  minWidth,
}: PaginationBarProps) {
  const safePage = Math.min(page, totalPages);

  return (
    <Box
      sx={{
        borderTop: "0.625px solid var(--border)",
        background: "var(--table-header-bg)",
        ...(minWidth && { minWidth, width: "100%" }),
      }}
    >
      <Box
        sx={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...(minWidth && { minWidth }),
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            color: "var(--text-secondary)",
          }}
        >
          Showing {(safePage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(safePage * PAGE_SIZE, totalItems)} of {totalItems} entries
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Button
            disabled={safePage === 1}
            onClick={() => onPageChange(safePage - 1)}
            variant="outlined"
            startIcon={<ChevronLeft size={14} />}
            sx={{
              height: "32px",
              px: "10px",
              bgcolor: "transparent",
              borderColor: "var(--border)",
              borderRadius: "8px",
              color: safePage === 1 ? "var(--text-muted)" : "var(--text-primary)",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              opacity: safePage === 1 ? 0.5 : 1,
              "&:hover": { bgcolor: "var(--table-header-bg)", borderColor: "var(--border)" },
            }}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              onClick={() => onPageChange(n)}
              variant={n === safePage ? "contained" : "outlined"}
              sx={{
                minWidth: "32px",
                width: "32px",
                height: "32px",
                p: 0,
                bgcolor: n === safePage ? "#1FC3EB" : "transparent",
                borderColor: n === safePage ? "none" : "var(--border)",
                borderRadius: "8px",
                color: n === safePage ? "#0A0A0A" : "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 500,
                "&:hover": { bgcolor: n === safePage ? "#0DB5D8" : "var(--table-header-bg)" },
              }}
            >
              {n}
            </Button>
          ))}

          <Button
            disabled={safePage === totalPages}
            onClick={() => onPageChange(safePage + 1)}
            variant="outlined"
            endIcon={<ChevronRight size={14} />}
            sx={{
              height: "32px",
              px: "10px",
              bgcolor: "transparent",
              borderColor: "var(--border)",
              borderRadius: "8px",
              color: safePage === totalPages ? "var(--text-muted)" : "var(--text-primary)",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              opacity: safePage === totalPages ? 0.5 : 1,
              "&:hover": { bgcolor: "var(--table-header-bg)", borderColor: "var(--border)" },
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}