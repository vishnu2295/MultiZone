"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthorizationsPanel from "@/components/claim-details/panels/AuthorizationsPanel";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import InvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";
import PaymentsPanel from "@/components/claim-details/panels/PaymentsPanel";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import Pagination from "@/components/ui/Pagination";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { computePageCount } from "@/lib/utils/pagination";
import type { ApiPagedResponse } from "@/content/companyDetails";
import type { ApiClaim } from "@/content/claims";
import {
  claimTabs,
  mapApiClaimMedicalInvoice,
  mapApiClaimMedicalInvoices,
  mapApiClaimPayments,
  mapApiDocuments,
  mapApiPreAuthorizations,
  type ApiClaimDocument,
  type ApiClaimMedicalInvoice,
  type ClaimMedicalInvoice,
  type ApiClaimPayment,
  type ApiPreAuthorizationDetailsResponse,
  type ClaimAuthorization,
  type ClaimInvoice,
  type ClaimMedicalDocument,
  type ClaimPayment,
  type ClaimTab,
} from "@/content/claimDetails";
import MedicalInvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";

const MEDICAL_INVOICES_PAGE_SIZE = 10;

export default function ClaimTabsPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [activeTab, setActiveTab] = useState<ClaimTab>(claimTabs[0]);

  const [invoiceDocuments, setInvoiceDocuments] = useState<ClaimMedicalDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  const [authorizations, setAuthorizations] = useState<ClaimAuthorization[]>([]);
  const [isLoadingAuthorizations, setIsLoadingAuthorizations] = useState(true);

  const [medicalInvoices, setMedicalInvoices] = useState<ClaimMedicalInvoice[]>([]);
  const [isLoadingMedicalInvoices, setIsLoadingMedicalInvoices] =
    useState(true);
  const [personEventId, setPersonEventId] = useState<number | null>(null);
  const [medicalInvoicesPage, setMedicalInvoicesPage] = useState(1);
  const [medicalInvoicesPageCount, setMedicalInvoicesPageCount] = useState(1);

  const [payments, setPayments] = useState<ClaimPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoadingDocuments(true);

    async function loadDocuments() {
      try {
        const response = await apiService.get<
          ApiPagedResponse<ApiClaimDocument>
        >(`/employer/${rolePlayerId}/documents`, {
          token: token ?? undefined,
          params: { keyName: "claimId", keyValue: claimId },
        });
        if (!cancelled) {
          setInvoiceDocuments(mapApiDocuments(response.data).invoiceDocuments);
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

  // useEffect(() => {
  //   if (!token || !rolePlayerId || !ref) {
  //     setIsLoadingAuthorizations(false);
  //     return;
  //   }

  //   let cancelled = false;
  //   setIsLoadingAuthorizations(true);

  //   async function loadAuthorizations() {
  //     try {
  //       const response =
  //         await apiService.get<ApiPreAuthorizationDetailsResponse>(
  //           `/employer/preAuthorizationDetailsByClaimNumber/${ref as string}`,
  //           { token: token ?? undefined, params: { rolePlayerId } },
  //         );
  //       if (!cancelled) setAuthorizations(mapApiPreAuthorizations(response));
  //     } catch (error) {
  //       console.error("Failed to load pre-authorization details:", error);
  //     } finally {
  //       if (!cancelled) setIsLoadingAuthorizations(false);
  //     }
  //   }

  //   loadAuthorizations();
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [ref, rolePlayerId, token]);

  // The invoices endpoint is keyed by personEventId, which only the claim
  // itself carries - look it up from the claim reference once, then page
  // through invoices below without refetching the claim.
  useEffect(() => {
    if (!token || !rolePlayerId || !ref) {
      setIsLoadingMedicalInvoices(false);
      return;
    }

    let cancelled = false;
    setIsLoadingMedicalInvoices(true);
    async function loadPersonEventId() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });
        if (cancelled) return;
        if (claim.personEventId) {
          setPersonEventId(claim.personEventId);
        } else {
          setIsLoadingMedicalInvoices(false);
        }
      } catch (error) {
        console.error("Failed to load claim for medical invoices:", error);
        if (!cancelled) setIsLoadingMedicalInvoices(false);
      }
    }

    loadPersonEventId();
    return () => {
      cancelled = true;
    };
  }, [ref, rolePlayerId, token]);

  useEffect(() => {
    if (!token || !rolePlayerId || !personEventId) return;

    let cancelled = false;
    setIsLoadingMedicalInvoices(true);
    async function loadMedicalInvoices() {
      try {
        const response = await apiService.get<
          ApiPagedResponse<ApiClaimMedicalInvoice>
        >(`/employer/${rolePlayerId}/invoices/${personEventId}`, {
          token: token ?? undefined,
          params: {
            page: medicalInvoicesPage,
            pageSize: MEDICAL_INVOICES_PAGE_SIZE,
            invoiceNumber: "",
          },
        });
        if (!cancelled) {
          setMedicalInvoices(mapApiClaimMedicalInvoices(response.data ?? []));
          setMedicalInvoicesPageCount(
            computePageCount(response.rowCount, MEDICAL_INVOICES_PAGE_SIZE),
          );
        }
      } catch (error) {
        console.error("Failed to load medical invoices:", error);
      } finally {
        if (!cancelled) setIsLoadingMedicalInvoices(false);
      }
    }

    loadMedicalInvoices();
    return () => {
      cancelled = true;
    };
  }, [medicalInvoicesPage, personEventId, rolePlayerId, token]);

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
          `/employer/${rolePlayerId}/paymentDetails/${claimId}`,
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
      <div className="-mx-4 flex scrollbar-none items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:sticky lg:top-18 lg:z-20 lg:bg-[#F3F7FA] lg:py-2">
        {claimTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
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

        {/* {activeTab === "Invoices" &&
          (isLoadingDocuments ? (
            <PanelSkeleton />
          ) : invoiceDocuments.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
              No documents found.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {invoiceDocuments.map((document) => (
                <DocumentRow key={document.name} document={document} />
              ))}
            </div>
          ))} */}
        {activeTab === "Medical Invoices" &&
          (isLoadingMedicalInvoices ? (
            <PanelSkeleton />
          ) : (
            <div className="flex flex-col gap-3">
              <MedicalInvoicesPanel
                invoices={medicalInvoices}
              />
              <Pagination
                page={medicalInvoicesPage}
                pageCount={medicalInvoicesPageCount}
                onPageChange={setMedicalInvoicesPage}
              />
            </div>
          ))}
        {/* {activeTab === "Authorisations" &&
          (isLoadingAuthorizations ? (
            <PanelSkeleton />
          ) : (
            <AuthorizationsPanel authorizations={authorizations} />
          ))} */}
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
