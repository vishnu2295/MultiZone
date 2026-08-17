"use client";

import { useEffect, useState } from "react";
import {
  mapApiBankDetails,
  type ApiBankDetails,
  type CompanyBankingDetail,
} from "@/content/companyDetails";
import { BankIcon } from "@/components/home/icons";
import apiService from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
        {label}
      </span>
      <span className="text-[13px] font-bold leading-5 text-[#13537B]">{value}</span>
    </div>
  );
}

export default function BankingPanel() {
  const [bankingDetails, setBankingDetails] = useState<CompanyBankingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBankDetails() {
      try {
        const { token, coidId } = await getEmployerCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiBankDetails>(
          `/employer/${coidId}/bankDetails`,
          { token }
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
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-3 text-center text-[13.5px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
        Loading banking details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {bankingDetails.map((bank) => (
        <div
          key={bank.accountNumber}
          className="flex flex-col gap-6 rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
        >
          <div className="flex items-center gap-2">
            <BankIcon className="h-4 w-4 shrink-0 text-[#00BBE6]" />
            <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
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
