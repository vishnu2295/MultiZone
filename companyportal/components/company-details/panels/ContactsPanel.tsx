"use client";

import { useEffect, useState } from "react";
import {
  mapApiContact,
  type ApiContactDetails,
  type ApiPagedResponse,
} from "@/content/companyDetails";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  EditIcon,
  TrashIcon,
} from "@/components/home/icons";
import EditContactModal, {
  toApiContactUpdateRequest,
  type EditableContact,
} from "@/components/company-details/EditContactModal";
import DeleteConfirmModal from "@/components/company-details/DeleteConfirmModal";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { computePageCount } from "@/lib/utils/pagination";

function ContactRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Skeleton className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function ContactsPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [contacts, setContacts] = useState<EditableContact[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadContactDetails() {
      try {
        const response = await apiService.get<ApiPagedResponse<ApiContactDetails>>(
          `/employer/${rolePlayerId}/contactDetails`,
          { token: token ?? undefined, params: { page, pageSize: PAGE_SIZE } },
        );

        if (!cancelled) {
          setContacts(response.data.map(mapApiContact));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load contact details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadContactDetails();
    return () => {
      cancelled = true;
    };
  }, [page, rolePlayerId, token]);

  const editingContact = editingIndex !== null ? contacts[editingIndex] : null;
  const deletingContact =
    deletingIndex !== null ? contacts[deletingIndex] : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <ContactRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {contacts.length === 0 && (
        <div className="rounded-xl bg-white p-3 text-center text-[13.5px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          There are no contacts to display.
        </div>
      )}
      {contacts.map((contact, index) => (
        <div
          key={`${contact.email}-${index}`}
          className="flex flex-col gap-3 rounded-xl bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <UserIcon className="mt-1 h-[14px] w-[14px] shrink-0 text-[#24577A]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-semibold leading-[22px] text-[#24577A]">
                {contact.name}
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#24577A] opacity-80">
                  <MailIcon className="h-[13px] w-[13px] shrink-0" />
                  {contact.email}
                </span>
                <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#24577A] opacity-80">
                  <PhoneIcon className="h-[13px] w-[13px] shrink-0" />
                  {contact.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-[#51B2E0] px-3 py-1 text-[12px] font-bold leading-[15px] text-white">
              {contact.badge}
            </span>
            <button
              type="button"
              onClick={() => setEditingIndex(index)}
              className="flex items-center cursor-pointer gap-1.5 rounded-md border border-[#07C1E9]/12 bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#07C1E9]/10"
            >
              <EditIcon className="h-[13px] w-[13px]" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeletingIndex(index)}
              className="flex items-center cursor-pointer gap-1.5 rounded-md border border-[#E90707]/12 bg-[#FFF6F6] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#CB1334E5] transition hover:bg-[#E90707]/10"
            >
              <TrashIcon className="h-4 w-4 text-[#E77B7B]" />
              Delete
            </button>
          </div>
        </div>
      ))}

      {contacts.length > 0 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}

      <EditContactModal
        key={editingIndex ?? "closed"}
        open={editingIndex !== null}
        contact={editingContact}
        onClose={() => setEditingIndex(null)}
        onSave={async (updated) => {
          if (editingIndex === null) return;
          try {
            await apiService.put(
              "/company/api/contacts",
              toApiContactUpdateRequest(updated),
              { baseUrl: "", skipAuth: true },
            );

            setContacts((prev) =>
              prev.map((item, index) =>
                index === editingIndex ? updated : item,
              ),
            );
            setEditingIndex(null);
          } catch (error) {
            console.error("Failed to update contact:", error);
          }
        }}
      />

      <DeleteConfirmModal
        open={deletingIndex !== null}
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
        onCancel={() => setDeletingIndex(null)}
        onConfirm={() => {
          if (deletingIndex === null) return;
          setContacts((prev) =>
            prev.filter((_, index) => index !== deletingIndex),
          );
          setDeletingIndex(null);
        }}
      />
    </div>
  );
}
