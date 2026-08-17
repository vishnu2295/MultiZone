"use client";

import { useState } from "react";

import PortalCard from "@/components/common/PortalCard";
import {
  ArrowUpRightIcon,
  DocumentIcon,
  DownloadIcon,
  MonitorIcon,
  UsersIcon,
} from "@/components/common/icons";
import ChildExtensionModal from "@/components/pension/ChildExtensionModal";
import { pensionServiceCards } from "@/content/pensionServices";

const cardIcons = {
  monitor: MonitorIcon,
  document: DocumentIcon,
  users: UsersIcon,
};

export default function PensionServiceCards() {
  const [isChildExtensionOpen, setIsChildExtensionOpen] = useState(false);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-[1000px]">
        {pensionServiceCards.map((card) => {
          const shared = {
            icon: cardIcons[card.icon],
            title: card.title,
            description: card.description,
            // Commutation Status shows a highlighted status line instead of copy.
            children: card.status ? (
              <p className="mt-2 max-w-[231px] text-[12px] font-semibold leading-5 text-[#C0392B]">
                {card.status.label} :{" "}
                <span className="font-bold">{card.status.value}</span>
              </p>
            ) : undefined,
          };

          if (card.action === "download") {
            return (
              <PortalCard
                key={card.id}
                {...shared}
                actionIcon={DownloadIcon}
                // Mock only: no letter to serve yet. Wire this to the document
                // endpoint when it is available.
                onActionClick={() => {}}
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
