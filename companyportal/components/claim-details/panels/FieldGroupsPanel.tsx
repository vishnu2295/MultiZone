"use client";

import { useEffect, useState } from "react";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  mapApiEmploymentDetails,
  type ApiEmploymentDetails,
  type ClaimFieldGroup,
} from "@/content/claimDetails";

export default function FieldGroupsPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();
  const [groups, setGroups] = useState<ClaimFieldGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadEmployment() {
      try {
        const response = await apiService.get<ApiEmploymentDetails>(
          `/employer/employment/${claimId}`,
          { token: token ?? undefined },
        );
        if (!cancelled) setGroups(mapApiEmploymentDetails(response));
      } catch (error) {
        console.error("Failed to load employment details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadEmployment();
    return () => {
      cancelled = true;
    };
  }, [claimId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Employment Details
      </h2>

      {groups.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          No records found.
        </div>
      )}

      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
        >
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.title}
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {group.fields.map((field) => (
              <div key={field.label} className="flex min-w-0 flex-col">
                <span className="wrap-break-word text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#24577A80]">
                  {field.label}
                </span>
                <span className="wrap-break-word pt-0.5 text-[13px] font-bold leading-5 text-[#24577A]">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
