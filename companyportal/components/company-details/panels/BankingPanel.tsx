"use client";

import { useEffect, useState } from "react";
import {
  mapApiBankDetails,
  type ApiBankDetails,
  type CompanyBankingDetail,
} from "@/content/companyDetails";
import { BankIcon } from "@/components/home/icons";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

function BankingCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-sans uppercase leading-[15px] tracking-[0.6px] text-[#24577A99]">
        {label}
      </span>
      <span className="text-[13px] font-semibold leading-5 text-[#24577A]">{value}</span>
    </div>
  );
}

export default function BankingPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [bankingDetails, setBankingDetails] = useState<CompanyBankingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;

    async function loadBankDetails() {
      try {
        const response = await apiService.get<ApiBankDetails>(
          `/employer/${rolePlayerId}/bankDetails`,
          { token: token ?? undefined }
        );

        if (!cancelled) setBankingDetails([mapApiBankDetails(response)]);
      } catch (error) {
        console.error("Failed to load bank details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadBankDetails();
    return () => {
      cancelled = true;
    };
  }, [rolePlayerId, token]);

  if (isLoading) {
    return <BankingCardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {bankingDetails.map((bank) => (
        <div
          key={bank.accountNumber}
          className="flex flex-col gap-6 rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
        >
          <div className="flex items-center gap-2">
            <BankIcon className="h-4 w-4 shrink-0 text-[#24577A]" />
            <span className="text-[13.5px] font-heading font-bold leading-[22px] text-[#24577A]">
              {bank.accountHolder}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <DetailField label="Account holder" value={bank.accountHolder} />
              <DetailField label="Bank" value={bank.bank} />
              <DetailField label="Account no" value={bank.accountNumber} />
              <DetailField label="Account type" value={bank.accountType} />
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <DetailField label="Branch" value={bank.branch} />
              <DetailField label="Branch code" value={bank.branchCode} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
