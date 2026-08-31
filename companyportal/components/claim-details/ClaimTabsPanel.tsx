"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthorizationsPanel from "@/components/claim-details/panels/AuthorizationsPanel";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import InvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";
import PaymentsPanel from "@/components/claim-details/panels/PaymentsPanel";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  claimTabs,
  mapApiClaimPayments,
  mapApiDocuments,
  mapApiPreAuthorizations,
  type ApiClaimDocument,
  type ApiClaimPayment,
  type ApiPreAuthorizationDetailsResponse,
  type ClaimAuthorization,
  type ClaimMedicalDocument,
  type ClaimPayment,
  type ClaimTab,
} from "@/content/claimDetails";

export default function ClaimTabsPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [activeTab, setActiveTab] = useState<ClaimTab>(claimTabs[0]);

  const [invoiceDocuments, setInvoiceDocuments] = useState<ClaimMedicalDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  const [authorizations, setAuthorizations] = useState<ClaimAuthorization[]>([]);
  const [isLoadingAuthorizations, setIsLoadingAuthorizations] = useState(true);

  const [payments, setPayments] = useState<ClaimPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoadingDocuments(true);

    async function loadDocuments() {
      try {
        const response = await apiService.get<ApiClaimDocument[]>(
          `/employer/documents/${claimId}`,
          { token: token ?? undefined },
        );
        if (!cancelled) {
          setInvoiceDocuments(mapApiDocuments(response).invoiceDocuments);
        }
      } catch (error) {
        console.error("Failed to load claim documents:", error);
      } finally {
        if (!cancelled) setIsLoadingDocuments(false);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [claimId, token]);

  useEffect(() => {
    if (!token || !rolePlayerId || !ref) {
      setIsLoadingAuthorizations(false);
      return;
    }

    let cancelled = false;
    setIsLoadingAuthorizations(true);

    async function loadAuthorizations() {
      try {
        const response = await apiService.get<ApiPreAuthorizationDetailsResponse>(
          `/employee/preAuthorizationDetailsByClaimNumber/${encodeURIComponent(ref as string)}`,
          { token: token ?? undefined, params: { rolePlayerId } },
        );
        if (!cancelled) setAuthorizations(mapApiPreAuthorizations(response));
      } catch (error) {
        console.error("Failed to load pre-authorization details:", error);
      } finally {
        if (!cancelled) setIsLoadingAuthorizations(false);
      }
    }

    loadAuthorizations();
    return () => {
      cancelled = true;
    };
  }, [ref, rolePlayerId, token]);

  useEffect(() => {
    if (!token || !rolePlayerId) {
      setIsLoadingPayments(false);
      return;
    }

    let cancelled = false;
    setIsLoadingPayments(true);

    async function loadPayments() {
      try {
        const response = await apiService.get<ApiClaimPayment[]>(
          `/employer/paymentDetails/${rolePlayerId}`,
          { token: token ?? undefined },
        );
        if (!cancelled) setPayments(mapApiClaimPayments(response));
      } catch (error) {
        console.error("Failed to load payment details:", error);
      } finally {
        if (!cancelled) setIsLoadingPayments(false);
      }
    }

    loadPayments();
    return () => {
      cancelled = true;
    };
  }, [rolePlayerId, token]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {claimTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          {activeTab}
        </h2>

        {activeTab === "Invoices" &&
          (isLoadingDocuments ? (
            <PanelSkeleton />
          ) : (
            <div className="flex flex-col gap-4">
              {invoiceDocuments.map((document) => (
                <DocumentRow key={document.name} document={document} />
              ))}
            </div>
          ))}
        {activeTab === "Medical Invoices" && <InvoicesPanel invoices={[]} />}
        {activeTab === "Authorizations" &&
          (isLoadingAuthorizations ? (
            <PanelSkeleton />
          ) : (
            <AuthorizationsPanel authorizations={authorizations} />
          ))}
        {activeTab === "Payments" &&
          (isLoadingPayments ? (
            <PanelSkeleton />
          ) : (
            <PaymentsPanel payments={payments} />
          ))}
      </div>
    </>
  );
}
