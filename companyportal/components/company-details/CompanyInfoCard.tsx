"use client";

import { useEffect, useState } from "react";
import {
  mapApiCompanyDetails,
  type ApiCompanyDetails,
  type ApiEmployerDetails,
  type CompanyInfo,
} from "@/content/companyDetails";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

function CompanyInfoCardSkeleton() {
  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
      <Skeleton className="h-4 w-32" />

      <div className="relative mt-4 overflow-hidden rounded-lg bg-[var(--blues-gradient-100,#006DA6)] shadow-[0px_4px_28.9px_0px_#00000040] p-4">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <span className="h-11 w-[47px] animate-pulse rounded-lg bg-white/25" />
          <span className="h-6 w-16 animate-pulse rounded-full bg-white/25" />
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <span className="h-4 w-32 animate-pulse rounded-full bg-white/30" />
          <span className="h-3.5 w-40 animate-pulse rounded-full bg-white/25" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            {index < 7 && <span className="h-px w-full bg-black/5" aria-hidden />}
          </div>
        ))}
      </div>
    </aside>
  );
}

function buildInfoRows(company: CompanyInfo): Array<{ label: string; value: string }> {
  return [
    { label: "Industry Class", value: company.industryClass },
    { label: "Industry", value: company.industry },
    { label: "VAT Reg. No", value: company.vatRegNo },
    { label: "Compensation Fund Ref", value: company.compensationFundRef },
    { label: "Compensation Fund Reg", value: company.compensationFundReg },
    { label: "Compensation Fund Status", value: company.compensationFundStatus },
    { label: "Nature of Business", value: company.natureOfBusiness },
    { label: "Created Date", value: company.createdDate },
  ];
}

export default function CompanyInfoCard() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;

    async function loadCompanyDetails() {
      try {
        const [companyDetails, employerDetails] = await Promise.all([
          apiService.get<ApiCompanyDetails>(`/employer/${rolePlayerId}/companyDetails`, {
            token: token ?? undefined,
          }),
          apiService.get<ApiEmployerDetails>(`/employer/${rolePlayerId}/employerDetails`, {
            token: token ?? undefined,
          }),
        ]);

        if (!cancelled) {
          setCompany(mapApiCompanyDetails({ ...companyDetails, ...employerDetails }));
        }
      } catch (error) {
        console.error("Failed to load company details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCompanyDetails();
    return () => {
      cancelled = true;
    };
  }, [rolePlayerId, token]);

  if (isLoading) {
    return <CompanyInfoCardSkeleton />;
  }

  if (!company) {
    return (
      <aside className="w-full shrink-0 rounded-xl bg-white p-4 text-center text-[13.5px] font-normal text-[#64748B] shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
        No company details found.
      </aside>
    );
  }

  const infoRows = buildInfoRows(company);

  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
        Company Details
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-lg p-4 bg-[var(--blues-gradient-100,#006DA6)] shadow-[0px_4px_28.9px_0px_#00000040]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex h-11 w-[47px] items-center justify-center rounded-lg bg-[#F5B121]">
            <span className="text-[14px] font-bold leading-[17px] text-white">
              {company.code}
            </span>
          </div>
          <span className="rounded-full bg-[#CAE9A4] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-black">
            {company.status}
          </span>
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <p className="text-[16px] font-bold leading-[19px] text-white">
            {company.name}
          </p>
          <p className="text-[14px] font-normal leading-[17px] text-white">
            Reg No : {company.regNo}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {infoRows.map((row, index) => (
          <div key={row.label} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] font-normal leading-[15px] text-[#24577ACC]">
                {row.label}
              </span>
              <span className="text-right text-[12px] font-semibold leading-[15px] text-[#24577A]">
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
