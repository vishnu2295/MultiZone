"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CustomButton from "@/components/ui/button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Plus, Eye, ChevronDown, ChevronUp } from "lucide-react";

import { getLeads, Lead } from "@/lib/api/leads";
import { ROUTES } from "@/lib/constants";
import { LeadStatus, QuoteStatus } from "@/lib/enums";
import Badge from "@/components/ui/badge";
import ActivitySlider from "@/components/lead/ActivitySlider";
import StickyScrollbar from "@/components/ui/StickyScrollbar";
import MetricCard from "@/components/ui/MetricCard";
import FilterToolbar from "@/components/ui/FilterToolbar";
import MuiTable from "@mui/material/Table";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { useDebounce } from "@/hooks/useDebounce";
import PaginationBar from "@/components/ui/PaginationBar";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

const SORT_KEY_MAP: Record<string, string> = {
  "Lead ID": "lead_reference",
  "Company Name": "employer.employer_name",
  "Contact Person": "contact.contact_first_name",
  "Employees": "employer.number_of_employees",
  "Status": "lead_status",
  "Created Date": "createdAt",
};

const SORTABLE_COLUMNS = new Set(["Lead ID", "Employees", "Created Date"]);

const TABLE_COLUMNS = [
  "Lead ID",
  "Company Name",
  "Contact Person",
  "Employees",
  "Status",
  "Quote",
  "Quote Status",
  "Created Date",
  "Actions",
];

const fmt = (d: string) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface LeadMetrics {
  total: number;
  active: number;
  accepted: number;
  cancelled: number;
}

// ---------------------------------------------------------------------------
// Custom hooks
// ---------------------------------------------------------------------------

function useLeads(
  debouncedSearch: string,
  statusFilter: string,
  quoteFilter: string,
  page: number,
  sortConfig: SortConfig | null,
) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [metrics, setMetrics] = useState<LeadMetrics>({ total: 0, active: 0, accepted: 0, cancelled: 0 });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const filters: Record<string, unknown> = { page, limit: PAGE_SIZE };

        if (debouncedSearch) {
          if (debouncedSearch.toLowerCase().startsWith("lr-")) {
            filters.lead_reference = debouncedSearch;
          } else {
            filters.clientName = debouncedSearch;
          }
        }

        if (statusFilter !== "All") filters.lead_status = statusFilter;
        if (quoteFilter !== "All") filters.quoteStatus = quoteFilter;

        if (sortConfig) {
          filters.sortBy = SORT_KEY_MAP[sortConfig.key] ?? "createdAt";
          filters.sortOrder = sortConfig.direction.toUpperCase();
        }

        const data = await getLeads(filters);
        if (cancelled) return;

        setLeads(data ?? []);
        setTotalLeads((data as any)?.pagination?.total ?? (data ?? []).length);
        if ((data as any)?.metrics) setMetrics((data as any).metrics);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
        if (!cancelled) setLeads([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedSearch, statusFilter, quoteFilter, page, sortConfig]);

  return { leads, loading, totalLeads, metrics };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SortIcon({ direction }: { direction: "asc" | "desc" }) {
  return direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
}

interface ColumnHeaderProps {
  label: string;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
}

function ColumnHeader({ label, sortConfig, onSort }: ColumnHeaderProps) {
  const isSortable = SORTABLE_COLUMNS.has(label);
  const isSorted = sortConfig?.key === label;

  return (
    <MuiTableCell
      variant="head"
      onClick={() => isSortable && onSort(label)}
      sx={{
        color: isSorted ? "var(--text-primary)" : "var(--text-secondary)",
        padding: label === "Actions" ? "10px 16px 10px 8px" : "10px 8px",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
        borderBottom: "0.625px solid var(--border)",
        whiteSpace: "nowrap",
        bgcolor: "var(--card-secondary)",
        cursor: isSortable ? "pointer" : "default",
        userSelect: "none",
        "&:hover": isSortable ? { color: "var(--text-primary)" } : {},
        ...(label === "Actions" && { width: "190px", minWidth: "190px" }),
        ...(label === "Status" && { minWidth: "180px" }),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {label}
        {isSortable && isSorted && <SortIcon direction={sortConfig!.direction} />}
      </Box>
    </MuiTableCell>
  );
}

function resolveLeadAction(lead: Lead): string {
  const { status, quotes, leadId, leadReference, employerName, lastSavedStep } = lead;

  const draftQuote = quotes?.find((q) => q.quoteStatus === "Draft");
  const fullQuoteGenerated = quotes?.find(
    (q) =>
      (q.quoteType === "Full Quote" || q.quoteType === "Full") &&
      (q.quoteStatus === "Generated" || q.quoteStatus === "Accepted" || q.quoteStatus === "Revised"),
  );
  const quickQuoteGenerated = quotes?.find(
    (q) => (q.quoteType === "Quick Quote" || q.quoteType === "Quick") && q.quoteStatus === "Generated",
  );

  const company = encodeURIComponent(employerName);

  if (status === "Awaiting Employer Acceptance") {
    const activeQuote =
      quotes?.find((q) => q.quoteStatus === "Awaiting Employer Acceptance") ?? quotes?.[0];
    if (activeQuote?.quoteId) {
      return `/quotes/${activeQuote.quoteId}/checkout?companyName=${company}&ref=${leadReference}&showApproveModal=true`;
    }
  }

  if (draftQuote) {
    const typeParam = draftQuote.quoteType?.toLowerCase().includes("full") ? "full" : "quick";
    return `/lead/${leadId}/quote?type=${typeParam}&ref=${leadReference}&company=${company}&step=${lastSavedStep ?? 0}&mode=draft&leadEmployeeCount=${lead.numberOfEmployees}`;
  }

  if (fullQuoteGenerated) {
    return `/quotes/${fullQuoteGenerated.quoteId}/preview`;
  }

  if (quickQuoteGenerated) {
    return `/lead/${leadId}/quote?type=full&ref=${leadReference}&company=${company}&mode=new&leadEmployeeCount=${lead.numberOfEmployees}`;
  }

  if (
    lastSavedStep !== undefined &&
    lastSavedStep !== null &&
    lastSavedStep < 2 &&
    (!quotes || quotes.length === 0)
  ) {
    return `/lead/new?leadId=${leadId}&step=${lastSavedStep}`;
  }

  return `/quotes/new?leadId=${leadId}&ref=${leadReference}&company=${company}&mode=new&from=leads&leadEmployeeCount=${lead.numberOfEmployees}`;
}

interface LeadRowProps {
  lead: Lead;
  onNavigate: (path: string) => void;
}

function LeadRow({ lead, onNavigate }: LeadRowProps) {
  const isTerminal = lead.status === "Cancelled" || lead.status === "Completed";
  const isAccepted = lead.status === "Accepted";
  const primaryQuote = lead.quotes?.[0];

  const cellSx = {
    padding: "16px 8px",
    fontSize: "14px",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    borderBottom: "0.625px solid var(--border)",
  } as const;

  return (
    <MuiTableRow
      sx={{
        borderBottom: "0.625px solid var(--border)",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "var(--table-header-bg)" },
        "&:last-child td": { borderBottom: 0 },
      }}
    >
      {/* Lead ID */}
      <MuiTableCell sx={{ ...cellSx, fontFamily: "'Menlo', monospace" }}>
        {lead.leadReference}
      </MuiTableCell>

      {/* Company Name */}
      <MuiTableCell sx={cellSx}>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", m: 0 }}>
          {lead.employerName}
        </Typography>
        {lead.registrationNumber && (
          <Typography sx={{ fontSize: "12px", color: "var(--text-secondary)", mt: "2px", m: 0 }}>
            {lead.registrationNumber}
          </Typography>
        )}
      </MuiTableCell>

      {/* Contact Person */}
      <MuiTableCell sx={cellSx}>
        {lead.contactFirstName || lead.contactLastName ? (
          <>
            <Typography sx={{ fontSize: "14px", color: "var(--text-primary)", m: 0 }}>
              {`${lead.contactFirstName || ""} ${lead.contactLastName || ""}`.trim()}
            </Typography>
            {lead.contactEmail && (
              <Typography sx={{ fontSize: "12px", color: "var(--text-secondary)", mt: "2px", m: 0 }}>
                {lead.contactEmail}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ color: "var(--text-secondary)", fontSize: "14px" }}>—</Typography>
        )}
      </MuiTableCell>

      {/* Employees */}
      <MuiTableCell sx={{ ...cellSx, textAlign: "center" }}>
        {lead.numberOfEmployees.toLocaleString()}
      </MuiTableCell>

      {/* Status */}
      <MuiTableCell sx={{ ...cellSx, padding: "16px 8px" }}>
        <Badge label={lead.status} type="status" />
      </MuiTableCell>

      {/* Quote type */}
      <MuiTableCell sx={cellSx}>
        {primaryQuote ? (
          <Badge
            label={primaryQuote.quoteType?.toLowerCase() === "full" ? "Full Quote" : "Quick Quote"}
            type="quote"
          />
        ) : (
          <Typography sx={{ color: "var(--text-secondary)", fontSize: "14px" }}>—</Typography>
        )}
      </MuiTableCell>

      {/* Quote Status */}
      <MuiTableCell sx={cellSx}>
        {primaryQuote ? (
          <Badge label={primaryQuote.quoteStatus} type="quote" />
        ) : (
          <Typography sx={{ color: "var(--text-secondary)", fontSize: "14px" }}>—</Typography>
        )}
      </MuiTableCell>

      {/* Created Date */}
      <MuiTableCell sx={cellSx}>{fmt(lead.createdAt)}</MuiTableCell>

      {/* Actions */}
      <MuiTableCell
        sx={{
          ...cellSx,
          padding: "16px 16px 16px 8px",
          width: "190px",
          minWidth: "190px",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Button
            onClick={() => onNavigate(`/lead/${lead.leadId}`)}
            variant="outlined"
            startIcon={<Eye size={14} />}
            sx={{
              padding: "4px 10px",
              height: "32px",
              bgcolor: "var(--table-header-bg)",
              borderColor: "var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              "&:hover": { bgcolor: "var(--border)", borderColor: "var(--border)" },
            }}
          >
            View
          </Button>

          {!isTerminal && (
            <Button
              disabled={isAccepted}
              onClick={() => onNavigate(resolveLeadAction(lead))}
              variant="contained"
              sx={{
                padding: "4px 10px",
                height: "32px",
                bgcolor: isAccepted ? "var(--border)" : "#1FC3EB",
                color: isAccepted ? "var(--text-muted)" : "#0A0A0A",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": { bgcolor: isAccepted ? "var(--border)" : "#0DB5D8" },
                "&.Mui-disabled": {
                  bgcolor: "var(--border)",
                  color: "var(--text-secondary)",
                },
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </MuiTableCell>
    </MuiTableRow>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ViewLeadsPage() {
  const router = useRouter();
  const tableRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [quoteFilter, setQuote] = useState("All");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "Created Date",
    direction: "desc",
  });
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  const debouncedSearch = useDebounce(search);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, quoteFilter, sortConfig]);

  const { leads, loading, totalLeads, metrics } = useLeads(
    debouncedSearch,
    statusFilter,
    quoteFilter,
    page,
    sortConfig,
  );

  const totalPages = Math.max(1, Math.ceil(totalLeads / PAGE_SIZE));

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const statusOptions = ["All", ...Object.values(LeadStatus)];
  const quoteOptions = ["All", ...Object.values(QuoteStatus)];

  const leadMetrics = [
    { label: "Total Leads", value: metrics.total },
    { label: "Active", value: metrics.active },
    { label: "Accepted", value: metrics.accepted },
    { label: "Cancelled", value: metrics.cancelled },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--background)" }}>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Leads
          </h1>
          <Stack direction="row" spacing={2}>
            <CustomButton
              variant="audit"
              sx={{ height: "40px", px: "16px" }}
              onClick={() => setIsAuditLogOpen(true)}
            >
              View Audit Log
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={() => router.push(ROUTES.newLead)}
              startIcon={<Plus size={20} />}
              sx={{ height: "40px", px: "16px" }}
            >
              Add New Lead
            </CustomButton>
          </Stack>
        </div>

        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ marginBottom: "26px" }}>
          {leadMetrics.map(({ label, value }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
              <MetricCard value={value.toString()} label={label} />
            </Grid>
          ))}
        </Grid>

        {/* Search & Filters */}
        <FilterToolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search by company name or lead ID..."
          filters={[
            { value: statusFilter, onChange: setStatus, options: statusOptions, placeholder: "All Statuses" },
            { value: quoteFilter, onChange: setQuote, options: quoteOptions, placeholder: "All Quote Statuses" },
          ]}
        />

        {/* Table */}
        <Box
          ref={tableRef}
          sx={{
            boxSizing: "border-box",
            background: "var(--card-secondary)",
            border: "0.625px solid var(--border)",
            borderRadius: "10px",
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading ? (
            <Typography sx={{ padding: "48px", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading leads…
            </Typography>
          ) : leads.length === 0 ? (
            <Box sx={{ padding: "48px", textAlign: "center" }}>
              <Typography sx={{ color: "var(--text-secondary)", marginBottom: "16px" }}>No leads found.</Typography>
              <CustomButton
                onClick={() => router.push(ROUTES.newLead)}
                variant="primary"
                sx={{ padding: "8px 20px" }}
              >
                Create First Lead
              </CustomButton>
            </Box>
          ) : (
            <MuiTable sx={{ minWidth: 1200 }}>
              <MuiTableHead>
                <MuiTableRow>
                  {TABLE_COLUMNS.map((col) => (
                    <ColumnHeader key={col} label={col} sortConfig={sortConfig} onSort={handleSort} />
                  ))}
                </MuiTableRow>
              </MuiTableHead>
              <MuiTableBody>
                {leads.map((lead) => (
                  <LeadRow key={lead.leadId} lead={lead} onNavigate={router.push} />
                ))}
              </MuiTableBody>
            </MuiTable>
          )}

          {!loading && leads.length > 0 && (
            <PaginationBar
              page={page}
              totalPages={totalPages}
              totalItems={totalLeads}
              onPageChange={setPage}
              minWidth="1200px"
            />
          )}
        </Box>

        <StickyScrollbar scrollRef={tableRef} />
      </div>
      <ActivitySlider open={isAuditLogOpen} onClose={() => setIsAuditLogOpen(false)} />
    </main>
  );
}