import PortalCard from "@/components/common/PortalCard";
import { ArrowUpRightIcon, quickActionIcons } from "@/components/common/icons";
import type { homeContent } from "@/content/site";

type QuickAction = (typeof homeContent)["quickActions"][number];

export default function QuickActionCard({
  icon,
  title,
  description,
  href,
  highlighted,
}: QuickAction) {
  return (
    <PortalCard
      icon={quickActionIcons[icon]}
      title={title}
      description={description}
      actionIcon={ArrowUpRightIcon}
      href={href}
      elevated={highlighted}
    />
  );
}
