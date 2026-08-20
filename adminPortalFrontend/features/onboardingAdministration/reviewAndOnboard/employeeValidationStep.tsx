"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Paper, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import { CustomButton } from "../../../components/ui/CustomButton";
import SearchInput from "../../../components/ui/SearchInput";
import { Select } from "../../../components/ui/Select";

type MockData = {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  method: string;
  incept: string;
  premium: string;
  vopd: string;
  aml: string;
};

const columns: Column<MockData>[] = [
  {
    header: "Name and ID no",
    cell: (row) => (
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
          {row.name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {row.id}
        </Typography>
      </Box>
    ),
  },
  {
    header: "Date of Birth",
    cell: (row) => (
      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.dob}</Typography>
    ),
  },
  { header: "Phone Number", accessorKey: "phone" },
  { header: "Email", accessorKey: "email" },
  { header: "Pref Method", accessorKey: "method" },
  { header: "Inception Date", accessorKey: "incept" },
  { header: "Premium", accessorKey: "premium" },
  {
    header: "VOPD Verification",
    cell: (row) => (
      <Chip
        label={row.vopd}
        size="small"
        sx={{
          bgcolor: "#E6F6ED",
          color: "#00A859",
          fontWeight: 600,
          fontSize: 12,
          borderRadius: 1,
        }}
      />
    ),
  },
  {
    header: "AML Verification",
    cell: (row) => (
      <Chip
        label={row.aml}
        size="small"
        sx={{
          bgcolor: "#E6F6ED",
          color: "#00A859",
          fontWeight: 600,
          fontSize: 12,
          borderRadius: 1,
        }}
      />
    ),
  },
  {
    header: "Actions",
    cell: () => (
      <CustomButton
        variantType="secondary"
        sizeType="sm"
        startIcon={<CloseIcon fontSize="small" />}
        sx={{ color: "error.main" }}
      >
        Reject
      </CustomButton>
    ),
  },
];

const statusOptions = [{ label: "All", value: "All" }];

export default function EmployeeValidationStep({
  employees = [],
  embedded = false,
}: {
  employees?: MockData[];
  embedded?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = React.useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.includes(searchTerm);
      const matchStatus =
        status === "All" || emp.vopd === status || emp.aml === status;
      return matchSearch && matchStatus;
    });
  }, [employees, searchTerm, status]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, status]);

  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Paper
      variant={embedded ? "elevation" : "outlined"}
      elevation={0}
      sx={{
        borderRadius: embedded ? 0 : 2,
        p: embedded ? 0 : 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        boxShadow: "none",
        bgcolor: embedded ? "transparent" : "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.heading" }}>
        Employee Validation
      </Typography>

      {/* Toolbar */}
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="search by employee name or ID number."
          sx={{ width: 350, bgcolor: "white" }}
        />

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Status :
          </Typography>
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
            sx={{
              minWidth: 100,
              bgcolor: "white",
              ".MuiSelect-select": { fontSize: 14, fontWeight: 600, py: 1 },
            }}
          />
        </Stack>
      </Stack>

      <CustomTable
        columns={columns}
        data={paginatedData}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalData={totalData}
      />
    </Paper>
  );
}
