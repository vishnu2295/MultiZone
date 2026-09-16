const STEP_LABELS = ["Persona", "Identifier", "Password", "Verify"] as const;

type StepperProps = {
  /** 1-indexed current step. */
  currentStep: number;
};

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <ol className="flex w-full items-center">
      {STEP_LABELS.map((label, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isLast = step === STEP_LABELS.length;

        const circleClasses = isCompleted || isActive
          ? "bg-[linear-gradient(90deg,#0090B5_0%,#00BBE6_100%)] text-white border-transparent"
          : "bg-white text-[#98A2B3] border-[#E9E9E9]";

        return (
          <li key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={isActive ? "step" : undefined}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold transition ${circleClasses}`}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </span>
              <span
                className={`text-[11px] font-medium leading-none whitespace-nowrap ${
                  isActive ? "text-[#13537B]" : "text-[#98A2B3]"
                }`}
              >
                {label}
              </span>
            </div>

            {isLast ? null : (
              <div
                className={`mx-2 h-[2px] flex-1 rounded-full transition ${
                  isCompleted ? "bg-[#00BBE6]" : "bg-[#E9E9E9]"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
