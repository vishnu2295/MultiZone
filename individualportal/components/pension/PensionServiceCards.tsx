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
  mapCommutationValidation,
  pensionServiceCards,
  PENSIONER_API_BASE_URL,
  type ApiCommutationValidation,
  type CommutationEligibility,
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
  const [commutationEligibility, setCommutationEligibility] =
    useState<CommutationEligibility | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCommutationEligibility() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const validation = await apiService.get<ApiCommutationValidation>(
          `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/commutation/validate`,
          { token },
        );

        if (!cancelled) {
          setCommutationEligibility(mapCommutationValidation(validation));
        }
      } catch (error) {
        console.error("Failed to load commutation eligibility:", error);
        if (!cancelled) {
          setCommutationEligibility({
            isEligible: false,
            availableAmount: "N/A",
          });
        }
      }
    }

    loadCommutationEligibility();
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
              <div className="mt-2 max-w-[231px]">
                <p
                  className={`text-[12px] font-semibold leading-5 ${
                    isCommutationCard
                      ? commutationEligibility?.isEligible
                        ? "text-[#10AD5E]"
                        : "text-[#C0392B]"
                      : "text-[#C0392B]"
                  }`}
                >
                  {card.status.label} :{" "}
                  {isCommutationCard && commutationEligibility === null ? (
                    <Skeleton className="h-3.5 w-16 align-middle" />
                  ) : (
                    <span className="font-bold">
                      {isCommutationCard
                        ? commutationEligibility?.isEligible
                          ? "Eligible"
                          : "Pending"
                        : card.status.value}
                    </span>
                  )}
                </p>
                {isCommutationCard && (
                  <p className="mt-1 text-[11px] font-medium leading-4 text-[#58585B]">
                    {commutationEligibility === null ? (
                      <Skeleton className="h-3 w-28" />
                    ) : (
                      <>Available {commutationEligibility.availableAmount}</>
                    )}
                  </p>
                )}
              </div>
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
