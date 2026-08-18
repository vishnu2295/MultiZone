"use client";

import { useEffect, useState } from "react";

import PortalCard from "@/components/common/PortalCard";
import {
  ArrowUpRightIcon,
  DocumentIcon,
  DownloadIcon,
  MonitorIcon,
  UsersIcon,
} from "@/components/common/icons";
import ChildExtensionModal from "@/components/pension/ChildExtensionModal";
import {
  mapCommutationStatus,
  pensionServiceCards,
  PENSIONER_API_BASE_URL,
  type ApiCommutationDetails,
} from "@/content/pensionServices";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";
import { downloadFile } from "@/lib/utils/downloadFile";

const cardIcons = {
  monitor: MonitorIcon,
  document: DocumentIcon,
  users: UsersIcon,
};

export default function PensionServiceCards() {
  const [isChildExtensionOpen, setIsChildExtensionOpen] = useState(false);
  const [commutationStatus, setCommutationStatus] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadCommutationStatus() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const details = await apiService.get<ApiCommutationDetails>(
          `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/commutationDetails`,
          { token },
        );

        if (!cancelled) setCommutationStatus(mapCommutationStatus(details));
      } catch (error) {
        console.error("Failed to load commutation status:", error);
        if (!cancelled) setCommutationStatus("N/A");
      }
    }

    loadCommutationStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-[1000px]">
        {pensionServiceCards.map((card) => {
          const isCommutationCard = card.id === "commutation-status";

          const shared = {
            icon: cardIcons[card.icon],
            title: card.title,
            description: card.description,
            // Commutation Status shows a highlighted status line instead of copy.
            children: card.status ? (
              <p className="mt-2 max-w-[231px] text-[12px] font-semibold leading-5 text-[#C0392B]">
                {card.status.label} :{" "}
                {isCommutationCard && commutationStatus === null ? (
                  <Skeleton className="h-3.5 w-16 align-middle" />
                ) : (
                  <span className="font-bold">
                    {isCommutationCard ? commutationStatus : card.status.value}
                  </span>
                )}
              </p>
            ) : undefined,
          };

          if (card.action === "download") {
            return (
              <PortalCard
                key={card.id}
                {...shared}
                actionIcon={DownloadIcon}
                onActionClick={async () => {
                  try {
                    const { token, coidId } = await getEmployeeCoidId();
                    if (!coidId) return;

                    await downloadFile(
                      `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/confirmationLetter`,
                      "PensionConfirmationLetter.pdf",
                      { token },
                    );
                  } catch (error) {
                    console.error(
                      "Failed to download pension confirmation letter:",
                      error,
                    );
                  }
                }}
                actionLabel={`Download ${card.title}`}
              />
            );
          }

          if (card.action === "modal") {
            return (
              <PortalCard
                key={card.id}
                {...shared}
                actionIcon={ArrowUpRightIcon}
                onClick={() => setIsChildExtensionOpen(true)}
                ariaHasPopup="dialog"
              />
            );
          }

          return (
            <PortalCard
              key={card.id}
              {...shared}
              actionIcon={ArrowUpRightIcon}
              href={card.href ?? "#"}
            />
          );
        })}
      </div>

      <ChildExtensionModal
        open={isChildExtensionOpen}
        onClose={() => setIsChildExtensionOpen(false)}
      />
    </>
  );
}
