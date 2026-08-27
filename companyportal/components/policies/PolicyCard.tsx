"use client";

import { useState } from "react";
import { CheckCircleIcon, DownloadIcon } from "@/components/home/icons";
import type {
  ApiLetterOfGoodStanding,
  ApiRemittanceDocument,
  Policy,
} from "@/content/policies";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { downloadBase64File } from "@/lib/utils/downloadFile";
import DownloadRemittanceModal, {
  type RemittanceDownloadFilters,
} from "@/components/policies/DownloadRemittanceModal";

/** yyyy-mm-dd (from the date input) -> RFC 3339 date-time the API expects. */
function toRfc3339(date: string, boundary: "start" | "end"): string {
  if (!date) return "";
  return boundary === "start"
    ? `${date}T00:00:00.000Z`
    : `${date}T23:59:59.999Z`;
}

const infoColumns = (
  policy: Policy,
): Array<{ label: string; value: string }> => [
  { label: "Product Option", value: policy.productOption },
  { label: "Annual Premium", value: policy.annualPremium },
  { label: "Premium", value: policy.premium },
  { label: "Inception Date", value: policy.inceptionDate },
  { label: "Expiry Date", value: policy.expiryDate },
];

export default function PolicyCard({ policy }: { policy: Policy }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const [downloadingAction, setDownloadingAction] = useState<string | null>(
    null,
  );
  const [isRemittanceModalOpen, setIsRemittanceModalOpen] = useState(false);

  async function handleRemittanceDownload(filters: RemittanceDownloadFilters) {
    if (!rolePlayerId) return;

    try {
      // paymentType isn't sent yet — the remittanceDocument endpoint doesn't
      // accept it until that backend change ships.
      const response = await apiService.get<ApiRemittanceDocument[]>(
        `/employer/${rolePlayerId}/remittanceDocument`,
        {
          token: token ?? undefined,
          params: {
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            policyId: policy.policyId,
            paymentType: filters.paymentType,
          },
        },
      );

      const remittance = response?.[0];
      if (!remittance?.base64Content) {
        throw new Error(
          `Unexpected remittance document response: ${JSON.stringify(response)}`,
        );
      }

      downloadBase64File(
        remittance.fileName,
        remittance.contentType,
        remittance.base64Content,
      );
    } catch (error) {
      console.error("Failed to download remittance document:", error);
      throw error;
    }
  }

  async function handleLetterOfGoodStandingDownload() {
    if (!rolePlayerId) return;

    setDownloadingAction("Letter of Good Standing");
    try {
      const response = await apiService.get<ApiLetterOfGoodStanding>(
        `/employer/${rolePlayerId}/letterOfGoodStanding`,
        { token: token ?? undefined },
      );

      const attachment = response?.attachments;
      if (!attachment?.content) {
        throw new Error(
          `Unexpected letter of good standing response: ${JSON.stringify(response)}`,
        );
      }

      downloadBase64File(
        attachment.fileName,
        attachment.fileType,
        attachment.content,
      );
    } catch (error) {
      console.error("Failed to download letter of good standing:", error);
    } finally {
      setDownloadingAction(null);
    }
  }

  const actionHandlers: Record<string, () => void> = {
    Remittance: () => setIsRemittanceModalOpen(true),
    "Letter of Good Standing": handleLetterOfGoodStandingDownload,
  };

  return (
    <article className="w-full rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-extrabold leading-[24px] text-[#13537B] sm:text-[18px] sm:leading-[27px]">
          {policy.title}
        </h3>
        {/* <pre>{JSON.stringify(policy, null, 2)}</pre> */}
        {policy.productStatus && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold leading-4 text-[#14B86A]">
            <CheckCircleIcon className="h-2.5 w-2.5" />
            {policy.productStatus}
          </span>
        )}
      </div>
      <p className="mt-1 text-[12.5px] font-normal leading-[19px] text-[#64748B]">
        Policy Number &middot; {policy.policyNumber}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {infoColumns(policy).map((column) => (
          <div key={column.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
              {column.label}
            </span>
            <span className="text-[13px] font-bold leading-5 text-[#13537B]">
              {column.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-black/5 pt-5">
        {policy.actions.map((action) => {
          const isDownloadingThis = downloadingAction === action;
          return (
            <button
              key={action}
              type="button"
              disabled={isDownloadingThis}
              onClick={actionHandlers[action]}
              className="inline-flex items-center gap-1.5 rounded-lg border cursor-pointer border-black/8 px-4 py-2 text-[12px] font-semibold leading-[18px] text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DownloadIcon className="h-[13px] w-[13px]" />
              {isDownloadingThis ? "Downloading..." : action}
            </button>
          );
        })}
      </div>

      <DownloadRemittanceModal
        open={isRemittanceModalOpen}
        onClose={() => setIsRemittanceModalOpen(false)}
        onDownload={handleRemittanceDownload}
      />
    </article>
  );
}
