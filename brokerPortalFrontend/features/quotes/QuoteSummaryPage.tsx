"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Box, Typography, Button, Stack, Menu, MenuItem } from "@mui/material";
import CustomButton from "@/components/ui/button";
import CancelQuoteModal from "@/components/quotes/CancelQuoteModal";
import ActivitySlider from "@/components/lead/ActivitySlider";
import LeadSelectionModal from "./LeadSelectionModal";
import { Lead } from "@/lib/api/leads";
import { getQuotes, updateQuoteStatus, formatRand } from "@/lib/api/quotes";
import { QuoteStatus } from "@/lib/enums";
import FilterToolbar from "@/components/ui/FilterToolbar";
import QuoteCard, { Quote } from "@/components/ui/QuoteCard";
import { useDebounce } from "@/hooks/useDebounce";
import PaginationBar from "@/components/ui/PaginationBar";

// Types

type TabKey =
  | "draft"
  | "generated"
  | "revised"
  | "awaiting_employer_acceptance"
  | "accepted"
  | "expired"
  | "rejected";

// Constants

const TABS: { key: TabKey; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "generated", label: "Generated" },
  { key: "revised", label: "Revised" },
  {
    key: "awaiting_employer_acceptance",
    label: "Awaiting Employer Acceptance",
  },
  { key: "accepted", label: "Accepted" },
  { key: "expired", label: "Expired" },
  { key: "rejected", label: "Rejected" },
];

const TAB_STATUSES: Record<TabKey, QuoteStatus> = {
  draft: QuoteStatus.DRAFT,
  generated: QuoteStatus.GENERATED,
  revised: QuoteStatus.REVISED,
  awaiting_employer_acceptance: QuoteStatus.AWAITING_EMPLOYER_ACCEPTANCE,
  accepted: QuoteStatus.ACCEPTED,
  expired: QuoteStatus.EXPIRED,
  rejected: QuoteStatus.REJECTED,
};

const TAB_KEYS = new Set<string>(TABS.map((t) => t.key));

// Helpers

function parseTabKey(value: string | null): TabKey {
  if (value && TAB_KEYS.has(value)) return value as TabKey;
  return "draft";
}

function calcDaysRemaining(createdAt: string, validUntilDays = 30): number {
  const expiry =
    new Date(createdAt).getTime() + validUntilDays * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)));
}

// Custom hooks

function useQuotes(
  activeTab: TabKey,
  debouncedSearch: string,
  page: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC"
) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);

  const load = useCallback(
    async (opts?: { cancelled?: () => boolean }) => {
      const filters: Record<string, unknown> = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        quote_status: TAB_STATUSES[activeTab],
      };

      if (debouncedSearch) {
        if (debouncedSearch.toLowerCase().startsWith("qt-")) {
          filters.quote_reference = debouncedSearch;
        } else {
          filters.clientName = debouncedSearch;
        }
      }

      const apiQuotes = await getQuotes(filters);
      if (opts?.cancelled?.()) return;

      setQuotes(
        apiQuotes.map((q) => ({
          id: q.quoteId,
          companyName: q.companyName,
          quoteType: q.quoteType as Quote["quoteType"],
          daysRemaining: calcDaysRemaining(q.createdAt, q.validUntilDays),
          quoteId: q.quoteReference,
          quoteReference: q.quoteReference,
          monthlyPremium: formatRand(q.monthlyPremium),
          coverageAmount: formatRand(q.coverageAmount),
          createdDate: new Date(q.createdAt).toLocaleDateString("en-ZA"),
          numberOfEmployees: q.numberOfEmployees,
          status: q.status as Quote["status"],
          contactFirstName: q.contactFirstName,
          contactLastName: q.contactLastName,
          contactEmail: q.contactEmail,
          contactMobile: q.contactMobile,
        }))
      );

      if (apiQuotes.pagination) {
        setTotalPages(Math.max(1, Math.ceil(apiQuotes.pagination.total / 10)));
        setTotalQuotes(apiQuotes.pagination.total);
      }
    },
    [activeTab, debouncedSearch, page, sortBy, sortOrder]
  );

  // Fetch once when filters change — no polling
  useEffect(() => {
    let cancelled = false;
    load({ cancelled: () => cancelled }).catch((err) => {
      if (!cancelled) console.error("Failed to load quotes:", err);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { quotes, setQuotes, totalPages, totalQuotes, load };
}

interface QuotesMenuProps {
  anchorEl: HTMLElement | null;
  quote: Quote | null;
  onClose: () => void;
  onViewDetails: (quote: Quote) => void;
  onMarkApproved: (quote: Quote) => void;
  onCancel: (quote: Quote) => void;
  onContinue: (quote: Quote) => void;
}

//Actions Menu
function QuotesMenu({
  anchorEl,
  quote,
  onClose,
  onViewDetails,
  onMarkApproved,
  onCancel,
  onContinue,
}: QuotesMenuProps) {
  const menuItemSx = { "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } };

  const withClose = (action?: () => void) => () => {
    action?.();
    onClose();
  };

  const isQuick = quote?.quoteType === "Quick Quote";
  const isFull = quote?.quoteType === "Full Quote" || !isQuick; // fallback to full quote options

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          bgcolor: "var(--card-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          minWidth: "160px",
        },
      }}
    >
      {isQuick && (
        <MenuItem
          onClick={withClose(quote ? () => onContinue(quote) : undefined)}
          sx={menuItemSx}
        >
          Continue
        </MenuItem>
      )}

      {isFull && [
        <MenuItem
          key="view-details"
          onClick={withClose(quote ? () => onViewDetails(quote) : undefined)}
          sx={menuItemSx}
        >
          View Details
        </MenuItem>,
        <MenuItem
          key="mark-approved"
          onClick={withClose(quote ? () => onMarkApproved(quote) : undefined)}
          sx={menuItemSx}
        >
          Mark as Approved
        </MenuItem>,
      ]}

      <MenuItem
        onClick={withClose(quote ? () => onCancel(quote) : undefined)}
        sx={menuItemSx}
      >
        Cancel Quote
      </MenuItem>
      <MenuItem onClick={withClose()} sx={menuItemSx}>
        Download
      </MenuItem>
    </Menu>
  );
}

// Page component

export default function QuoteSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Tab — initialised from URL query param
  const [activeTab, setActiveTab] = useState<TabKey>(() =>
    parseTabKey(searchParams.get("tab"))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery);

  // Reset to page 1 when search/sort changes (tab change handled in handleTabChange)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder]);

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
    // Update URL from the click handler only — avoid a searchParams→replace effect
    // loop that remounts this Suspense boundary and re-fetches repeatedly.
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { quotes, setQuotes, totalPages, totalQuotes, load } = useQuotes(
    activeTab,
    debouncedSearch,
    page,
    sortBy,
    sortOrder
  );

  // Modal state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeMenuQuote, setActiveMenuQuote] = useState<Quote | null>(null);
  const [cancelQuote, setCancelQuote] = useState<Quote | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  // Menu handlers
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    quote: Quote
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuQuote(quote);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenuQuote(null);
  };

  // Action handlers
  const handleProceedWithQuote = (lead: Lead) => {
    router.push(
      `/quotes/new?leadId=${lead.leadId}&ref=${lead.leadReference}&company=${encodeURIComponent(lead.employerName)}&leadEmployeeCount=${lead.numberOfEmployees}&mode=new`
    );
    setShowLeadModal(false);
  };

  const handleMarkAsApproved = (quote: Quote) => {
    router.push(
      `/quotes/${quote.id}/checkout?companyName=${encodeURIComponent(quote.companyName)}&ref=${encodeURIComponent(quote.quoteReference)}`
    );
  };

  const handleConfirmCancel = async () => {
    if (!cancelQuote) return;

    const previous = cancelQuote;
    const statusTargetId = cancelQuote.quoteId; // quote reference used by status API

    // Optimistic remove — cancelled quotes leave the current status tab
    setQuotes((prev) => prev.filter((q) => q.id !== previous.id));
    setCancelQuote(null);

    try {
      await updateQuoteStatus(statusTargetId, "Cancelled");
      await load();
    } catch {
      // Rollback list entry
      setQuotes((prev) => {
        if (prev.some((q) => q.id === previous.id)) return prev;
        return [previous, ...prev];
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Background blur */}
      <Box
        sx={{
          position: "absolute",
          pointerEvents: "none",
          width: "608px",
          height: "608px",
          right: "-200px",
          bottom: "-200px",
          background: "#00C0E8",
          opacity: 0.05,
          filter: "blur(172px)",
          borderRadius: "50%",
        }}
      />

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "24px",
            px: "24px",
            pt: "24px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            Quotes
          </Typography>
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
              onClick={() => setShowLeadModal(true)}
              startIcon={<Plus size={20} />}
              sx={{ height: "40px", px: "16px" }}
            >
              Add New Quote
            </CustomButton>
          </Stack>
        </Box>

        <Box
          sx={{
            px: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Search & Sort */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              Search Quotes
            </Typography>
            <FilterToolbar
              search={searchQuery}
              onSearch={setSearchQuery}
              searchPlaceholder="Search by company name or quote ID..."
            >
              <Typography
                sx={{ fontSize: "13px", color: "var(--text-secondary)" }}
              >
                Sort by:
              </Typography>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card-secondary)",
                  padding: "0 12px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                <option value="createdAt">Created Date</option>
                <option value="lead.employer.employer_name">
                  Company Name
                </option>
                <option value="total_premium">Monthly Premium</option>
              </select>
              <Button
                onClick={() =>
                  setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
                }
                sx={{
                  minWidth: "38px",
                  height: "38px",
                  p: 0,
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  "&:hover": { bgcolor: "var(--card-secondary)" },
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: sortOrder === "DESC" ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </Button>
            </FilterToolbar>
          </Box>

          {/* Tabs */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", gap: "8px 0px" }}
          >
            {TABS.map((tab) => (
              <Button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                variant={activeTab === tab.key ? "contained" : "outlined"}
                sx={{
                  height: "32px",
                  px: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  bgcolor:
                    activeTab === tab.key
                      ? "var(--primary)"
                      : "var(--card-secondary)",
                  borderColor: activeTab === tab.key ? "none" : "var(--border)",
                  color:
                    activeTab === tab.key ? "#151515" : "var(--text-primary)",
                  "&:hover": {
                    bgcolor:
                      activeTab === tab.key ? "#1AB3D9" : "var(--card-primary)",
                    borderColor: "var(--border)",
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>

          {/* Quotes list */}
          <Stack spacing={2} sx={{ mb: "24px" }}>
            {quotes.length === 0 ? (
              <Box sx={{ py: "48px" }}>
                <Typography
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  No quotes in this category
                </Typography>
              </Box>
            ) : (
              quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onOpenMenu={(e) => handleOpenMenu(e, quote)}
                />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationBar
                page={page}
                totalPages={totalPages}
                totalItems={totalQuotes}
                onPageChange={setPage}
              />
            )}
          </Stack>
        </Box>
      </Box>

      {/* Menus & Modals */}
      <QuotesMenu
        anchorEl={anchorEl}
        quote={activeMenuQuote}
        onClose={handleCloseMenu}
        onViewDetails={(q) => router.push(`/quotes/${q.id}/preview`)}
        onMarkApproved={handleMarkAsApproved}
        onCancel={(q) => setCancelQuote(q)}
        onContinue={(q) => {
          router.push(`/quotes/new?quoteId=${q.id}&mode=new`);
        }}
      />

      <LeadSelectionModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onProceed={handleProceedWithQuote}
      />

      {cancelQuote && (
        <CancelQuoteModal
          isOpen
          onClose={() => setCancelQuote(null)}
          quoteId={cancelQuote.quoteId}
          onConfirm={handleConfirmCancel}
        />
      )}
      <ActivitySlider
        open={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
      />
    </Box>
  );
}
