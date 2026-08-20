import React from "react";
import { Box } from "@mui/material";
import { CustomTable, Column } from "@/components/ui/CustomTable";

interface BenefitData {
  benefit: string;
  coverAmount: string;
  premium: string;
}

const mockData: BenefitData[] = [
  {
    benefit: "Life Cover",
    coverAmount: "R 100,000.00",
    premium: "R 10,000.00",
  },
  {
    benefit: "Occupational Disability Cover",
    coverAmount: "R 100,000.00",
    premium: "R 10,000.00",
  },
  {
    benefit: "Funeral Cover",
    coverAmount: "R 100,000.00",
    premium: "R 12,500.00",
  },
];

export default function BenefitsTab() {
  const columns: Column<BenefitData>[] = [
    {
      header: "Benefit",
      accessorKey: "benefit",
      width: "60%",
      cell: (row) => (
        <Box sx={{ fontWeight: 700, color: "text.primary" }}>{row.benefit}</Box>
      ),
    },
    {
      header: "Cover Amount",
      accessorKey: "coverAmount",
    },
    {
      header: "Premium",
      accessorKey: "premium",
      cell: (row) => (
        <Box sx={{ fontWeight: 700, color: "text.primary" }}>{row.premium}</Box>
      ),
    },
  ];

  return (
    <Box>
      <CustomTable columns={columns} data={mockData} />
    </Box>
  );
}
