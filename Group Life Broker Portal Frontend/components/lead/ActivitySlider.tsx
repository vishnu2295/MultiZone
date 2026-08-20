"use client";

import { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { X, Loader2 } from "lucide-react";
import { getAuditLogs, getLeadAuditLogs } from "@/lib/api/audit";

interface Activity {
  title: string;
  target: string;
  quoteReference?: string;
  time: string;
}

interface ActivitySliderProps {
  open: boolean;
  onClose: () => void;
  leadId?: string;
}

export default function ActivitySlider({ open, onClose, leadId }: ActivitySliderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  const mapLogs = (logs: any[]) => logs.map((log: any) => {
    const date = log.action_date_time || log.timestamp || log.created_at || log.createdAt || new Date().toISOString();
    const formattedTime = new Date(date).toLocaleString("en-GB", {
      hour: "numeric", minute: "2-digit", hour12: true,
      day: "numeric", month: "short", year: "numeric"
    }).replace(",", " |");

    let targetName = "";
    if (log.metadata?.employerName && log.metadata?.leadReference) {
      targetName = `${log.metadata.employerName} (${log.metadata.leadReference})`;
    } else if (log.metadata?.employerName) {
      targetName = log.metadata.employerName;
    } else {
      targetName = log.metadata?.leadReference || log.metadata?.quote_reference || log.metadata?.quoteReference || log.metadata?.leadId || log.metadata?.quoteId || "System Event";
    }

    return {
      title: log.audit_event_type || log.eventType || log.action || "System Event",
      target: targetName,
      quoteReference: log.metadata?.quote_reference || log.metadata?.quoteReference || log.metadata?.quoteId || undefined,
      time: formattedTime.toLowerCase(),
    };
  });

  useEffect(() => {
    if (open) {
      setLoading(true);
      setOffset(0);
      const fetchLogs = leadId
        ? getLeadAuditLogs(leadId, { limit: LIMIT, offset: 0 })
        : getAuditLogs({ limit: LIMIT, offset: 0 });

      fetchLogs
        .then((res) => {
          setActivities(mapLogs(res.logs));
          setTotalCount(res.totalCount);
        })
        .catch((err) => console.error("Failed to load audit logs", err))
        .finally(() => setLoading(false));
    }
  }, [open, leadId]);

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setLoadingMore(true);
    const fetchLogs = leadId
      ? getLeadAuditLogs(leadId, { limit: LIMIT, offset: nextOffset })
      : getAuditLogs({ limit: LIMIT, offset: nextOffset });

    fetchLogs
      .then((res) => {
        setActivities(prev => [...prev, ...mapLogs(res.logs)]);
        setOffset(nextOffset);
      })
      .catch((err) => console.error("Failed to load more audit logs", err))
      .finally(() => setLoadingMore(false));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "min(480px, 100vw)",
          background: "var(--card)",
          display: "flex",
          flexDirection: "column",
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", flexShrink: 0 }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", m: 0 }}>
          Audit Log
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            color: "var(--foreground)",
            "&:hover": { background: "var(--border)" }
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* Timeline Content */}
      <Box sx={{ flex: 1, overflowY: "auto", padding: "16px 32px 32px" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Loader2 className="animate-spin" size={24} color="#A0A0A0" />
          </Box>
        ) : activities.length === 0 ? (
          <Typography sx={{ color: "#A0A0A0", textAlign: "center", mt: 4 }}>
            No audit logs found.
          </Typography>
        ) : (
          activities.map((act, i) => {
            const isLast = i === activities.length - 1;
            return (
              <Box key={i} sx={{ display: "flex", position: "relative", paddingBottom: isLast ? "0" : "32px" }}>
                {/* Timeline Line */}
                {!isLast && (
                  <Box sx={{ position: "absolute", left: "6.5px", top: "16px", bottom: "-2px", width: 0, borderLeft: "2px dashed #1FC3EB", opacity: 0.4, zIndex: 1 }} />
                )}

                {/* Timeline Dot */}
                <Box sx={{ flexShrink: 0, marginRight: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ width: "15px", height: "15px", borderRadius: "50%", border: "1.5px solid #1FC3EB", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", zIndex: 2, marginTop: "2px" }}>
                    <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", background: "#1FC3EB" }} />
                  </Box>
                </Box>

                {/* Timeline Content */}
                <Box sx={{ marginTop: "-2px" }}>
                  <Typography sx={{ fontSize: "13px", color: "#A0A0A0", margin: "0 0 6px 0", lineHeight: "1.4" }}>
                    {act.title} &rarr; <Box component="span" sx={{ color: "var(--foreground)", fontStyle: "italic" }}>&quot;{act.target}&quot;</Box>
                  </Typography>
                  {act.quoteReference && (
                    <Typography sx={{ fontSize: "11px", color: "#A0A0A0", margin: "0 0 4px 0" }}>
                      Quote Reference : <Box component="span" sx={{ color: "var(--foreground)", fontWeight: 600, fontStyle: "italic" }}>{act.quoteReference}</Box>
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                    {act.time}
                  </Typography>
                </Box>
              </Box>
            );
          }))}

        {/* Load More Button */}
        {!loading && activities.length > 0 && activities.length < totalCount && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              sx={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                textTransform: "none",
                "&:hover": { color: "var(--foreground)", background: "var(--border)" }
              }}
            >
              {loadingMore ? <Loader2 className="animate-spin" size={16} /> : "Load More"}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
