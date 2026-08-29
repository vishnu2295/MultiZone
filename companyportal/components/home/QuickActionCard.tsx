"use client";

import Link from "next/link";
import { ArrowUpRightIcon, quickActionIcons } from "@/components/home/icons";
import type { homeContent } from "@/content/site";

type QuickAction = (typeof homeContent)["quickActions"][number];

export default function QuickActionCard({
  icon,
  title,
  description,
  href,
  highlighted,
}: QuickAction) {
  const Icon = quickActionIcons[icon];

  return (
    <Link
      href={href}
      className={`group relative flex h-[267px] w-full flex-col rounded-xl bg-white p-5 transition ${
        highlighted
          ? "shadow-[13px_20px_28px_rgba(18,46,77,0.14)]"
          : "shadow-[2.8px_2.8px_28px_rgba(18,46,77,0.05)] hover:shadow-[13px_20px_28px_rgba(18,46,77,0.14)]"
      }`}
    >
      <Icon className="h-[30px] w-[30px] text-[#24577A]" />

      <h3 className="mt-[45px] text-[22px] font-light leading-6 tracking-[-0.28px] text-[#24577A]">
        {title}
      </h3>

      <p className="mt-4 max-w-[231px] text-[12px] font-light leading-5 tracking-[-0.14px] text-[#58585B]">
        {description}
      </p>

      <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F7FA] transition group-hover:bg-[#13537B]/10">
        <ArrowUpRightIcon className="h-6 w-6 text-[#24577A]" />
      </span>
    </Link>
  );
}
