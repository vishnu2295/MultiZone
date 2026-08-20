import { Column, CustomTable } from "@/components/ui/CustomTable";
import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";

export interface Claim {
  id: string;
  claimNumber: string;
  claimType: string;
  incidentDate: string;
  claimDate: string;
  claimAmount: string;
  status: string;
  assessor: string;
  decisionDate: string;
}

const INITIAL_DATA: Claim[] = [
  {
    id: "1",
    claimNumber: "CLM-2026-004",
    claimType: "Death",
    incidentDate: "15-02-2026",
    claimDate: "20-02-2026",
    claimAmount: "R 15,000",
    status: "Pending",
    assessor: "John Doe",
    decisionDate: "N/A",
  },
  {
    id: "2",
    claimNumber: "CLM-2026-003",
    claimType: "Disability",
    incidentDate: "15-02-2026",
    claimDate: "20-02-2026",
    claimAmount: "R 15,000",
    status: "Approved",
    assessor: "John Doe",
    decisionDate: "20-02-2026",
  },
];

const ITEMS_PER_PAGE = 6;

export default function ClaimsTab() {
  const [data] = useState<Claim[]>(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;

  const columns: Column<Claim>[] = useMemo(
    () => [
      {
        header: "Claim Number",
        accessorKey: "claimNumber",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {row.claimNumber}
          </Typography>
        ),
      },
      {
        header: "Claim Type",
        accessorKey: "claimType",
      },
      {
        header: "Incident Date",
        accessorKey: "incidentDate",
      },
      {
        header: "Claim Date",
        accessorKey: "claimDate",
      },
      {
        header: "Claim Amount",
        accessorKey: "claimAmount",
      },
      {
        header: "Status",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Assessor",
        accessorKey: "assessor",
      },
      {
        header: "Decision Date",
        accessorKey: "decisionDate",
      },
    ],
    []
  );

  return (
    <CustomTable
      columns={columns}
      data={data}
      emptyMessage="No claims found."
      colSpanCount={8}
      itemsPerPage={ITEMS_PER_PAGE}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
}
