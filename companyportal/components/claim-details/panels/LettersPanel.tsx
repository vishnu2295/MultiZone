"use client";

import { useEffect, useState } from "react";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  mapApiLetters,
  type ApiClaimDocument,
  type ClaimMedicalDocument,
} from "@/content/claimDetails";

export default function LettersPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();
  const [letters, setLetters] = useState<ClaimMedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadLetters() {
      try {
        const response = await apiService.get<ApiClaimDocument[]>(
          `/employer/lettersAndTemplates/${claimId}`,
          { token: token ?? undefined },
        );
        if (!cancelled) setLetters(mapApiLetters(response));
      } catch (error) {
        console.error("Failed to load letters:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadLetters();
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
        Letters and Templates
      </h2>
      {letters.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          No records found.
        </div>
      ) : (
        letters.map((letter) => <DocumentRow key={letter.name} document={letter} />)
      )}
    </div>
  );
}
