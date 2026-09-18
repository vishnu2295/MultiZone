type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  /** e.g. "Step 2/3"; omitted for login/welcome. */
  stepLabel?: string;
  /** Plain neutral divider line, shown below the title/subtitle. */
  divider?: boolean;
};

export default function AuthHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  stepLabel,
  divider,
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {onBack || stepLabel ? (
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-[#13537B] transition hover:opacity-70"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {stepLabel ? (
            <span className="text-[12px] font-semibold text-[#13537B]">{stepLabel}</span>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-[#13537B]">{title}</h1>
        {subtitle ? <p className="text-[13px] text-[#667085]">{subtitle}</p> : null}
      </div>

      {divider ? <div className="h-px w-full bg-[#E9E9E9]" /> : null}
    </div>
  );
}
