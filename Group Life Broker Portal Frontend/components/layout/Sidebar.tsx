"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { ROUTES } from "@/lib/constants";
import Image from "next/image";
import { useSidebar } from "@/lib/context/SidebarContext";

const quickActions = [
  { label: "Dashboard", icon: DashboardOutlinedIcon, href: ROUTES.dashboard },
];

const leadsAndPolicies = [
  { label: "Leads", icon: AssignmentOutlinedIcon, href: ROUTES.viewLeads },
  { label: "Quotes", icon: FactCheckOutlinedIcon, href: ROUTES.quotes },
  { label: "Policies", icon: ShieldOutlinedIcon, href: ROUTES.policies },
];

const toolsSupport = [
  {
    label: "Failed Invoices",
    icon: ErrorOutlineIcon,
    href: ROUTES.failedInvoices,
  },
  { label: "FAQ", icon: HelpOutlineIcon, href: ROUTES.faq },
  { label: "Training", icon: SchoolOutlinedIcon, href: ROUTES.training },
  { label: "Chatbot", icon: ChatOutlinedIcon, href: ROUTES.chatbot },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const C = {
    bg: "var(--sidebar-bg)",
    border: "var(--sidebar-border)",
    primary: "var(--primary)",
    primaryDark: "var(--primary-dark)",
    fg: "var(--sidebar-foreground)",
    fgMuted: "var(--text-muted)",
    activeBg: "var(--sidebar-active-bg)",
    hoverBg: "var(--sidebar-hover-bg)",
    activeText: "var(--sidebar-active-text)",
    backBorder: "var(--sidebar-back-border)",
    backBg: "var(--sidebar-back-bg)",
    backColor: "var(--sidebar-back-color)",
    backHoverBg: "var(--sidebar-back-hover-bg)",
    logoutColor: "var(--sidebar-logout-color)",
    logoutHoverColor: "var(--sidebar-logout-hover-color)",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNewLead = mounted && pathname === ROUTES.newLead;
  const isQuoteJourney =
    mounted && /^\/lead\/[^/]+\/quote/.test(pathname ?? "");
  const isQuoteTypeSelection = mounted && pathname === "/quotes/new";
  const isLeadDetail =
    mounted &&
    /^\/lead\/[^/]+$/.test(pathname ?? "") &&
    pathname !== "/lead/new" &&
    pathname !== "/lead/view";
  const isCheckout =
    mounted && /^\/quotes\/[^/]+\/checkout/.test(pathname ?? "");
  const isQuotePreview =
    mounted && /^\/quotes\/[^/]+\/preview/.test(pathname ?? "");

  return (
    <Box
      component="aside"
      sx={{
        height: "100vh",
        width: isCollapsed ? "60px" : "240px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
        bgcolor: C.bg,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid " + C.border,
        transition: "width 0.3s ease",
      }}
    >
      {/* Sidebar Toggle Button */}
      <IconButton
        aria-label="Toggle sidebar"
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          position: "absolute",
          top: isCollapsed ? "70px" : "16px",
          left: isCollapsed ? "14px" : "196px",
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          color: "var(--sidebar-icon-color)",
          bgcolor: "transparent",
          zIndex: 20,
          transition: "all 0.15s",
          "&:hover": {
            bgcolor: C.hoverBg,
          },
        }}
      >
        <ViewSidebarOutlinedIcon
          sx={{ fontSize: "24px" }}
          style={{
            transform: isCollapsed ? "scaleX(-1)" : "scaleX(1)",
            transition: "transform 0.3s ease",
          }}
        />
      </IconButton>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "8px",
          height: "64px",
          flexShrink: 0,
          pl: isCollapsed ? "0px" : "16px",
        }}
      >
        <Image
          src="/brokerPortal/rma-logo.png"
          alt="RMA Logo"
          width={150}
          height={36}
          sizes="100vw"
          style={{ height: "32px", width: "auto", marginTop: "10px" }}
        />
      </Box>

      {/* Nav */}
      <Box
        component="nav"
        sx={{
          flex: 1,
          overflowY: "auto",
          px: "16px",
          py: "12px",
          display: isCollapsed ? "none" : "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {!mounted ? null : isNewLead ||
          isQuoteJourney ||
          isQuoteTypeSelection ||
          isLeadDetail ||
          isCheckout ||
          isQuotePreview ? (
          /* Minimal nav for new lead / quote journey / quote type selection / lead detail */
          <>
            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                letterSpacing: "0.05em",
                px: "12px",
                mb: "6px",
                fontWeight: 700,
                color: C.fgMuted,
                display: "block",
              }}
            >
              Actions
            </Typography>
            {[
              {
                label: "Back",
                icon: ArrowBackOutlinedIcon,
                href:
                  isNewLead && searchParams?.get("from") === "dashboard"
                    ? ROUTES.dashboard
                    : isQuotePreview && searchParams?.get("from") === "quotes"
                      ? ROUTES.quotes
                      : isNewLead ||
                          isLeadDetail ||
                          isQuoteJourney ||
                          isCheckout ||
                          isQuotePreview ||
                          (isQuoteTypeSelection &&
                            searchParams?.get("from") === "leads")
                        ? ROUTES.viewLeads
                        : isQuoteTypeSelection
                          ? ROUTES.quotes
                          : ROUTES.dashboard,
              },
            ].map(({ label, icon: Icon, href }) => (
              <Button
                key={label}
                onClick={() => router.push(href)}
                startIcon={<Icon sx={{ fontSize: "16px" }} />}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  height: "33px",
                  px: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${C.backBorder}`,
                  bgcolor: C.backBg,
                  color: C.backColor,
                  fontSize: "14px",
                  fontWeight: 400,
                  textTransform: "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: C.backHoverBg,
                  },
                  "& .MuiButton-startIcon": {
                    marginRight: "10px",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </>
        ) : (
          /* Full nav for dashboard, quotes page, and all other pages */
          <>
            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                letterSpacing: "0.05em",
                px: "12px",
                mb: "4px",
                fontWeight: 700,
                color: C.fgMuted,
                display: "block",
              }}
            >
              Actions
            </Typography>

            {quickActions.map(({ label, icon: Icon, href }) => {
              const isActive = mounted && pathname === href;
              return (
                <Button
                  key={label}
                  onClick={() => router.push(href)}
                  startIcon={<Icon sx={{ fontSize: "14px" }} />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "44px",
                    pl: "20px",
                    pr: "12px",
                    my: "1px",
                    borderRadius: "8px",
                    color: isActive ? C.activeText : C.fg,
                    bgcolor: isActive ? C.primary : "transparent",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    textTransform: "none",
                    position: "relative",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: isActive ? C.primaryDark : C.hoverBg,
                      color: isActive ? C.activeText : C.primary,
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "12px",
                      color: isActive ? "inherit" : "var(--sidebar-icon-color)",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}

            <Divider sx={{ my: "12px", borderColor: C.border }} />

            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                letterSpacing: "0.05em",
                px: "12px",
                mb: "4px",
                fontWeight: 700,
                color: C.fgMuted,
                display: "block",
              }}
            >
              Leads and Policies
            </Typography>

            {leadsAndPolicies.map(({ label, icon: Icon, href }) => {
              const isActive = mounted && pathname === href;
              return (
                <Button
                  key={label}
                  onClick={() => router.push(href)}
                  startIcon={<Icon sx={{ fontSize: "14px" }} />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "44px",
                    pl: "20px",
                    pr: "12px",
                    my: "1px",
                    borderRadius: "8px",
                    color: isActive ? C.activeText : C.fg,
                    bgcolor: isActive ? C.primary : "transparent",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    textTransform: "none",
                    position: "relative",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: isActive ? C.primaryDark : C.hoverBg,
                      color: isActive ? C.activeText : C.primary,
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "12px",
                      color: isActive ? "inherit" : "var(--sidebar-icon-color)",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}

            <Divider sx={{ my: "12px", borderColor: C.border }} />

            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                letterSpacing: "0.05em",
                px: "12px",
                mb: "4px",
                fontWeight: 700,
                color: C.fgMuted,
                display: "block",
              }}
            >
              Tools &amp; Support
            </Typography>

            {toolsSupport.map(({ label, icon: Icon, href }) => {
              const isActive = mounted && pathname === href;
              return (
                <Button
                  key={label}
                  onClick={() => router.push(href)}
                  startIcon={<Icon sx={{ fontSize: "14px" }} />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "44px",
                    pl: "20px",
                    pr: "12px",
                    my: "1px",
                    borderRadius: "8px",
                    color: isActive ? C.activeText : C.fg,
                    bgcolor: isActive ? C.primary : "transparent",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    textTransform: "none",
                    position: "relative",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: isActive ? C.primaryDark : C.hoverBg,
                      color: isActive ? C.activeText : C.primary,
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "12px",
                      color: isActive ? "inherit" : "var(--sidebar-icon-color)",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}
