"use client";

import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import { CustomButton } from "@/components/ui/CustomButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { useRouter, useSearchParams } from "next/navigation";

interface OnboardingQueueRow {
  quoteReferenceNo: string;
  brokerName: string;
  employer: string;
  quotedMembers: number;
  totalPremium: string;
  status: string;
}

export const mockData: OnboardingQueueRow[] = [
  {
    quoteReferenceNo: "QTE-2024-0022",
    brokerName: "Apex Brokerage Partners",
    employer: "Meridian Minerals (Pty) Ltd",
    quotedMembers: 134,
    totalPremium: "R 1,34,000.00",
    status: "Pending",
  },
  {
    quoteReferenceNo: "QTE-2024-0023",
    brokerName: "Cape Risk Solutions",
    employer: "Stellenbosch Wineries Co-operative",
    quotedMembers: 134,
    totalPremium: "R 1,34,000.00",
    status: "Pending",
  },
  {
    quoteReferenceNo: "QTE-2024-0024",
    brokerName: "Swiss Brokerage Partners",
    employer: "Highveld Steel Works Ltd",
    quotedMembers: 134,
    totalPremium: "R 1,34,000.00",
    status: "Approved",
  },
  {
    quoteReferenceNo: "QTE-2024-0025",
    brokerName: "Crane Brokerage Partners",
    employer: "Stellenbosch Wineries Co-operative",
    quotedMembers: 134,
    totalPremium: "R 1,34,000.00",
    status: "Rejected",
  },
  {
    quoteReferenceNo: "QTE-2024-0026",
    brokerName: "Johanantha Brokerage Partners",
    employer: "Highveld Steel Works Ltd",
    quotedMembers: 134,
    totalPremium: "R 1,34,000.00",
    status: "Rejected",
  },
];

export default function OnboardingQueueTab() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = React.useMemo(() => {
    return mockData.filter((item) => {
      const matchSearch =
        item.employer.toLowerCase().includes(search.toLowerCase()) ||
        item.brokerName.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status.toLowerCase() === "all" ||
        item.status.toLowerCase() === status.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [search, status]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  const totalData = filteredData.length;

  // Calculate pagination data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: Column<OnboardingQueueRow>[] = [
    {
      header: "Quote Reference No",
      accessorKey: "quoteReferenceNo",
    },
    {
      header: "Broker Name",
      accessorKey: "brokerName",
      cell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.brokerName}
        </Typography>
      ),
    },
    {
      header: "Employer",
      accessorKey: "employer",
    },
    {
      header: "Quoted Members",
      accessorKey: "quotedMembers",
    },
    {
      header: "Total Premium",
      accessorKey: "totalPremium",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <CustomButton
          variantType="secondary"
          sizeType="sm"
          onClick={() => {
            if (row.status !== "Rejected") {
              router.push(
                `/onboardingAdministration/reviewAndOnboard?quoteReference=${row.quoteReferenceNo}`
              );
            } else {
              router.push(
                `/onboardingAdministration/viewDetails?quoteReference=${row.quoteReferenceNo}`
              );
            }
          }}
        >
          {row.status === "Rejected" ? "View Details" : "View & Onboard"}
        </CustomButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Onboarding Queue
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <SearchInput
            placeholder="Search by company, broker"
            value={search}
            onChange={(val) => setSearch(val)}
            sx={{ width: 300 }}
          />
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Status :
            </Typography>
            <Select
              value={status}
              onChange={(val) => setStatus(val)}
              options={[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
              sx={{ width: 120 }}
            />
          </Stack>
        </Stack>
      </Stack>

      <CustomTable
        columns={columns}
        data={paginatedData}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalData={totalData}
        totalPages={Math.ceil(totalData / itemsPerPage)}
        colSpanCount={7}
      />
    </Box>
  );
}
