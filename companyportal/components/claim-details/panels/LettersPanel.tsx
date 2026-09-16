"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentRow, {
  type ApiDocumentDownload,
} from "@/components/claim-details/panels/DocumentRow";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { ClaimLettersAndTemplates } from "@/lib/constants";
import { downloadBase64File } from "@/lib/utils/downloadFile";
import type { ApiClaim } from "@/content/claims";

export default function LettersPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [personEventId, setPersonEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !ref) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadClaim() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });

        if (!cancelled) {
          setPersonEventId(claim.personEventId);
        }
      } catch (error) {
        console.error("Failed to load claim for letters:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadClaim();
    return () => {
      cancelled = true;
    };
  }, [ref, rolePlayerId, token]);

  async function handleDownload(
    letter: (typeof ClaimLettersAndTemplates)[number],
  ) {
    if (!rolePlayerId || !personEventId) return;

    const response = await apiService.get<ApiDocumentDownload>(
      `/employer/${rolePlayerId}/rmd01Letter/${personEventId}`,
      { token: token ?? undefined },
    );

    downloadBase64File(response.fileName, response.fileType, response.content);
  }

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Letters and Templates
      </h2>
      {ClaimLettersAndTemplates.map((letter) => (
        <DocumentRow
          key={letter.key}
          document={{ name: letter.key }}
          onDownload={() => handleDownload(letter)}
        />
      ))}
    </div>
  );
}
