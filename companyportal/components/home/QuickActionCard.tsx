"use client";

import Link from "next/link";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { ArrowUpRightIcon, quickActionIcons } from "@/components/home/icons";
import type { homeContent } from "@/content/site";
import apiService from "@/lib/api/apiService";

type QuickAction = (typeof homeContent)["quickActions"][number];

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
  return JSON.parse(json);
}

export default function QuickActionCard({
  icon,
  title,
  description,
  href,
  highlighted,
}: QuickAction) {
  const Icon = quickActionIcons[icon];

  const handleClick = async () => {
    if (href !== "/home/policies") return;

    const token = await getAccessToken();
    const claims = decodeJwtPayload(token);
    const profileIdentifier =
      claims["https://rma.com/claims/profile_identifier"];

    const response = await apiService.get(
      `/default/api/mobileApp/coid/employer/${profileIdentifier}/policies`,
      {
        token,
      },
    );
    console.log("Policies response:", response);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group relative flex h-[267px] w-full flex-col rounded-xl bg-white p-5 transition ${
        highlighted
          ? "shadow-[13px_20px_28px_rgba(18,46,77,0.14)]"
          : "shadow-[2.8px_2.8px_28px_rgba(18,46,77,0.05)] hover:shadow-[13px_20px_28px_rgba(18,46,77,0.14)]"
      }`}
    >
      <Icon className="h-[30px] w-[30px] text-[#13537B]" />

      <h3 className="mt-[45px] text-[22px] font-light leading-6 tracking-[-0.28px] text-[#13537B]">
        {title}
      </h3>

      <p className="mt-4 max-w-[231px] text-[12px] font-light leading-5 tracking-[-0.14px] text-[#3C5564]">
        {description}
      </p>

      <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F7FA] transition group-hover:bg-[#13537B]/10">
        <ArrowUpRightIcon className="h-6 w-6 text-[#13537B]" />
      </span>
    </Link>
  );
}
