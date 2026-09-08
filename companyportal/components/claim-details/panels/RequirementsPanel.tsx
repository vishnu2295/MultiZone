"use client";

import { useEffect, useState } from "react";
import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import type { ApiPagedResponse } from "@/content/companyDetails";
import {
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimUploadDocument,
} from "@/content/claimDetails";

export default function RequirementsPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();
  const [requirements, setRequirements] = useState<ClaimUploadDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadRequirements() {
      try {
        const response = await apiService.get<
          ApiPagedResponse<ApiClaimDocument>
        >(`/employer/documents`, {
          token: token ?? undefined,
          params: { keyName: "claimId", keyValue: claimId },
        });
        if (!cancelled)
          setRequirements(mapApiDocuments(response.data).requirements);
      } catch (error) {
        console.error("Failed to load claim requirements:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadRequirements();
    return () => {
      cancelled = true;
    };
  }, [claimId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <DocumentUploadList
      title="Claim Requirements"
      documents={requirements}
      claimId={claimId}
    />
  );
}
