"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ROUTES } from "@/lib/constants";
import DashboardCard from "@/components/ui/DashboardCard";
import MetricCard from "@/components/ui/MetricCard";
import { getDashboardMetrics } from "@/lib/api/dashboard";

const quickActions = [
  {
    title: "Start New Lead",
    description: "Create new lead and begin the quote journey",
    icon: AddOutlinedIcon,
    href: `${ROUTES.newLead}?from=dashboard`,
  },
  {
    title: "View All Leads",
    description: "Search, filter and manage existing leads",
    icon: AssignmentOutlinedIcon,
    href: ROUTES.viewLeads,
  },
  {
    title: "View Quotes",
    description: "Manage and track insurance quotes",
    icon: DescriptionOutlinedIcon,
    href: ROUTES.quotes,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState({
    activeLeads: 0,
    failedInvoices: 0,
    activeQuotes: 0,
    quotesNearExpiry: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const metricsData = await getDashboardMetrics();
        setMetrics({
          activeLeads: metricsData.activeLeads,
          failedInvoices: metricsData.failedInvoices,
          activeQuotes: metricsData.activeQuotes,
          quotesNearExpiry: metricsData.quotesExpiredToday,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard Metrics", err);
        setMetrics({
          activeLeads: 0,
          failedInvoices: 0,
          activeQuotes: 0,
          quotesNearExpiry: 0,
        });
      }
    })();
  }, []);

  const metricCards = [
    {
      id: "activeLeads",
      value: metrics.activeLeads.toString(),
      label: "Active Leads",
      icon: InsertChartOutlinedIcon,
    },
    {
      id: "failedInvoices",
      value: metrics.failedInvoices.toString(),
      label: "Failed Invoices",
      icon: ErrorOutlineIcon,
    },
    {
      id: "activeQuotes",
      value: metrics.activeQuotes.toString(),
      label: "Active Quotes",
      icon: AssignmentOutlinedIcon,
    },
    {
      id: "quotesNearExpiry",
      value: metrics.quotesNearExpiry.toString(),
      label: <>Quotes Near Expiry <br /> {"(<10days)"}</>,
      icon: WarningAmberOutlinedIcon,
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        p: "20px",
        bgcolor: "var(--background)",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: "24px",
          fontSize: "1.5rem",
          fontWeight: 500,
          color: "var(--text-primary)",
        }}
      >
        Dashboard
      </Typography>

      <Box sx={{ maxWidth: "100%" }}>
        <Grid container spacing={2.75} sx={{ mb: "32px" }}>
          {metricCards.map(({ id, value, label, icon }) => (
            <Grid size={3} key={id}>
              <MetricCard value={value} label={label} icon={icon} />
            </Grid>
          ))}
        </Grid>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: "24px",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--quick-actions-bg)",
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2.75}>
            {quickActions.map(({ title, description, icon: Icon, href }) => (
              <Grid size={3} key={title}>
                <DashboardCard
                  title={title}
                  description={description}
                  icon={Icon}
                  onClick={() => router.push(href)}
                  iconWrapperStyle={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "12px",
                    backgroundColor: "var(--quote-icon-bg)",
                    color: "var(--text-primary)",
                    marginBottom: "48px",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
