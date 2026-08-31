"use client";

import { useEffect, useState } from "react";
import {
  EditIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TrashIcon,
  UserIcon,
} from "@/components/home/icons";
import DeleteConfirmModal from "@/components/company-details/DeleteConfirmModal";
import EditAddressModal, {
  type EditableAddress,
} from "@/components/company-details/EditAddressModal";
import EditContactModal, {
  type EditableContact,
} from "@/components/company-details/EditContactModal";
import IcdCodeCard from "@/components/claim-details/panels/IcdCodeCard";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  claimantTabs,
  mapApiClaimantDetails,
  mapApiIcdCodes,
  mapApiInjuryDetails,
  type ApiClaimantDetailsResponse,
  type ApiIcdCode,
  type ApiInjuryDetailsResponse,
  type ClaimIcdCode,
  type ClaimantDetails,
  type ClaimantTab,
} from "@/content/claimDetails";

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
          <h3 className="text-[16px] font-bold leading-[19px] text-[#24577A]">{title}</h3>
        )}
        {children}
      </div>
    </section>
  );
}

function FieldGrid({ fields }: { fields: Array<{ label: string; value: string }> }) {
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

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Edit ${label}`}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded border-[0.625px] border-[rgba(7,193,233,0.12)] bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#E4F5FC]"
    >
      <EditIcon className="h-[13px] w-[13px]" />
      Edit
    </button>
  );
}

type ContactRow = EditableContact & { primary?: boolean };
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

  const [contacts, setContacts] = useState<ContactRow[]>(() =>
    details.contacts.map((contact) => ({ ...contact, badge: "Primary" })),
  );
  const [addresses, setAddresses] = useState<AddressRow[]>(() =>
    details.addresses.map((address) => ({
      ...address,
      type: address.type as EditableAddress["type"],
    })),
  );

  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
  const [deletingContactIndex, setDeletingContactIndex] = useState<number | null>(null);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  const editingContact =
    editingContactIndex !== null ? contacts[editingContactIndex] : null;
  const deletingContact =
    deletingContactIndex !== null ? contacts[deletingContactIndex] : null;
  const editingAddress =
    editingAddressIndex !== null ? addresses[editingAddressIndex] : null;

  return (
    <div className="flex flex-col gap-6 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        {claimantTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border-[0.625px] border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">{activeTab}</h2>

      {activeTab === "Claimant Details" && (
        <div className="flex flex-col gap-6">
          <SectionCard title="Demographics">
            <FieldGrid fields={details.demographics} />
          </SectionCard>

          <SectionCard title="Contacts">
            <div className="flex flex-col gap-3">
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
                      <EditButton
                        label={contact.name}
                        onClick={() => setEditingContactIndex(index)}
                      />
                      <button
                        type="button"
                        aria-label={`Delete ${contact.name}`}
                        onClick={() => setDeletingContactIndex(index)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded border-[0.625px] border-[rgba(233,7,7,0.12)] bg-[#FFF6F6] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#FFECEC]"
                      >
                        <TrashIcon className="h-4 w-4 text-[#E77B7B]" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Address Details">
            <div className="flex flex-col gap-3">
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
                      <EditButton
                        label={`${address.type} address`}
                        onClick={() => setEditingAddressIndex(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <EditContactModal
            key={`contact-${editingContactIndex ?? "closed"}`}
            open={editingContactIndex !== null}
            contact={editingContact}
            onClose={() => setEditingContactIndex(null)}
            onSave={(updated) => {
              if (editingContactIndex === null) return;
              setContacts((prev) =>
                prev.map((item, index) =>
                  index === editingContactIndex
                    ? { ...updated, primary: item.primary }
                    : item,
                ),
              );
              setEditingContactIndex(null);
            }}
          />

          <DeleteConfirmModal
            open={deletingContactIndex !== null}
            title="Delete Contact"
            description={
              deletingContact ? (
                <>
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-[#13537B]">
                    {deletingContact.name.replace(/^\w+\.?\s+/, "")}
                  </span>
                  ? This action cannot be undone.
                </>
              ) : null
            }
            onCancel={() => setDeletingContactIndex(null)}
            onConfirm={() => {
              if (deletingContactIndex === null) return;
              setContacts((prev) =>
                prev.filter((_, index) => index !== deletingContactIndex),
              );
              setDeletingContactIndex(null);
            }}
          />

          <EditAddressModal
            key={`address-${editingAddressIndex ?? "closed"}`}
            open={editingAddressIndex !== null}
            address={editingAddress}
            onClose={() => setEditingAddressIndex(null)}
            onSave={(updated) => {
              if (editingAddressIndex === null) return;
              setAddresses((prev) =>
                prev.map((item, index) =>
                  index === editingAddressIndex
                    ? { ...updated, primary: item.primary }
                    : item,
                ),
              );
              setEditingAddressIndex(null);
            }}
          />
        </div>
      )}

      {activeTab === "Injury Details" && (
        <SectionCard>
          <FieldGrid fields={injuryDetails} />
        </SectionCard>
      )}

      {activeTab === "ICD 10 Codes" && (
        <div className="flex flex-col gap-4">
          {icdCodes.map((icdCode, index) => (
            <IcdCodeCard key={`${icdCode.code}-${index}`} icdCode={icdCode} />
          ))}
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
  const { token } = useCompanyProfile();
  const [details, setDetails] = useState<ClaimantDetails>(EMPTY_CLAIMANT_DETAILS);
  const [injuryDetails, setInjuryDetails] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [icdCodes, setIcdCodes] = useState<ClaimIcdCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadClaimantInjury() {
      try {
        const [claimantResponse, injuryResponse, icdCodesResponse] =
          await Promise.all([
            apiService.get<ApiClaimantDetailsResponse>(
              `/employer/claimant/${claimId}`,
              { token: token ?? undefined },
            ),
            apiService.get<ApiInjuryDetailsResponse>(
              `/employer/injury/${claimId}`,
              { token: token ?? undefined },
            ),
            apiService.get<ApiIcdCode[]>(`/employer/icd10codes/${claimId}`, {
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
  }, [claimId, token]);

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
