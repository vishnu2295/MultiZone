"use client";

import { useEffect, useState } from "react";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimDocumentGroup,
} from "@/content/claimDetails";

export default function DocumentsPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();
  const [groups, setGroups] = useState<ClaimDocumentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadDocuments() {
      try {
        const response = await apiService.get<ApiClaimDocument[]>(
          `/employer/documents/${claimId}`,
          { token: token ?? undefined },
        );
        if (!cancelled) setGroups(mapApiDocuments(response).documentGroups);
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
  }, [claimId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">Documents</h2>

      {groups.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          No documents found.
        </div>
      )}

      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.title}
          </h3>

          {group.documents.map((document) => (
            <DocumentRow key={document.name} document={document} />
          ))}
        </section>
      ))}
    </div>
  );
}
