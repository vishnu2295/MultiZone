"use client";

import { useState } from "react";

import { DownloadIcon, EyeIcon } from "@/components/common/icons";
import ChildExtensionModal from "@/components/pension/ChildExtensionModal";
import CommutationStatusModal from "@/components/pension/CommutationStatusModal";
import {
  childExtensionStatusFallbackStyle,
  childExtensionStatusStyle,
  pensionLedgerCardContent as content,
  PENSIONER_API_BASE_URL,
  type ApiCommutationDocument,
  type PensionLedgerEntry,
} from "@/content/pensionServices";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";
import { downloadBase64File } from "@/lib/utils/downloadFile";

type DownloadAction = "confirmationLetter" | "commutationForms";

function ActionButton({
  icon: Icon,
  label,
  loading,
  onClick,
}: {
  icon: typeof DownloadIcon;
  label: string;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#51B2E0]/25 bg-[#F0FAFE] px-4 py-2.5 text-[12.5px] font-semibold leading-[18px] text-[#13537B] transition hover:bg-[#51B2E0]/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-[15px] w-[15px] shrink-0" />
      {loading ? "Downloading..." : label}
    </button>
  );
}

/**
 * Consolidated pension case summary: claimant identity + status, a
 * collapsible metrics grid, and the four case actions (confirmation letter
 * and commutation forms downloads, commutation status and child pension
 * status dialogs). Composes ChildExtensionModal and CommutationStatusModal
 * rather than duplicating their fetch/dialog logic.
 */
export default function PensionLedgerCard({
  entry,
}: {
  entry: PensionLedgerEntry;
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [downloadingAction, setDownloadingAction] =
    useState<DownloadAction | null>(null);
  const [isCommutationModalOpen, setIsCommutationModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);

  async function handleConfirmationLetterDownload() {
    setDownloadingAction("confirmationLetter");
    try {
      const { coidId } = await getEmployeeCoidId();
      if (!coidId) return;

      const response = await apiService.post<ApiCommutationDocument>(
        "/individual/api/confirmationLetter",
        {
          pensionCaseId: entry.pensionCaseId,
          ledgerRecipientId: entry.ledgerRecipientId,
          recipientDisplayName: entry.recipientDisplayName,
        },
        { baseUrl: "", skipAuth: true, params: { rolePlayerId: coidId } },
      );

      downloadBase64File(
        response.fileName,
        response.contentType,
        response.base64Content,
      );
    } catch (error) {
      console.error("Failed to download confirmation letter:", error);
    } finally {
      setDownloadingAction(null);
    }
  }

  async function handleCommutationFormsDownload() {
    setDownloadingAction("commutationForms");
    try {
      const { token, coidId } = await getEmployeeCoidId();
      if (!coidId) return;

      const response = await apiService.get<ApiCommutationDocument>(
        `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/commutation/documents`,
        { token },
      );
      const fileName = response.fileName.toLowerCase().endsWith(".pdf")
        ? response.fileName
        : `${response.fileName}.pdf`;
      downloadBase64File(fileName, "application/pdf", response.base64Content);
    } catch (error) {
      console.error("Failed to download commutation forms:", error);
    } finally {
      setDownloadingAction(null);
    }
  }

  const statusStyle =
    childExtensionStatusStyle[entry.status] ??
    childExtensionStatusFallbackStyle;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[2.805px_2.805px_28.05px_0px_#122E4D0D] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[18px] font-bold leading-6 text-[#24577A]">
            {entry.claimantName}
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-normal leading-[15px] ${statusStyle}`}
          >
            {entry.status}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA]"
        >
          {showDetails ? (
            <img
              src="/individual/icons/hide.svg"
              alt="Show details"
              className="h-4 w-4"
            />
          ) : (
            <img
              src="/individual/icons/view.svg"
              alt="Hide details"
              className="h-4 w-4"
            />
          )}
          {showDetails ? content.hideDetailsLabel : content.showDetailsLabel}
        </button>
      </div>

      <p className="mt-2 text-[12.5px] leading-[19px] text-[#24577A]">
        {content.pensionCaseLabel} :{" "}
        <span className="font-bold">{entry.pensionCase}</span> ·{" "}
        {content.claimRefNoLabel} :{" "}
        <span className="font-bold">{entry.claimRefNo}</span> ·{" "}
        {content.benefitLabel} :{" "}
        <span className="font-bold">{entry.benefit}</span> ·{" "}
        {content.recipientLabel} :{" "}
        <span className="font-bold">{entry.recipient}</span>
      </p>

      {showDetails && (
        <>
          <span className="mt-4 block h-px w-full bg-black/5" aria-hidden />
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {entry.metrics.map((metric) => (
              <div key={metric.label} className="flex min-w-0 flex-col">
                <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#24577A99]">
                  {metric.label}
                </span>
                <span className="mt-0.5 break-words text-[13px] font-bold leading-5 text-[#24577A]">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <span className="mt-4 block h-px w-full bg-black/5" aria-hidden />

      <div className="mt-4 flex flex-wrap gap-2.5">
        <ActionButton
          icon={DownloadIcon}
          label={content.actions.confirmationLetter}
          loading={downloadingAction === "confirmationLetter"}
          onClick={handleConfirmationLetterDownload}
        />
        <ActionButton
          icon={DownloadIcon}
          label={content.actions.commutationForms}
          loading={downloadingAction === "commutationForms"}
          onClick={handleCommutationFormsDownload}
        />
        <ActionButton
          icon={EyeIcon}
          label={content.actions.commutationStatus}
          onClick={() => setIsCommutationModalOpen(true)}
        />
        <ActionButton
          icon={EyeIcon}
          label={content.actions.childPensionStatus}
          onClick={() => setIsChildModalOpen(true)}
        />
      </div>

      <CommutationStatusModal
        open={isCommutationModalOpen}
        onClose={() => setIsCommutationModalOpen(false)}
      />
      <ChildExtensionModal
        open={isChildModalOpen}
        onClose={() => setIsChildModalOpen(false)}
      />
    </div>
  );
}
