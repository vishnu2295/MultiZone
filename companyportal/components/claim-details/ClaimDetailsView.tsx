"use client";

import { useEffect, useState } from "react";
import ClaimInfoCard from "@/components/claim-details/ClaimInfoCard";
import AuthorizationsPanel from "@/components/claim-details/panels/AuthorizationsPanel";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import FieldGroupsPanel from "@/components/claim-details/panels/FieldGroupsPanel";
import InvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";
import BeneficiariesPanel from "@/components/claim-details/panels/BeneficiariesPanel";
import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import DocumentsPanel from "@/components/claim-details/panels/DocumentsPanel";
import MedicalReportsPanel from "@/components/claim-details/panels/MedicalReportsPanel";
import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
import ClaimantInjuryPanel from "@/components/claim-details/panels/ClaimantInjuryPanel";
import PaymentsPanel from "@/components/claim-details/panels/PaymentsPanel";
import apiService from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";
import {
  claimTabs,
  getClaimantFullName,
  getClaimantInitials,
  mapApiBeneficiaries,
  mapApiClaimantDetails,
  mapApiDocuments,
  mapApiEarnings,
  mapApiEmploymentDetails,
  mapApiIcdCodes,
  mapApiInjuryDetails,
  mapApiMedicalReports,
  type ApiBeneficiary,
  type ApiClaimantDetailsResponse,
  type ApiClaimDocument,
  type ApiEarningsRecord,
  type ApiEmploymentDetails,
  type ApiIcdCode,
  type ApiInjuryDetailsResponse,
  type ApiMedicalReportsResponse,
  type ClaimDetails,
  type ClaimSection,
  type ClaimTab,
} from "@/content/claimDetails";

const sectionHeadings: Partial<Record<ClaimSection, string>> = {
  Employment: "Employment Details",
  "Letters & Templates": "Letters and Templates",
};

export default function ClaimDetailsView({
  claim,
  claimantId,
}: {
  claim: ClaimDetails;
  claimantId: string;
}) {
  const [activeSection, setActiveSection] = useState<ClaimSection | null>(null);
  const [activeTab, setActiveTab] = useState<ClaimTab>(claimTabs[0]);
  const [claimantDetails, setClaimantDetails] = useState(claim.claimantDetails);
  const [claimantIdentity, setClaimantIdentity] = useState({
    claimantName: claim.claimantName,
    initials: claim.initials,
  });
  const [injuryDetails, setInjuryDetails] = useState(claim.injuryDetails);
  const [icdCodes, setIcdCodes] = useState(claim.icdCodes);
  const [employment, setEmployment] = useState(claim.employment);
  const [beneficiaries, setBeneficiaries] = useState(claim.beneficiaries);
  const [earnings, setEarnings] = useState(claim.earnings);
  const [requirements, setRequirements] = useState(claim.requirements);
  const [medicalReports, setMedicalReports] = useState(claim.medicalReports);
  const [isClaimantLoaded, setIsClaimantLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadClaimantAndInjury() {
      try {
        const { token } = await getEmployerCoidId();
        const [
          claimantResponse,
          injuryResponse,
          icdCodesResponse,
          employmentResponse,
          beneficiariesResponse,
          earningsResponse,
          documentsResponse,
          medicalReportsResponse,
        ] = await Promise.all([
          apiService.get<ApiClaimantDetailsResponse>(
            `/employer/claimant/${claimantId}`,
            { token },
          ),
          apiService.get<ApiInjuryDetailsResponse>(
            `/employer/injury/${claimantId}`,
            { token },
          ),
          apiService.get<ApiIcdCode[]>(`/employer/icd10codes/${claimantId}`, {
            token,
          }),
          apiService.get<ApiEmploymentDetails>(
            `/employer/employment/${claimantId}`,
            { token },
          ),
          apiService.get<ApiBeneficiary[]>(
            `/employer/beneficiaries/${claimantId}`,
            { token },
          ),
          apiService.get<ApiEarningsRecord[]>(
            `/employer/earnings/${claimantId}`,
            { token },
          ),
          apiService.get<ApiClaimDocument[]>(
            `/employer/documents/${claimantId}`,
            { token },
          ),
          apiService.get<ApiMedicalReportsResponse>(
            `/employer/medicalRecords/${claimantId}`,
            { token },
          ),
        ]);

        if (cancelled) return;
        setClaimantDetails(mapApiClaimantDetails(claimantResponse));
        setClaimantIdentity({
          claimantName: getClaimantFullName(claimantResponse.personalDetails),
          initials: getClaimantInitials(claimantResponse.personalDetails),
        });
        setInjuryDetails(mapApiInjuryDetails(injuryResponse));
        setIcdCodes(mapApiIcdCodes(icdCodesResponse));
        setEmployment(mapApiEmploymentDetails(employmentResponse));
        setBeneficiaries(mapApiBeneficiaries(beneficiariesResponse));
        setEarnings(mapApiEarnings(earningsResponse));
        setRequirements(mapApiDocuments(documentsResponse));
        setMedicalReports(mapApiMedicalReports(medicalReportsResponse));
      } catch (error) {
        console.error("Failed to load claimant/injury details:", error);
      } finally {
        if (!cancelled) setIsClaimantLoaded(true);
      }
    }

    loadClaimantAndInjury();
    return () => {
      cancelled = true;
    };
  }, [claimantId]);

  const displayClaim: ClaimDetails = {
    ...claim,
    ...claimantIdentity,
    claimantDetails,
    injuryDetails,
    icdCodes,
    employment,
    beneficiaries,
    earnings,
    requirements,
    medicalReports,
  };

  return (
    <div className="relative z-10 mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
      <ClaimInfoCard
        claim={displayClaim}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      <div className="flex-1">
        {activeSection === null ? (
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

              {/* {activeTab === "Invoices" && (
                <InvoicesPanel invoices={claim.invoices} />
              )} */}
              {activeTab === "Medical Invoices" && (
                <InvoicesPanel invoices={claim.medicalInvoices} />
              )}
              {activeTab === "Authorizations" && (
                <AuthorizationsPanel authorizations={claim.authorizations} />
              )}
              {activeTab === "Payments" && (
                <PaymentsPanel payments={claim.payments} />
              )}
            </div>
          </>
        ) : activeSection === "Beneficiaries" ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
              Beneficiaries
            </h2>
            <BeneficiariesPanel beneficiaries={beneficiaries} />
          </div>
        ) : activeSection === "Documents" ? (
          <DocumentsPanel groups={claim.documentGroups} />
        ) : activeSection === "Medical Reports" ? (
          <MedicalReportsPanel reports={medicalReports} />
        ) : activeSection === "Requirements" ? (
          <DocumentUploadList
            title="Claim Requirements"
            documents={requirements}
          />
        ) : activeSection === "Earnings" ? (
          <EarningsPanel
            earnings={earnings}
            documents={claim.earningsDocuments}
          />
        ) : activeSection === "Claimant & Injury Details" ? (
          <ClaimantInjuryPanel
            key={isClaimantLoaded ? "loaded" : "loading"}
            details={claimantDetails}
            injuryDetails={injuryDetails}
            icdCodes={icdCodes}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
              {sectionHeadings[activeSection] ?? activeSection}
            </h2>

            {activeSection === "Employment" ? (
              <FieldGroupsPanel groups={employment} />
            ) : (
              claim.letters.map((letter) => (
                <DocumentRow key={letter.name} document={letter} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
