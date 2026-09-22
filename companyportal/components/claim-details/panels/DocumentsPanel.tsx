"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { documentSetOptions } from "@/lib/constants";
import type { ApiPagedResponse } from "@/content/companyDetails";
import type { ApiClaim } from "@/content/claims";
import {
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimMedicalDocument,
} from "@/content/claimDetails";

export default function DocumentsPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [documents, setDocuments] = useState<ClaimMedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !rolePlayerId || !ref) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadDocuments() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });

        const response = await apiService.get<
          ApiPagedResponse<ApiClaimDocument>
        >(`/employer/${rolePlayerId}/documents`, {
          token: token ?? undefined,
          params: {
            keyName: "PersonEventId",
            keyValue: claim.personEventId,
            page: 1,
            pageSize: 10,
          },
        });
        if (!cancelled)
          setDocuments(
            mapApiDocuments(response.data).documentGroups[0]?.documents ?? [],
          );
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [claimId, ref, rolePlayerId, token]);

  const groupedDocuments = useMemo(() => {
    const groups = new Map<number, ClaimMedicalDocument[]>();
    for (const document of documents) {
      const key = document.documentSet ?? -1;
      const group = groups.get(key);
      if (group) group.push(document);
      else groups.set(key, [document]);
    }

    return Array.from(groups.entries()).map(([documentSet, docs]) => ({
      documentSet,
      label:
        documentSetOptions.find((option) => option.value === documentSet)?.label ??
        "Other",
      documents: docs,
    }));
  }, [documents]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Documents
      </h2>

      {groupedDocuments.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          No documents found.
        </div>
      )}
      {groupedDocuments.map((group) => (
        <section key={group.documentSet} className="flex flex-col gap-4">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.label}
          </h3>

          {group.documents.map((document) => (
            <DocumentRow key={document.name} document={document} />
          ))}
        </section>
      ))}
    </div>
  );
}
