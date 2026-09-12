"use client";

import { useEffect, useState } from "react";
import {
  mapApiAddress,
  type ApiAddressDetails,
  type ApiPagedResponse,
} from "@/content/companyDetails";
import { EditIcon, PinIcon, TrashIcon } from "@/components/home/icons";
import EditAddressModal, {
  toApiAddressDetails,
  type EditableAddress,
} from "@/components/company-details/EditAddressModal";
import DeleteConfirmModal from "@/components/company-details/DeleteConfirmModal";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

function AddressRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-9 w-20 shrink-0 rounded-md" />
    </div>
  );
}

export default function AddressPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [addresses, setAddresses] = useState<EditableAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;

    async function loadAddress() {
      try {
        const response = await apiService.get<
          ApiPagedResponse<ApiAddressDetails>
        >(`/employer/${rolePlayerId}/addressDetails`, {
          token: token ?? undefined,
        });

        if (!cancelled) {
          setAddresses(
            response.data.map(mapApiAddress).filter((item) => !item.isDeleted),
          );
        }
      } catch (error) {
        console.error("Failed to load address details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAddress();
    return () => {
      cancelled = true;
    };
  }, [rolePlayerId, token]);

  const editingAddress = editingIndex !== null ? addresses[editingIndex] : null;
  const deletingAddress =
    deletingIndex !== null ? addresses[deletingIndex] : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 2 }).map((_, index) => (
          <AddressRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {addresses.map((address, index) => (
        <div
          key={`${address.type}-${index}`}
          className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <PinIcon className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#07C1E9]" />
            <div className="flex flex-col">
              <span className="text-[13.5px] font-heading font-bold leading-[22px] text-[#24577A]">
                {address.type}
              </span>
              <span className="text-[13.5px] font-normal leading-[22px] text-[#24577A] opacity-80">
                {address.line}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {address.primary && (
              <span className="rounded-full bg-[#51B2E0] px-3 py-1 text-[12px] leading-[15px] text-white">
                Primary
              </span>
            )}
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

      <EditAddressModal
        key={editingIndex ?? "closed"}
        open={editingIndex !== null}
        address={editingAddress}
        onClose={() => setEditingIndex(null)}
        onSave={async (updated) => {
          if (editingIndex === null || !rolePlayerId) return;
          try {
            await apiService.put(
              `/employer/${rolePlayerId}/addressDetails`,
              { addressDetails: toApiAddressDetails(updated) },
              { token: token ?? undefined },
            );

            setAddresses((prev) =>
              prev.map((item, index) =>
                index === editingIndex ? updated : item,
              ),
            );
            setEditingIndex(null);
          } catch (error) {
            console.error("Failed to update address:", error);
          }
        }}
      />

      <DeleteConfirmModal
        open={deletingIndex !== null}
        title="Delete Address"
        description={
          deletingAddress ? (
            <>
              Are you sure you want to remove the{" "}
              <span className="font-semibold text-[#13537B]">
                {deletingAddress.type}
              </span>{" "}
              address? This action cannot be undone.
            </>
          ) : null
        }
        onCancel={() => setDeletingIndex(null)}
        onConfirm={async () => {
          if (deletingIndex === null || !rolePlayerId) return;
          const deleted = { ...addresses[deletingIndex], isDeleted: true };
          try {
            await apiService.put(
              `/employer/${rolePlayerId}/addressDetails`,
              toApiAddressDetails(deleted),
              { token: token ?? undefined },
            );

            setAddresses((prev) =>
              prev.filter((_, index) => index !== deletingIndex),
            );
            setDeletingIndex(null);
          } catch (error) {
            console.error("Failed to delete address:", error);
          }
        }}
      />
    </div>
  );
}
