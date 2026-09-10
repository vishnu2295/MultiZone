"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@/components/home/icons";
import {
  mapApiPolicyDetail,
  type ApiPolicyDetail,
  type PolicyDetail,
} from "@/content/policyDetails";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

function PolicyInfoCardSkeleton() {
  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px] lg:sticky lg:top-24 lg:self-start">
      <Skeleton className="h-4 w-32" />

      <div className="relative mt-4 overflow-hidden rounded-lg p-4 bg-[var(--blues-gradient-100,#006DA6)] shadow-[0px_4px_28.9px_0px_#00000040]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <span className="h-6 w-14 animate-pulse rounded-md bg-white/25" />
          <span className="h-6 w-16 animate-pulse rounded-full bg-white/25" />
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <span className="h-4 w-32 animate-pulse rounded-full bg-white/30" />
          <span className="h-3.5 w-40 animate-pulse rounded-full bg-white/25" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            {index < 4 && <span className="h-px w-full bg-black/5" aria-hidden />}
          </div>
        ))}
      </div>
    </aside>
  );
}

function buildInfoRows(policy: PolicyDetail): Array<{ label: string; value: string }> {
  return [
    { label: "Product Option", value: policy.productOption },
    { label: "Inception Date", value: policy.inceptionDate },
    { label: "Expiry Date", value: policy.expiryDate },
    { label: "Insurer", value: policy.insurer },
    { label: "Payment Frequency", value: policy.paymentFrequency },
  ];
}

export default function PolicyInfoCard({ policyId }: { policyId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadPolicyDetail() {
      try {
        const policyDetail = await apiService.get<ApiPolicyDetail>(
          `/employer/${rolePlayerId}/policies/${policyId}`,
          { token: token ?? undefined },
        );

        if (!cancelled) {
          setPolicy(mapApiPolicyDetail(policyDetail));
        }
      } catch (error) {
        console.error("Failed to load policy details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPolicyDetail();
    return () => {
      cancelled = true;
    };
  }, [policyId, rolePlayerId, token]);

  if (isLoading) {
    return <PolicyInfoCardSkeleton />;
  }

  if (!policy) {
    return (
      <aside className="w-full shrink-0 rounded-xl bg-white p-4 text-center text-[13.5px] font-normal text-[#64748B] shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px] lg:sticky lg:top-24 lg:self-start">
        No policy details found.
      </aside>
    );
  }

  const infoRows = buildInfoRows(policy);

  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px] lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
        Policy Details
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-lg p-4 bg-[var(--blues-gradient-100,#006DA6)] shadow-[0px_4px_28.9px_0px_#00000040]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-[#F5B121] px-2.5 py-1.5 text-[11px] font-bold leading-[15px] text-white">
            {policy.code}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#CAE9A4] px-3 py-1 text-[11px] font-bold leading-[15px] text-black">
            <CheckCircleIcon className="h-2.5 w-2.5" />
            {policy.status}
          </span>
        </div>

        <div className="relative mt-4 flex flex-col gap-1">
          <p className="text-[15px] font-bold leading-[19px] text-white">
            {policy.title}
          </p>
          <p className="text-[13px] font-normal leading-[17px] text-white">
            Policy No : {policy.policyNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {infoRows.map((row, index) => (
          <div key={row.label} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-[12px] font-normal leading-[15px] text-[#24577ACC]">
                {row.label}
              </span>
              <span className="min-w-0 flex-1 break-words text-right text-[12px] font-semibold leading-[15px] text-[#24577A]">
                {row.value}
              </span>
            </div>
            {index < infoRows.length - 1 && (
              <span className="h-px w-full bg-black/5" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
