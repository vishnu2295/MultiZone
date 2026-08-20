"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomTable, Column } from "../../../components/ui/CustomTable";

export interface Broker {
  id: string;
  fspNumber: string;
  brokerName: string;
  commission: string;
  representatives: number;
  adminName: string;
  adminPhone: string;
  lastComplianceCheck: string; // dd-mm-yyyy
  status: "Active" | "Inactive" | "Suspended";
}

/* Mock Brokers Data ─────*/

const INITIAL_BROKERS: Broker[] = [
  {
    id: "1",
    fspNumber: "FSP-10101",
    brokerName: "Apex Brokerage Partners",
    commission: "12.5%",
    representatives: 20,
    adminName: "John Doe",
    adminPhone: "+27 737-342-3232",
    lastComplianceCheck: "01-04-2026",
    status: "Inactive",
  },
  {
    id: "2",
    fspNumber: "FSP-40404",
    brokerName: "Monarch Brokerage Partners",
    commission: "12.5%",
    representatives: 20,
    adminName: "John Doe",
    adminPhone: "+27 737-342-3232",
    lastComplianceCheck: "01-04-2026",
    status: "Suspended",
  },
  {
    id: "3",
    fspNumber: "FSP-40405",
    brokerName: "Swiss Brokerage Partners",
    commission: "12.5%",
    representatives: 20,
    adminName: "John Doe",
    adminPhone: "+27 737-342-3232",
    lastComplianceCheck: "01-04-2026",
    status: "Active",
  },
  {
    id: "4",
    fspNumber: "FSP-40406",
    brokerName: "Crane Brokerage Partners",
    commission: "12.5%",
    representatives: 20,
    adminName: "John Doe",
    adminPhone: "+27 737-342-3232",
    lastComplianceCheck: "01-04-2026",
    status: "Active",
  },
  {
    id: "5",
    fspNumber: "FSP-40407",
    brokerName: "Johanantha Brokerage Partners",
    commission: "12.5%",
    representatives: 20,
    adminName: "John Doe",
    adminPhone: "+27 737-342-3232",
    lastComplianceCheck: "01-04-2026",
    status: "Active",
  },
  {
    id: "6",
    fspNumber: "FSP-22841",
    brokerName: "Sterling Brokerage Partners",
    commission: "10.0%",
    representatives: 14,
    adminName: "Sarah Khan",
    adminPhone: "+27 824-119-8810",
    lastComplianceCheck: "15-03-2026",
    status: "Active",
  },
  {
    id: "7",
    fspNumber: "FSP-58372",
    brokerName: "Pinnacle Brokerage Partners",
    commission: "15.0%",
    representatives: 32,
    adminName: "David Mokoena",
    adminPhone: "+27 716-552-0043",
    lastComplianceCheck: "28-02-2026",
    status: "Inactive",
  },
  {
    id: "8",
    fspNumber: "FSP-93017",
    brokerName: "Meridian Brokerage Partners",
    commission: "8.5%",
    representatives: 9,
    adminName: "Lerato Dlamini",
    adminPhone: "+27 605-823-7741",
    lastComplianceCheck: "10-01-2026",
    status: "Suspended",
  },
  {
    id: "9",
    fspNumber: "FSP-30156",
    brokerName: "Cardinal Brokerage Partners",
    commission: "12.5%",
    representatives: 25,
    adminName: "Megan Pillay",
    adminPhone: "+27 781-203-9956",
    lastComplianceCheck: "22-05-2026",
    status: "Active",
  },
  {
    id: "10",
    fspNumber: "FSP-77204",
    brokerName: "Beacon Brokerage setIsModalOpenPartners",
    commission: "11.0%",
    representatives: 18,
    adminName: "Thabo Nkosi",
    adminPhone: "+27 833-447-1120",
    lastComplianceCheck: "03-04-2026",
    status: "Active",
  },
];

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Suspended"];
const ITEMS_PER_PAGE = 6;

export default function BrokerManagement() {
  const router = useRouter();
  const [brokers, setBrokers] = useState<Broker[]>(INITIAL_BROKERS);
  //Todo : Add Logic to fetch Brokers from API

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredBrokers = useMemo(() => {
    let result = brokers;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.fspNumber.toLowerCase().includes(q) ||
          u.brokerName.toLowerCase().includes(q) ||
          u.adminName.toLowerCase().includes(q) ||
          u.adminPhone.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== "All")
      result = result.filter((u) => u.status === selectedStatus);
    return result;
  }, [brokers, searchQuery, selectedStatus]);

  const brokerColumns: Column<Broker>[] = useMemo(
    () => [
      { header: "FSP Number", accessorKey: "fspNumber" },
      {
        header: "Broker Name",
        accessorKey: "brokerName",
        cell: (row) => (
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {row.brokerName}
          </Typography>
        ),
      },
      { header: "Commision", accessorKey: "commission" },
      { header: "Representatives", accessorKey: "representatives" },
      {
        header: "Admin Details",
        cell: (row) => (
          <>
            <Typography
              sx={{
                fontSize: 14,
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              {row.adminName}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              {row.adminPhone}
            </Typography>
          </>
        ),
      },
      { header: "Last Compliance Check", accessorKey: "lastComplianceCheck" },
      {
        header: "Status",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Actions",
        width: 240,
        cell: (row) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                router.push(
                  `/brokerDetails/${encodeURIComponent(row.fspNumber)}`
                )
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                fontSize: 13,
              }}
            >
              View
            </Button>
          </Stack>
        ),
      },
    ],
    [router]
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, lg: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            gap: 2,
            justifyContent: "space-between",
            alignItems: { md: "center" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, flexShrink: 0 }}
          >
            Broker Management
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ gap: 1.5, flexWrap: "wrap", alignItems: { sm: "center" } }}
          >
            <Box sx={{ width: { xs: "100%", sm: 280 } }}>
              <SearchInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                }}
                placeholder="Search broker name, FSP no.."
              />
            </Box>

            <Select
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
              }}
              options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
              sx={{ minWidth: 140 }}
            />

            <CustomButton startIcon={<FileDownloadOutlinedIcon />}>
              Import Broker
            </CustomButton>
          </Stack>
        </Stack>

        <CustomTable
          columns={brokerColumns}
          data={filteredBrokers}
          emptyMessage="No brokers found matching the selected filters."
          colSpanCount={8}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Paper>
    </>
  );
}
