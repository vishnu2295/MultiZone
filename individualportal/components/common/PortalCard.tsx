import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface PortalCardProps {
  /** 30x30 icon in the top-left corner. */
  icon: IconComponent;
  /** Card heading (Inter Light 22/24). */
  title: string;
  /** Body copy under the heading. Omit when passing `children` instead. */
  description?: string;
  /** Custom body content, used in place of `description` (e.g. a status line). */
  children?: ReactNode;
  /** Icon inside the round button in the bottom-right corner. */
  actionIcon: IconComponent;
  /**
   * Where the whole card navigates. Renders the card as a link; mutually
   * exclusive with `onClick`.
   */
  href?: string;
  /** Click handler for the whole card. Renders the card as a button. */
  onClick?: () => void;
  /**
   * Handler for the corner button alone — makes it a real <button> nested in a
   * static card (e.g. "download"). Requires `actionLabel`.
   */
  onActionClick?: () => void;
  /** Accessible label for the corner button when it is interactive. */
  actionLabel?: string;
  /** Keeps the raised shadow permanently instead of only on hover. */
  elevated?: boolean;
  /** Forwarded to the rendered element (e.g. aria-haspopup). */
  ariaHasPopup?: "dialog";
}

/**
 * The shared portal card: white 12px-radius surface, 30px icon top-left,
 * light 22px title, 12px body copy, and a round action button bottom-right.
 * Used by the dashboard quick actions and the pension services cards so all
 * cards stay pixel-identical.
 *
 * Geometry follows the Figma card spec (icon 18/20 inset, title 27px below the
 * icon, 231px copy column, 44px corner button inset 20px) expressed in normal
 * flow rather than absolute offsets, so multi-line titles and narrow viewports
 * still lay out correctly.
 */
export default function PortalCard({
  icon: Icon,
  title,
  description,
  children,
  actionIcon: ActionIcon,
  href,
  onClick,
  onActionClick,
  actionLabel,
  elevated = false,
  ariaHasPopup,
}: PortalCardProps) {
  // The card lifts and grows slightly on hover; `will-change-transform` keeps
  // the scale from resampling the text on every frame.
  const shell = `group relative flex h-[267px] w-full flex-col rounded-xl bg-white px-5 pb-5 pt-[18px] text-left transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] ${
    elevated
      ? "shadow-[13px_20px_28.05px_0px_#122E4D24]"
      : "shadow-[2.805px_2.805px_14.023px_0px_#122E4D0D] hover:shadow-[13px_20px_28.05px_0px_#122E4D24]"
  }`;

  const bubble =
    "absolute bottom-5 right-5 flex items-center justify-center rounded-full bg-[#F3F7FA] p-[10px] transition group-hover:bg-[#13537B]/10";

  const body = (
    <>
      <Icon className="h-[30px] w-[30px] text-[#13537B]" />

      <h3 className="mt-[27px] text-[22px] font-light leading-6 tracking-[-0.2824px] text-[#13537B]">
        {title}
      </h3>

      {children ?? (
        <p className="mt-2 max-w-[231px] text-[12px] font-light leading-5 tracking-[-0.1412px] text-[#3C5564]">
          {description}
        </p>
      )}

      {onActionClick ? (
        <button
          type="button"
          aria-label={actionLabel}
          onClick={onActionClick}
          className={bubble}
        >
          <ActionIcon className="h-6 w-6 text-[#13537B]" />
        </button>
      ) : (
        <span className={bubble}>
          <ActionIcon className="h-6 w-6 text-[#13537B]" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={shell}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-haspopup={ariaHasPopup}
        className={shell}
      >
        {body}
      </button>
    );
  }

  return <div className={shell}>{body}</div>;
}
