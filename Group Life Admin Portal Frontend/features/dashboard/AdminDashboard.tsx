"use client";

import React, { useState } from "react";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { StatusChip } from "../../components/ui/StatusChip";
import {
  AccountBalanceWallet,
  Assignment,
  Business,
  CheckCircleOutlined,
  ErrorOutlined,
  Groups,
  HistoryToggleOff,
  NorthEast,
  SouthEast,
  TaskAlt,
} from "@mui/icons-material";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  caption: string;
  icon: React.ReactNode;
}

interface PendingTask {
  id: string;
  task: string;
  category: string;
  requestedBy: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
}

interface ActivityItem {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  timestamp: string;
  type: "approval" | "update" | "alert";
}

interface OnboardingRow {
  id: string;
  employer: string;
  broker: string;
  scheme: string;
  submitted: string;
  status: "In Review" | "Awaiting Docs" | "Approved";
}

//--Mock Data--

const KPI_CARDS: KpiCard[] = [
  {
    label: "Active Policies",
    value: "1,284",
    change: "+4.2%",
    trend: "up",
    caption: "vs last month",
    icon: <Assignment fontSize="small" />,
  },
  {
    label: "Registered Brokers",
    value: "73",
    change: "+3",
    trend: "up",
    caption: "new this month",
    icon: <Business fontSize="small" />,
  },
  {
    label: "Covered Employees",
    value: "48,920",
    change: "+1.8%",
    trend: "up",
    caption: "vs last month",
    icon: <Groups fontSize="small" />,
  },
  {
    label: "Premium Collected",
    value: "R 12.4m",
    change: "-2.1%",
    trend: "down",
    caption: "vs last month",
    icon: <AccountBalanceWallet fontSize="small" />,
  },
];

const PREMIUM_BY_MONTH = [
  { month: "Jan", value: 9.8 },
  { month: "Feb", value: 10.6 },
  { month: "Mar", value: 11.2 },
  { month: "Apr", value: 10.9 },
  { month: "May", value: 12.7 },
  { month: "Jun", value: 12.4 },
];

const POLICY_DISTRIBUTION = [
  { label: "Group Risk Cover", count: 512, total: 1284 },
  { label: "Funeral Cover", count: 391, total: 1284 },
  { label: "Disability Cover", count: 234, total: 1284 },
  { label: "Health Top-Up", count: 147, total: 1284 },
];

const PENDING_TASKS: PendingTask[] = [
  {
    id: "t1",
    task: "Approve quote for Mzansi Mining (Pty) Ltd",
    category: "Quote Approval",
    requestedBy: "Thabo Nkosi",
    dueDate: "13 Jun 2026",
    priority: "High",
  },
  {
    id: "t2",
    task: "Review broker accreditation — Kingfisher Brokers",
    category: "Accreditation",
    requestedBy: "Zanele Dube",
    dueDate: "14 Jun 2026",
    priority: "High",
  },
  {
    id: "t3",
    task: "Verify outstanding FICA documents",
    category: "Compliance",
    requestedBy: "Daniel Botha",
    dueDate: "16 Jun 2026",
    priority: "Medium",
  },
  {
    id: "t4",
    task: "Sign off June commission run",
    category: "Commissions",
    requestedBy: "Finance Team",
    dueDate: "20 Jun 2026",
    priority: "Medium",
  },
  {
    id: "t5",
    task: "Archive lapsed policies for Q1",
    category: "Policy Lifecycle",
    requestedBy: "System",
    dueDate: "27 Jun 2026",
    priority: "Low",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "r1",
    actor: "Sarah Dlamini",
    initials: "SD",
    action: "approved the onboarding of",
    target: "Karoo Logistics (Pty) Ltd",
    timestamp: "Today, 09:42",
    type: "approval",
  },
  {
    id: "r2",
    actor: "Priya Naidoo",
    initials: "PN",
    action: "updated commission tier for",
    target: "Meridian Brokers SA",
    timestamp: "Today, 08:15",
    type: "update",
  },
  {
    id: "r3",
    actor: "System",
    initials: "SY",
    action: "flagged missing FICA docs for",
    target: "Garden Route Insure",
    timestamp: "Yesterday, 16:30",
    type: "alert",
  },
  {
    id: "r4",
    actor: "Jacob Jones",
    initials: "JJ",
    action: "moved policy POL-20391 to",
    target: "Renewal Review",
    timestamp: "Yesterday, 14:02",
    type: "update",
  },
  {
    id: "r5",
    actor: "Sarah Dlamini",
    initials: "SD",
    action: "deactivated user account",
    target: "darlene@rma.co.za",
    timestamp: "Yesterday, 11:48",
    type: "alert",
  },
  {
    id: "r6",
    actor: "Eleanor Pena",
    initials: "EP",
    action: "approved claim CLM-8841 for",
    target: "Mzansi Mining (Pty) Ltd",
    timestamp: "10 Jun, 15:20",
    type: "approval",
  },
];

const ONBOARDING_QUEUE: OnboardingRow[] = [
  {
    id: "o1",
    employer: "Karoo Logistics (Pty) Ltd",
    broker: "Apex Risk Solutions",
    scheme: "Group Risk Cover",
    submitted: "09 Jun 2026",
    status: "Approved",
  },
  {
    id: "o2",
    employer: "Mzansi Mining (Pty) Ltd",
    broker: "Meridian Brokers SA",
    scheme: "Group Risk Cover",
    submitted: "10 Jun 2026",
    status: "In Review",
  },
  {
    id: "o3",
    employer: "Ubuntu Textiles CC",
    broker: "Cape Assurance Brokers",
    scheme: "Funeral Cover",
    submitted: "10 Jun 2026",
    status: "Awaiting Docs",
  },
  {
    id: "o4",
    employer: "Drakensberg Farms Ltd",
    broker: "Umhlanga Cover Group",
    scheme: "Disability Cover",
    submitted: "11 Jun 2026",
    status: "In Review",
  },
];

const PRIORITY_STYLES: Record<
  PendingTask["priority"],
  { bgcolor: string; color: string }
> = {
  High: { bgcolor: "rgba(239,68,68,0.1)", color: "rgb(220,38,38)" },
  Medium: { bgcolor: "rgba(245,158,11,0.12)", color: "rgb(217,119,6)" },
  Low: { bgcolor: "rgba(148,163,184,0.1)", color: "rgb(100,116,139)" },
};

// ─── Components ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "activity">(
    "overview"
  );

  const maxPremium = Math.max(...PREMIUM_BY_MONTH.map((m) => m.value));

  //Todo : This Screen needs to be revamped
  return (
    <Box
      sx={{ display: "flex", minHeight: "100%", bgcolor: "background.default" }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 3, lg: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 0,
        }}
      >
        {/* Page title */}
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>

        {/* ── KPI Cards ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {KPI_CARDS.map((card) => (
            <Paper
              key={card.label}
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {card.label}
                </Typography>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(31,195,235,0.12)",
                    color: "primary.main",
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {card.value}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  size="small"
                  icon={
                    card.trend === "up" ? (
                      <NorthEast sx={{ fontSize: "14px !important" }} />
                    ) : (
                      <SouthEast sx={{ fontSize: "14px !important" }} />
                    )
                  }
                  label={card.change}
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    bgcolor:
                      card.trend === "up"
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(239,68,68,0.1)",
                    color:
                      card.trend === "up" ? "rgb(22,163,74)" : "rgb(220,38,38)",
                    "& .MuiChip-icon": {
                      color:
                        card.trend === "up"
                          ? "rgb(22,163,74)"
                          : "rgb(220,38,38)",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {card.caption}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* ── Tabs ── */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab
              value="overview"
              label="Overview"
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
            />
            <Tab
              value="tasks"
              label="Pending Tasks"
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
            />
            <Tab
              value="activity"
              label="Recent Activity"
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
            />
          </Tabs>
        </Box>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Charts row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "3fr 2fr" },
                gap: 3,
              }}
            >
              {/* Premium collections bar chart */}
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
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Premium Collections
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 6 months (R millions)
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 2,
                    height: 220,
                    px: 1,
                  }}
                >
                  {PREMIUM_BY_MONTH.map((m) => (
                    <Stack
                      key={m.month}
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        gap: 1,
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {m.value.toFixed(1)}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 48,
                          height: `${(m.value / maxPremium) * 100}%`,
                          minHeight: 8,
                          borderRadius: "8px 8px 4px 4px",
                          bgcolor:
                            m.month === "Jun"
                              ? "primary.main"
                              : "rgba(31,195,235,0.25)",
                          transition: "height 0.3s ease",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        {m.month}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              {/* Policy distribution */}
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Policy Distribution
                </Typography>

                <Stack spacing={2.5} sx={{ flex: 1, justifyContent: "center" }}>
                  {POLICY_DISTRIBUTION.map((item) => {
                    const pct = Math.round((item.count / item.total) * 100);
                    return (
                      <Box key={item.label}>
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", mb: 0.75 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.count} ({pct}%)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Box>

            {/* Latest onboarding submissions */}
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
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Latest Onboarding Submissions
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2, boxShadow: "none" }}
              >
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "grey.700"
                            : "grey.50",
                      }}
                    >
                      {[
                        "Employer",
                        "Broker",
                        "Scheme",
                        "Submitted",
                        "Status",
                      ].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            textTransform: "uppercase",
                            color: "text.secondary",
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {ONBOARDING_QUEUE.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, fontSize: 14 }}>
                          {row.employer}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        >
                          {row.broker}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        >
                          {row.scheme}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        >
                          {row.submitted}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* ── Pending Tasks Tab ── */}
        {activeTab === "tasks" && (
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
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Pending Tasks
              </Typography>
              <Chip
                icon={<TaskAlt sx={{ fontSize: "16px !important" }} />}
                label={`${PENDING_TASKS.length} open items`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  bgcolor: "rgba(31,195,235,0.12)",
                  color: "primary.main",
                  "& .MuiChip-icon": { color: "primary.main" },
                }}
              />
            </Stack>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, boxShadow: "none" }}
            >
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.700" : "grey.50",
                    }}
                  >
                    {[
                      "Task",
                      "Category",
                      "Requested By",
                      "Due Date",
                      "Priority",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "text.secondary",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {PENDING_TASKS.map((task) => (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: 14 }}>
                        {task.task}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "text.secondary" }}>
                        {task.category}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "text.secondary" }}>
                        {task.requestedBy}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "text.secondary" }}>
                        {task.dueDate}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            ...PRIORITY_STYLES[task.priority],
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* ── Recent Activity Tab ── */}
        {activeTab === "activity" && (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: { xs: 2.5, lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Recent Activity
              </Typography>
              <Chip
                icon={<HistoryToggleOff sx={{ fontSize: "16px !important" }} />}
                label="Last 7 days"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  bgcolor: "rgba(148,163,184,0.1)",
                  color: "rgb(100,116,139)",
                  "& .MuiChip-icon": { color: "rgb(100,116,139)" },
                }}
              />
            </Stack>

            <List disablePadding>
              {RECENT_ACTIVITY.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem sx={{ px: 0.5, py: 1.75 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: 14,
                          fontWeight: 700,
                          bgcolor:
                            item.type === "approval"
                              ? "rgba(34,197,94,0.12)"
                              : item.type === "alert"
                                ? "rgba(239,68,68,0.12)"
                                : "rgba(31,195,235,0.12)",
                          color:
                            item.type === "approval"
                              ? "rgb(22,163,74)"
                              : item.type === "alert"
                                ? "rgb(220,38,38)"
                                : "primary.main",
                        }}
                      >
                        {item.initials}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {item.actor}
                          </Box>{" "}
                          {item.action}{" "}
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {item.target}
                          </Box>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp}
                        </Typography>
                      }
                    />

                    {item.type === "approval" && (
                      <CheckCircleOutlined
                        sx={{ color: "success.main", fontSize: 20 }}
                      />
                    )}
                    {item.type === "alert" && (
                      <ErrorOutlined
                        sx={{ color: "error.main", fontSize: 20 }}
                      />
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
