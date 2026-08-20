"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Add,
  Block,
  ChevronLeft,
  ChevronRight,
  Close,
  Edit,
  NorthEast,
  Search,
} from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material";

// ─── Types ──────────────────────────────────────────────────────────────────

type BrokerStatus = "Active" | "Inactive" | "Suspended";

interface BrokerDetail {
  fspNumber: string;
  brokerName: string;
  initials: string;
  status: BrokerStatus;
  lastComplianceCheck: string; // dd-mm-yyyy
  commissionRate: string;
  totalCommissionsEarned: string;
  totalPoliciesSold: number;
  regulatoryRegistry: "Registered" | "Unregistered";
  admin: { name: string; phone: string; email: string };
  address: string;
  bank: {
    accountNumber: string;
    bankCode: string;
    bank: string;
    accountType: string;
  };
}

// ─── Static data ──────────────────────────────────────────────────────────────
// Placeholder for a single brokerage. Every fspNumber currently renders this
// same record; it will be replaced by an API response (see the effect below).

const STATIC_BROKER: BrokerDetail = {
  fspNumber: "10102",
  brokerName: "Apex Brokerage Partners",
  initials: "AB",
  status: "Active",
  lastComplianceCheck: "12-12-2025",
  commissionRate: "12.5%",
  totalCommissionsEarned: "R 1200000.00",
  totalPoliciesSold: 20,
  regulatoryRegistry: "Registered",
  admin: {
    name: "Geraldine Vance",
    phone: "+27 834-434-4344",
    email: "Geraldine.Vance@email.com",
  },
  address: "100 St Andrews Rd, Parktown, Johannesburg, 2093, South Africa",
  bank: {
    accountNumber: "3474387473847374",
    bankCode: "FNB73643434",
    bank: "FNB",
    accountType: "Savings",
  },
};

const TABS = [
  "About the Broker",
  "Representatives",
  "Commissions",
  "Policies Sold",
  "Compliance Check Stats",
] as const;

type TabKey = (typeof TABS)[number];

// Reusable green "positive" chip styling (Active / Registered).
const POSITIVE_CHIP_SX = {
  fontWeight: 700,
  fontSize: 12,
  bgcolor: "rgba(34,197,94,0.1)",
  color: "rgb(22,163,74)",
};

// ─── Small presentational helpers ───────────────────────────────────────────

/** A labelled value used inside the detail sections. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.primary", fontWeight: 500 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/** A bordered "label : value" pill shown in the broker summary header. */
function StatPill({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label} :
      </Typography>
      {children}
    </Box>
  );
}

/** A titled detail section (heading + content). */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

// ─── Representatives tab ──────────────────────────────────────────────────────

type RepStatus = "Active" | "Inactive" | "Blacklisted";

interface Representative {
  id: string;
  fullName: string;
  idPassportNo: string;
  phone: string;
  email: string;
  onboardedOn: string; // dd-mm-yyyy
  status: RepStatus;
}

const REP_STATUS_OPTIONS = ["All", "Active", "Inactive", "Blacklisted"];

// Static stand-in for the representatives API response.
const STATIC_REPRESENTATIVES: Representative[] = [
  {
    id: "1",
    fullName: "Darlene Robertson",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "darlene@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "2",
    fullName: "Jacob Jones",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jacob@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "3",
    fullName: "Cameron Williamson",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Cameron@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Blacklisted",
  },
  {
    id: "4",
    fullName: "Eleanor Pena",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Eleanor@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Active",
  },
  {
    id: "5",
    fullName: "Ralph Edwards",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Ralph@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Active",
  },
  {
    id: "6",
    fullName: "Wade Warren",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Wade@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Active",
  },
  {
    id: "7",
    fullName: "John Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "John@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Active",
  },
  {
    id: "8",
    fullName: "Jane Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jane@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "9",
    fullName: "Jane Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jane@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "10",
    fullName: "Jane Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jane@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "11",
    fullName: "Jane Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jane@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
  {
    id: "12",
    fullName: "Jane Doe",
    idPassportNo: "3842379847298374",
    phone: "+27 838-323-3232",
    email: "Jane@rma.co.za",
    onboardedOn: "12-06-2025",
    status: "Inactive",
  },
];

// removed repStatusChipSx

const REP_ACTION_BTN_SX = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 1.5,
  fontSize: 13,
  whiteSpace: "nowrap",
} as const;

// ─── Representative modals ────────────────────────────────────────────────────

// Every Add-form field is required; renders the label with a red asterisk.
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="span"
      variant="body2"
      sx={{ display: "block", fontWeight: 600, mb: 0.75 }}
    >
      {children}
      <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
        *
      </Box>
    </Typography>
  );
}

const DIAL_CODES = [
  { code: "+27", flag: "🇿🇦" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
];

const EMPTY_REP_FORM = {
  saId: "",
  firstName: "",
  lastName: "",
  dialCode: "+27",
  phone: "",
  email: "",
};

/** Add New Representative form (matches the provided design). */
function AddRepresentativeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(EMPTY_REP_FORM);

  const close = () => {
    setForm(EMPTY_REP_FORM);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call the create-representative API once it is available.
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        Add New Representative
        <IconButton size="small" onClick={close}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <Box>
            <RequiredLabel>SA ID / Passport Number</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter South African Id / Passport number"
              value={form.saId}
              onChange={(e) => setForm({ ...form, saId: e.target.value })}
            />
          </Box>

          <Box>
            <RequiredLabel>First Name</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Box>

          <Box>
            <RequiredLabel>Last Name</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Box>

          <Box>
            <RequiredLabel>Phone Number</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="000-000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        variant="standard"
                        disableUnderline
                        value={form.dialCode}
                        onChange={(e) =>
                          setForm({ ...form, dialCode: e.target.value })
                        }
                        sx={{
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            pr: 3,
                            py: 0,
                          },
                        }}
                      >
                        {DIAL_CODES.map((d) => (
                          <MenuItem key={d.code} value={d.code}>
                            <Box component="span" sx={{ mr: 0.5 }}>
                              {d.flag}
                            </Box>
                            {d.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <RequiredLabel>Email ID</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="Enter email ID"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Box>

          <Stack
            direction="row"
            sx={{ justifyContent: "flex-end", gap: 1.5, mt: 1 }}
          >
            <Button
              variant="text"
              onClick={close}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              Save Details
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Activate / Deactivate confirmation. The mode is derived from the row's status:
 * an Inactive representative is being activated, otherwise deactivated.
 */
function ConfirmRepStatusModal({
  rep,
  onClose,
  onConfirm,
}: {
  rep: Representative | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const activating = rep?.status === "Inactive";
  const title = activating
    ? "Activate Representative"
    : "Deactivate Representative";
  const action = activating ? "activate" : "deactivate";
  const explanation = activating
    ? "Upon doing this action, the user will be able to login again into the system and perform any actions further."
    : "Upon doing this action, the user will not be able to login into the system and perform any actions further.";

  return (
    <Dialog
      open={rep !== null}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        {title}
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack sx={{ gap: 2, pt: 0.5 }}>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {`Are you sure you want to ${action} "${rep?.fullName ?? ""}" from the system?`}
          </Typography>

          <Box
            sx={{
              bgcolor: "grey.50",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {explanation}
            </Typography>
          </Box>

          <Stack
            direction="row"
            sx={{ justifyContent: "flex-end", gap: 1.5, mt: 1 }}
          >
            <Button
              variant="text"
              onClick={onClose}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              {title}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Representatives linked to the broker. This component is only mounted while its
 * tab is selected, so the "API" call below runs on tab open — never on initial
 * page load — and re-runs whenever the user returns to the tab.
 */
function RepresentativesTab({ fspNumber }: { fspNumber: string }) {
  const [reps, setReps] = useState<Representative[] | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmRep, setConfirmRep] = useState<Representative | null>(null);

  useEffect(() => {
    // TODO: swap for the real request, e.g. getRepresentatives(fspNumber).
    // The setTimeout simulates network latency so the loading state is visible.
    let cancelled = false;

    setReps(null);
    const timer = setTimeout(() => {
      if (!cancelled) setReps(STATIC_REPRESENTATIVES);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fspNumber]);

  const loading = reps === null;

  const filteredReps = useMemo(() => {
    if (!reps) return [];
    let result = reps;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.idPassportNo.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All")
      result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [reps, search, statusFilter]);

  const handleAdd = () => setAddOpen(true);
  const handleToggleStatus = (rep: Representative) => setConfirmRep(rep);

  const handleConfirmToggle = () => {
    // TODO: call the activate / deactivate API for `confirmRep` once available.
    setConfirmRep(null);
  };

  // Edit modal is not built yet (design pending).
  const handleEdit = (_rep: Representative) => {
    // TODO: open the "Edit Representative" modal.
  };

  const columns: Column<Representative>[] = [
    {
      header: "Full Name",
      cell: (r) => r.fullName,
      cellSx: { fontWeight: 700, fontSize: 14, whiteSpace: "normal" },
    },
    {
      header: "ID/Passport No",
      cell: (r) => r.idPassportNo,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Phone Number",
      cell: (r) => r.phone,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Email",
      cell: (r) => r.email,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Onboarded On",
      cell: (r) => r.onboardedOn,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Status",
      cell: (r) => <StatusChip status={r.status} />,
    },
    {
      header: "Actions",
      cell: (r) => (
        <Stack direction="row" spacing={1} sx={{ whiteSpace: "nowrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit />}
            disabled={r.status === "Inactive"}
            onClick={() => handleEdit(r)}
            sx={REP_ACTION_BTN_SX}
          >
            Edit
          </Button>
          {r.status === "Inactive" ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<NorthEast />}
              onClick={() => handleToggleStatus(r)}
              sx={REP_ACTION_BTN_SX}
            >
              Activate User
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Block />}
              onClick={() => handleToggleStatus(r)}
              sx={REP_ACTION_BTN_SX}
            >
              Deactivate User
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Stack sx={{ gap: 2.5 }}>
      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <TextField
          size="small"
          placeholder="Search name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ width: { xs: "100%", sm: 320 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ gap: 1.5, flexWrap: "wrap", alignItems: { sm: "center" } }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {REP_STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              whiteSpace: "nowrap",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Add New Representative
          </Button>
        </Stack>
      </Stack>

      <DataTable
        columns={columns}
        rows={filteredReps}
        getRowKey={(r) => r.id}
        emptyMessage="No representatives found."
        loading={loading}
        page={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <AddRepresentativeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
      <ConfirmRepStatusModal
        rep={confirmRep}
        onClose={() => setConfirmRep(null)}
        onConfirm={handleConfirmToggle}
      />
    </Stack>
  );
}

// ─── Shared tab helpers ───────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const HEAD_CELL_SX = {
  fontWeight: 700,
  fontSize: 12,
  textTransform: "uppercase",
  color: "text.secondary",
} as const;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// dd-mm-yyyy → "mm-yyyy"
const monthKey = (date: string) => {
  const [, mm = "", yyyy = ""] = date.split("-");
  return `${mm}-${yyyy}`;
};
const monthLabel = (key: string) => {
  const [mm, yyyy] = key.split("-");
  return `${MONTH_NAMES[Number(mm) - 1] ?? mm} ${yyyy}`;
};
function buildMonthOptions<T>(rows: T[], getDate: (row: T) => string) {
  const seen = new Set<string>();
  const opts: { key: string; label: string }[] = [];
  for (const r of rows) {
    const key = monthKey(getDate(r));
    if (!seen.has(key)) {
      seen.add(key);
      opts.push({ key, label: monthLabel(key) });
    }
  }
  return opts;
}

/** "Month : All" dropdown shown on the Commissions / Compliance tabs. */
function MonthFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(v) =>
          `Month : ${v === "All" ? "All" : (options.find((o) => o.key === v)?.label ?? v)}`
        }
      >
        <MenuItem value="All">All</MenuItem>
        {options.map((o) => (
          <MenuItem key={o.key} value={o.key}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

/**
 * Lazy per-tab data loader. A tab component is only mounted while its tab is
 * active, so this runs on tab open (never on initial page load) and re-runs
 * whenever the user returns to the tab.
 */
function useLazyTabData<T>(fspNumber: string, staticRows: T[]) {
  const [rows, setRows] = useState<T[] | null>(null);
  useEffect(() => {
    // TODO: replace the timeout with the real API call (keyed by fspNumber).
    let cancelled = false;

    setRows(null);
    const timer = setTimeout(() => {
      if (!cancelled) setRows(staticRows);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fspNumber, staticRows]);
  return { rows, loading: rows === null };
}

/** Shared "Showing X to Y of N" text + page controls. */
function TablePaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
        gap: 2,
        alignItems: { sm: "center" },
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Showing {totalItems > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(page * pageSize, totalItems)} of {totalItems} results
      </Typography>

      {totalPages > 1 && (
        <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
          <IconButton
            size="small"
            disabled={page === 1}
            onClick={() => onPage(Math.max(1, page - 1))}
            sx={{ border: 1, borderColor: "divider", borderRadius: 1.5 }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "contained" : "outlined"}
              size="small"
              onClick={() => onPage(p)}
              sx={{
                minWidth: 36,
                height: 36,
                p: 0,
                fontWeight: p === page ? 800 : 600,
                borderRadius: 1.5,
                fontSize: 13,
              }}
            >
              {p}
            </Button>
          ))}
          <IconButton
            size="small"
            disabled={page === totalPages}
            onClick={() => onPage(Math.min(totalPages, page + 1))}
            sx={{ border: 1, borderColor: "divider", borderRadius: 1.5 }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

/** Centered loading spinner used by the lazy tabs. */
function TabLoading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress />
    </Box>
  );
}

// ─── Reusable data table ──────────────────────────────────────────────────────

/** A single column definition for {@link DataTable}. */
interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  cellSx?: SxProps<Theme>;
}

/**
 * Generic, prop-driven table shared by every tab. Callers pass `columns`
 * (header + per-row cell renderer) and the already-paginated `rows`; all the
 * boilerplate (container, header row, hover rows, empty state) lives here once.
 * Kept local to this file for now; can later move to components/ for reuse.
 */
function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  loading = false,
  page,
  onPageChange,
  pageSize = PAGE_SIZE,
}: {
  columns: Column<T>[];
  rows: T[]; // the full (filtered) list — DataTable paginates internally
  getRowKey: (row: T) => React.Key;
  emptyMessage: string;
  loading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}) {
  if (loading) return <TabLoading />;

  const totalItems = rows.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(page, totalPages);
  const paged = rows.slice((activePage - 1) * pageSize, activePage * pageSize);

  return (
    <Stack sx={{ gap: 2.5 }}>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, boxShadow: "none" }}
      >
        <Table sx={{ width: "100%", tableLayout: "auto" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {columns.map((col) => (
                <TableCell key={col.header} sx={HEAD_CELL_SX}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.length > 0 ? (
              paged.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.header} sx={col.cellSx}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePaginationBar
        page={activePage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPage={onPageChange}
      />
    </Stack>
  );
}

// ─── About the Broker tab ─────────────────────────────────────────────────────

function AboutTab({ broker }: { broker: BrokerDetail }) {
  return (
    <Stack divider={<Divider />} sx={{ gap: 3 }}>
      <Section title="Admin Details">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          <Field label="Name" value={broker.admin.name} />
          <Field label="Phone Number" value={broker.admin.phone} />
          <Field label="Email ID" value={broker.admin.email} />
        </Box>
      </Section>

      <Section title="Address">
        <Field label="Address" value={broker.address} />
      </Section>

      <Section title="Bank Account Details">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          <Field label="Account Number" value={broker.bank.accountNumber} />
          <Field label="Bank Code" value={broker.bank.bankCode} />
          <Field label="Bank" value={broker.bank.bank} />
          <Field label="Account Type" value={broker.bank.accountType} />
        </Box>
      </Section>
    </Stack>
  );
}

// ─── Commissions tab ──────────────────────────────────────────────────────────

interface CommissionRow {
  id: string;
  month: string; // dd-mm-yyyy
  contribution: string;
  commission: string;
  payment: "Paid" | "Pending" | "Unpaid";
}

const STATIC_COMMISSIONS: CommissionRow[] = [
  {
    id: "1",
    month: "01-04-2026",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "2",
    month: "01-03-2026",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "3",
    month: "01-02-2026",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "4",
    month: "01-01-2026",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "5",
    month: "01-12-2025",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "6",
    month: "01-11-2025",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "7",
    month: "01-10-2025",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
  {
    id: "8",
    month: "01-09-2025",
    contribution: "R 100,000.00",
    commission: "R 12,500.00",
    payment: "Paid",
  },
];

const paymentChipSx = (payment: CommissionRow["payment"]) =>
  payment === "Paid"
    ? POSITIVE_CHIP_SX
    : payment === "Unpaid"
      ? {
          fontWeight: 700,
          fontSize: 12,
          bgcolor: "rgba(239,68,68,0.1)",
          color: "rgb(220,38,38)",
        }
      : {
          fontWeight: 700,
          fontSize: 12,
          bgcolor: "rgba(148,163,184,0.1)",
          color: "rgb(100,116,139)",
        };

function CommissionsTab({ fspNumber }: { fspNumber: string }) {
  const { rows, loading } = useLazyTabData(fspNumber, STATIC_COMMISSIONS);
  const [monthFilter, setMonthFilter] = useState("All");
  const [page, setPage] = useState(1);

  const monthOptions = useMemo(
    () => buildMonthOptions(rows ?? [], (r) => r.month),
    [rows]
  );
  const filtered = useMemo(
    () =>
      (rows ?? []).filter(
        (r) => monthFilter === "All" || monthKey(r.month) === monthFilter
      ),
    [rows, monthFilter]
  );

  const columns: Column<CommissionRow>[] = [
    {
      header: "Month",
      cell: (r) => r.month,
      cellSx: { fontWeight: 700, fontSize: 14 },
    },
    {
      header: "Contribution",
      cell: (r) => r.contribution,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Commission",
      cell: (r) => r.commission,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Payment",
      cell: (r) => (
        <Chip label={r.payment} size="small" sx={paymentChipSx(r.payment)} />
      ),
    },
  ];

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <MonthFilter
          value={monthFilter}
          options={monthOptions}
          onChange={(v) => {
            setMonthFilter(v);
            setPage(1);
          }}
        />
      </Stack>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        emptyMessage="No commissions found."
        loading={loading}
        page={page}
        onPageChange={setPage}
      />
    </Stack>
  );
}

// ─── Policies Sold tab ────────────────────────────────────────────────────────

interface PolicyRow {
  id: string;
  policyName: string;
  employer: string;
  representative: string;
  onboardedOn: string;
  premium: string;
  commission: string;
}

const STATIC_POLICIES: PolicyRow[] = [
  {
    id: "1",
    policyName: "Group Life Cover",
    employer: "Apex Technologies",
    representative: "Jane Dowe",
    onboardedOn: "13-03-2026",
    premium: "R 100,000.00",
    commission: "R 12500.00",
  },
  {
    id: "2",
    policyName: "Group Life Cover",
    employer: "InnovX Technologies",
    representative: "Jane Dowe",
    onboardedOn: "13-03-2026",
    premium: "R 100,000.00",
    commission: "R 12500.00",
  },
  {
    id: "3",
    policyName: "Group Life Cover",
    employer: "TSH Technologies",
    representative: "Jane Dowe",
    onboardedOn: "13-03-2026",
    premium: "R 100,000.00",
    commission: "R 12500.00",
  },
  {
    id: "4",
    policyName: "Group Life Cover",
    employer: "Software Technologies",
    representative: "Jane Dowe",
    onboardedOn: "13-03-2026",
    premium: "R 100,000.00",
    commission: "R 12500.00",
  },
];

function PoliciesSoldTab({ fspNumber }: { fspNumber: string }) {
  const { rows, loading } = useLazyTabData(fspNumber, STATIC_POLICIES);
  const [page, setPage] = useState(1);

  const columns: Column<PolicyRow>[] = [
    {
      header: "Name of the Policy",
      cell: (r) => r.policyName,
      cellSx: { fontWeight: 700, fontSize: 14 },
    },
    {
      header: "Employer",
      cell: (r) => r.employer,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Representative",
      cell: (r) => r.representative,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Onboarded On",
      cell: (r) => r.onboardedOn,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
    {
      header: "Premium",
      cell: (r) => r.premium,
      cellSx: { fontWeight: 700, fontSize: 14 },
    },
    {
      header: "Commission",
      cell: (r) => r.commission,
      cellSx: { fontSize: 14, color: "text.secondary" },
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows ?? []}
      getRowKey={(r) => r.id}
      emptyMessage="No policies found."
      loading={loading}
      page={page}
      onPageChange={setPage}
    />
  );
}

// ─── Compliance Check Stats tab ───────────────────────────────────────────────

interface ComplianceRow {
  id: string;
  date: string;
  feedback: string;
  status: "Verified" | "Pending" | "Failed";
}

const STATIC_COMPLIANCE: ComplianceRow[] = [
  {
    id: "1",
    date: "01-04-2026",
    feedback:
      "Verification completed. Deactivated 0 brokers and 0 representatives.",
    status: "Verified",
  },
  {
    id: "2",
    date: "01-03-2026",
    feedback:
      "Verification completed. Deactivated 0 brokers and 0 representatives.",
    status: "Verified",
  },
];

// removed complianceChipSx

function ComplianceCheckStatsTab({ fspNumber }: { fspNumber: string }) {
  const { rows, loading } = useLazyTabData(fspNumber, STATIC_COMPLIANCE);
  const [monthFilter, setMonthFilter] = useState("All");
  const [page, setPage] = useState(1);

  const monthOptions = useMemo(
    () => buildMonthOptions(rows ?? [], (r) => r.date),
    [rows]
  );
  const filtered = useMemo(
    () =>
      (rows ?? []).filter(
        (r) => monthFilter === "All" || monthKey(r.date) === monthFilter
      ),
    [rows, monthFilter]
  );

  const columns: Column<ComplianceRow>[] = [
    {
      header: "Date",
      cell: (r) => r.date,
      cellSx: { fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" },
    },
    {
      header: "Feedback",
      cell: (r) => r.feedback,
      cellSx: { fontSize: 14, color: "text.secondary", whiteSpace: "normal" },
    },
    {
      header: "Status",
      cell: (r) => <StatusChip status={r.status} />,
    },
  ];

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <MonthFilter
          value={monthFilter}
          options={monthOptions}
          onChange={(v) => {
            setMonthFilter(v);
            setPage(1);
          }}
        />
      </Stack>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        emptyMessage="No compliance checks found."
        loading={loading}
        page={page}
        onPageChange={setPage}
      />
    </Stack>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrokerDetails() {
  const router = useRouter();
  const { fspNumber } = useParams<{ fspNumber: string }>();

  const [broker, setBroker] = useState<BrokerDetail>(STATIC_BROKER);
  const [activeTab, setActiveTab] = useState<TabKey>("About the Broker");

  // TODO: Replace with a real API call once the endpoint is ready. For now any
  // fspNumber resolves to the same static brokerage; this effect is where the
  // fetch-by-fspNumber will live, e.g. `getBrokerDetails(fspNumber).then(setBroker)`.
  useEffect(() => {
    if (!fspNumber) return;
    // setBroker(STATIC_BROKER);
  }, [fspNumber]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, lg: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          {/* Back button (lives in the feature component, not the top nav bar) */}
          <Box>
            <Button
              onClick={() => router.back()}
              startIcon={<ChevronLeft />}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.primary",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              Back
            </Button>
          </Box>

          {/* Page title */}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Broker Details
          </Typography>

          {/* ── Summary header card ── */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: { xs: 2.5, lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                gap: 2,
                justifyContent: "space-between",
                alignItems: { sm: "center" },
              }}
            >
              <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "rgba(0,192,232,0.12)",
                    color: "primary.main",
                    fontWeight: 700,
                    width: 48,
                    height: 48,
                  }}
                >
                  {broker.initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {broker.brokerName}
                  </Typography>
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{
                      gap: 1.5,
                      flexWrap: "wrap",
                      alignItems: "center",
                      mt: 0.25,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      FSP : {broker.fspNumber}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Last compliance checked on : {broker.lastComplianceCheck}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <StatusChip status={broker.status} />
            </Stack>

            {/* Summary stat pills */}
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap" }}>
              <StatPill label="Commission Rate">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {broker.commissionRate}
                </Typography>
              </StatPill>
              <StatPill label="Total Commissions Earned">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {broker.totalCommissionsEarned}
                </Typography>
              </StatPill>
              <StatPill label="Total Policies Sold">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {broker.totalPoliciesSold}
                </Typography>
              </StatPill>
              <StatPill label="Regulatory Registry">
                <Chip
                  label={broker.regulatoryRegistry}
                  size="small"
                  sx={POSITIVE_CHIP_SX}
                />
              </StatPill>
            </Stack>
          </Paper>

          {/* ── Tabs + tab content card ── */}
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: { xs: 1.5, lg: 2 },
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {TABS.map((t) => (
                  <Tab
                    key={t}
                    value={t}
                    label={t}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2.5, lg: 3 } }}>
              {activeTab === "About the Broker" && <AboutTab broker={broker} />}
              {activeTab === "Representatives" && (
                <RepresentativesTab fspNumber={fspNumber} />
              )}
              {activeTab === "Commissions" && (
                <CommissionsTab fspNumber={fspNumber} />
              )}
              {activeTab === "Policies Sold" && (
                <PoliciesSoldTab fspNumber={fspNumber} />
              )}
              {activeTab === "Compliance Check Stats" && (
                <ComplianceCheckStatsTab fspNumber={fspNumber} />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
