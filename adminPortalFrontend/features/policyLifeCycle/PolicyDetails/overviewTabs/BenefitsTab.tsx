import { Column, CustomTable } from "@/components/ui/CustomTable";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

export interface Benefits {
  benefit: string;
  coverAmount: string;
  premium: string;
}
const INITIAL_BENEFITS: Benefits[] = [
  {
    benefit: "Life cover",
    coverAmount: "R 10 000",
    premium: "R 50 000",
  },
  {
    benefit: "Occupational Disability cover",
    coverAmount: "R 10 000",
    premium: "R 50 000",
  },
  {
    benefit: "Funeral Cover ",
    coverAmount: "R 10 000",
    premium: "R 50 000",
  },
];
export default function BenefitsTab() {
  const benefitsColumns: Column<Benefits>[] = useMemo(
    () => [
      {
        header: "Benifits",
        accessorKey: "benefit",
        width: "65%",
        cell: (row) => (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              {row.benefit}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Cover Amount",
        accessorKey: "coverAmount",
        width: "15%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 350,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.coverAmount}
          </Typography>
        ),
      },

      {
        header: "Premium",
        accessorKey: "premium",
        width: "15%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 250,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.premium}
          </Typography>
        ),
      },
    ],
    []
  );
  return (
    <CustomTable
      columns={benefitsColumns}
      data={INITIAL_BENEFITS}
      emptyMessage="No benefit found."
      colSpanCount={4}
    />
  );
}
