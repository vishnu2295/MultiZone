import type { ReactNode } from "react";

import Navbar, { type NavItem } from "@/components/common/Navbar";
import { individualNavItems } from "@/content/site";

export interface IndividualBackgroundProps {
  portalName?: string;
  navItems?: NavItem[];
  profileLabel?: string;
  onProfileClick?: () => void;
  logoSrc?: string;
  children: ReactNode;
}

/** Shared chrome for individual portal inner screens. */
export default function IndividualBackground({
  portalName = "Employee Portal",
  navItems = individualNavItems,
  profileLabel = "My Profile",
  onProfileClick,
  logoSrc,
  children,
}: IndividualBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#F3F7FA]">
      <div className="relative z-20">
        <Navbar
          portalName={portalName}
          navItems={navItems}
          profileLabel={profileLabel}
          onProfileClick={onProfileClick}
          logoSrc={logoSrc}
          fixed={false}
        />
      </div>

      {children}
    </div>
  );
}