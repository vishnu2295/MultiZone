import type { ReactNode } from "react";
import Image from "next/image";

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

/**
 * Shared chrome for individual portal inner screens.
 *
 * Wave mirrors Figma node 2831:1204: natural aspect (~3.34), width 78.23vw,
 * centered on the Figma box center (79.7%W / 4.02vw), tilted ~3.7° — the
 * same technique as the hero wave. Left edge is faded so the raw PNG edge
 * never shows as a hard cut. Reference frame 1440px.
 */
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
      {/* Decorative wave — mirrors Figma node 2831:1204 */}
     <div
  aria-hidden
  className="pointer-events-none absolute left-[79.7vw] top-[4.02vw] z-0 -translate-x-1/2 -translate-y-1/2"
>
        <div className="w-[78.23vw] rotate-[3.74deg]">
          <div
            className="relative aspect-[5425/1630] w-full
                       [mask-image:linear-gradient(to_right,transparent_0%,black_8%)]
                       [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%)]"
          >
            <Image
              src="/background-wave.png"
              alt=""
              fill
              quality={100}
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

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