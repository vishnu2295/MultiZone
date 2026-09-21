"use client";

import { useEffect, useState } from "react";
import { MailIcon, PhoneIcon, PinIcon, UserIcon } from "@/components/home/icons";
import { type EditableAddress } from "@/components/company-details/EditAddressModal";
import { type EditableContact } from "@/components/company-details/EditContactModal";
import IcdCodeCard from "@/components/claim-details/panels/IcdCodeCard";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  claimantTabs,
  mapApiClaimantDetails,
  mapApiIcdCodes,
  mapApiInjuryDetails,
  type ApiClaimantContact,
  type ApiClaimantDetailsResponse,
  type ApiIcdCode,
  type ApiInjuryDetailsResponse,
  type ClaimIcdCode,
  type ClaimantDetails,
  type ClaimantTab,
} from "@/content/claimDetails";
import type { ApiClaim } from "@/content/claims";
import { useSearchParams } from "next/dist/client/components/navigation";

function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
      <div className="flex flex-col gap-5">
        {title && (
          <h3 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
            {title}
          </h3>
        )}
        {children}
      </div>
    </section>
  );
}

function FieldGrid({
  fields,
}: {
  fields: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => (
        <div key={field.label} className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#24577A] opacity-60">
            {field.label}
          </span>
          <span className="pt-0.5 text-[13px] font-bold leading-5 text-[#24577A]">
            {field.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PrimaryPill() {
  return (
    <span className="rounded-full bg-[#07C1E9] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-white">
      Primary
    </span>
  );
}

type ContactRow = Omit<EditableContact, "raw"> & {
  primary?: boolean;
  rolePlayerId?: number;
  isContactConfirmed?: boolean;
  raw?: ApiClaimantContact;
};
type AddressRow = EditableAddress & { primary?: boolean };

function ClaimantInjuryPanelContent({
  details,
  injuryDetails,
  icdCodes,
}: {
  details: ClaimantDetails;
  injuryDetails: Array<{ label: string; value: string }>;
  icdCodes: ClaimIcdCode[];
}) {
  const [activeTab, setActiveTab] = useState<ClaimantTab>(claimantTabs[0]);

  const [contacts] = useState<ContactRow[]>(() =>
    details.contacts.map((contact) => ({ ...contact, badge: "Primary" })),
  );
  const [addresses] = useState<AddressRow[]>(() =>
    details.addresses.map((address) => ({
      ...address,
      type: address.type as EditableAddress["type"],
    })),
  );

  return (
    <div className="flex flex-col gap-6 py-2.5">
      <div className="-mx-4 flex scrollbar-none items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:sticky lg:top-18 lg:z-20 lg:bg-[#F3F7FA] lg:py-2">
        {claimantTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border-[0.625px] border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        {activeTab}
      </h2>

      {activeTab === "Claimant Details" && (
        <div className="flex flex-col gap-6">
          <SectionCard title="Demographics">
            <FieldGrid fields={details.demographics} />
          </SectionCard>

          <SectionCard title="Contacts">
            <div className="flex flex-col gap-3">
              {contacts.length === 0 && (
                <p className="text-center text-[13px] font-normal text-[#64748B]">
                  No records found.
                </p>
              )}
              {contacts.map((contact, index) => (
                <div
                  key={`${contact.email}-${index}`}
                  className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex items-start gap-2">
                      <UserIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-[#00BBE6]" />

                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                          {contact.name}
                        </span>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#13537B]">
                            <MailIcon className="h-[13px] w-[13px] shrink-0 text-[#4B7B8C]" />
                            {contact.email}
                          </span>
                          <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#13537B]">
                            <PhoneIcon className="h-[13px] w-[13px] shrink-0" />
                            {contact.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {contact.primary && <PrimaryPill />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Address Details">
            <div className="flex flex-col gap-3">
              {addresses.length === 0 && (
                <p className="text-center text-[13px] font-normal text-[#64748B]">
                  No records found.
                </p>
              )}
              {addresses.map((address, index) => (
                <div
                  key={`${address.type}-${index}`}
                  className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex items-start gap-2">
                      <PinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#07C1E9]" />

                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                          {address.type}
                        </span>
                        <span className="text-[13.5px] font-normal leading-[22px] text-[#13537B]">
                          {address.line}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {address.primary && <PrimaryPill />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "Injury Details" && (
        <SectionCard>
          <FieldGrid fields={injuryDetails} />
        </SectionCard>
      )}

      {activeTab === "ICD 10 Codes" && (
        <div className="flex flex-col gap-4">
          {icdCodes.length === 0 ? (
            <p className="text-center text-[13px] font-normal text-[#64748B]">
              No records found.
            </p>
          ) : (
            icdCodes.map((icdCode, index) => (
              <IcdCodeCard key={`${icdCode.code}-${index}`} icdCode={icdCode} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

const EMPTY_CLAIMANT_DETAILS: ClaimantDetails = {
  demographics: [],
  contacts: [],
  addresses: [],
};

export default function ClaimantInjuryPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const [details, setDetails] = useState<ClaimantDetails>(
    EMPTY_CLAIMANT_DETAILS,
  );
  const [injuryDetails, setInjuryDetails] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [icdCodes, setIcdCodes] = useState<ClaimIcdCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!token || !rolePlayerId || !ref) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadClaimantInjury() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });

        const [claimantResponse, injuryResponse, icdCodesResponse] =
          await Promise.all([
            apiService.get<ApiClaimantDetailsResponse>(
              `/employer/${rolePlayerId}/claimant/${claim.claimantId}`,
              { token: token ?? undefined },
            ),
            apiService.get<ApiInjuryDetailsResponse>(
              `/employer/${rolePlayerId}/injury/${claimId}`,
              { token: token ?? undefined },
            ),
            apiService.get<ApiIcdCode[]>(`/employer/${rolePlayerId}/icd10codes/${claimId}`, {
              token: token ?? undefined,
            }),
          ]);

        if (!cancelled) {
          setDetails(mapApiClaimantDetails(claimantResponse));
          setInjuryDetails(mapApiInjuryDetails(injuryResponse));
          setIcdCodes(mapApiIcdCodes(icdCodesResponse));
        }
      } catch (error) {
        console.error("Failed to load claimant/injury details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadClaimantInjury();
    return () => {
      cancelled = true;
    };
  }, [claimId, ref, rolePlayerId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <ClaimantInjuryPanelContent
      details={details}
      injuryDetails={injuryDetails}
      icdCodes={icdCodes}
    />
  );
}
