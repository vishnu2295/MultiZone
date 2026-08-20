"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePermissions } from "@/lib/context/PermissionsContext";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@mui/material";

import { ADMINSITRATION_ROUTES } from "@/lib/constants";
import {
  PieChartOutlined,
  HandshakeOutlined,
  DomainOutlined,
  TuneOutlined,
  ShieldOutlined,
  GroupOutlined,
  FactCheckOutlined,
  AccountBalanceWalletOutlined,
  HealthAndSafetyOutlined,
  ReceiptLongOutlined,
  WorkOutlineOutlined,
  EditNoteOutlined,
  ReceiptOutlined,
  InsertDriveFileOutlined,
  NotificationsNoneOutlined,
  ViewSidebarOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const MENU_GROUPS = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: ADMINSITRATION_ROUTES.dashboard,
        icon: PieChartOutlined,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Broker Administration",
        href: ADMINSITRATION_ROUTES.brokerAdministration,
        icon: HandshakeOutlined,
        moduleName: "Broker",
      },
      {
        label: "Policy Administration",
        href: ADMINSITRATION_ROUTES.policyAdministration,
        icon: DomainOutlined,
        // moduleName: "Employer Policy",
      },
      {
        label: "Onboarding Administration",
        href: ADMINSITRATION_ROUTES.onboardingAdministration,
        icon: TuneOutlined,
        moduleName: "Onboarding",
      },
      {
        label: "Policy Life Cycle",
        href: ADMINSITRATION_ROUTES.policyLifecycle,
        icon: ShieldOutlined,
        moduleName: "Lifecycle",
      },
      {
        label: "Users and Roles",
        href: ADMINSITRATION_ROUTES.UsersAndRoles,
        icon: GroupOutlined,
        // System Admin or specific role usually manages users
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Approval Queue",
        href: "/approvalQueue",
        icon: FactCheckOutlined,
      },
      {
        label: "Collections Administration",
        href: "/collections",
        icon: AccountBalanceWalletOutlined,
        moduleName: "Collections Administration", // Based on UI text, but backend likely has "Collections Administration"
      },
      {
        label: "Claims Administration",
        href: "/claimsAdministration",
        icon: HealthAndSafetyOutlined,
        moduleName: "Claims",
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        label: "Reporting & Audit",
        href: "/reporting-audit",
        icon: ReceiptLongOutlined,
        moduleName: "Reporting",
      },
      {
        label: "Commissions",
        href: "/commissions",
        icon: WorkOutlineOutlined,
        moduleName: "Commission",
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        label: "Underwriting",
        href: "/underwriting",
        icon: EditNoteOutlined,
      },
      {
        label: "Quote & Onboarding",
        href: "/quote-onboarding",
        icon: ReceiptOutlined,
      },
      {
        label: "Document Management",
        href: "/document-mgmt",
        icon: InsertDriveFileOutlined,
        moduleName: "Documents",
      },
      {
        label: "Notifications & Support",
        href: "/notifications-support",
        icon: NotificationsNoneOutlined,
        moduleName: "Notifications",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Matches exact path OR any child route.
 * e.g. /broker-admin matches /broker-admin/123 but not /broker-admin-settings
 */
function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { hasPermission } = usePermissions();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          bgcolor: "sidebar.bg",
          border: "none",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 73,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 2,
        }}
      >
        {!isCollapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: "8px",
              height: "56px",
              flexShrink: 0,
              pl: 0,
            }}
          >
            <img
              src="/adminPortal/rma-logo.png"
              alt="RMA Logo"
              style={{ height: "24px", width: "auto" }}
            />
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <ViewSidebarOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {MENU_GROUPS.map((group) => (
          <Box key={group.title} sx={{ mb: 3 }}>
            {!isCollapsed ? (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  fontWeight: 700,
                  color: "sidebar.foregroundMuted",
                  letterSpacing: 1,
                }}
              >
                {group.title}
              </Typography>
            ) : (
              <Divider sx={{ mx: 1, mb: 1 }} />
            )}

            <List disablePadding>
              {group.items.map((item: any) => {
                if (
                  item.moduleName &&
                  !hasPermission(item.moduleName, "view")
                ) {
                  return null;
                }

                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <ListItemButton
                    key={item.href}
                    selected={active}
                    onClick={() => router.push(item.href)}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      minHeight: 48,
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      borderRadius: 2,
                      color: "sidebar.foreground",
                      "&.Mui-selected": {
                        bgcolor: "sidebar.activeBg",
                        color: "sidebar.activeText",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "sidebar.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: isCollapsed ? "auto" : 40,
                        color: active
                          ? "sidebar.activeText"
                          : "sidebar.foreground",
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>

                    {!isCollapsed && (
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: 14,
                              fontWeight: active ? 600 : 500,
                            },
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* ── Footer ── */}
      <Box
        sx={{
          px: "12px",
          pb: "16px",
          pt: "8px",
          display: isCollapsed ? "none" : "block",
        }}
      >
        <Button
          fullWidth
          startIcon={<LogoutOutlined sx={{ fontSize: 13 }} />}
          onClick={() => {
            // Redirect to main app's logout endpoint
            const logoutUrl = `${process.env.NEXT_PUBLIC_CLIENT_CONNECT_URL || "http://localhost:4200"}/api/auth/logout`;
            window.location.href = logoutUrl;
          }}
          sx={{
            height: "30px",
            color: "sidebar.foregroundMuted",
            bgcolor: "transparent",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            justifyContent: "flex-start",
            px: "8px",
            transition: "color 0.15s",
            "&:hover": {
              color: "sidebar.foreground",
              bgcolor: "transparent",
            },
            "& .MuiButton-startIcon": {
              marginRight: "8px",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
