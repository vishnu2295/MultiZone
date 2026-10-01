"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { PersonaConfig } from "@/lib/personas";
import { PERSONAS } from "@/lib/personas";

type WelcomeStepProps = {
  mode: "login" | "signup";
  onSelectPersona: (persona: PersonaConfig) => void;
  onSwitchMode: () => void;
  /** Persona picked before navigating away and back - preselects it. */
  initialPersona?: PersonaConfig | null;
};

// Brokers log in through their own app (CCFE under /broker), not this
// modal's Cognito flow, so it's a login-only option that just navigates there.
const BROKER_LOGIN_HREF = "/broker";

const optionClass = (isSelected: boolean) =>
  `w-full cursor-pointer rounded-xl px-5 py-4 text-center text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bbe6] ${
    isSelected
      ? "bg-[#E5F6FB] text-[#13537B] ring-2 ring-inset ring-[#00BBE6]"
      : "bg-[#F0F5F8] text-[#13537B] hover:bg-[#E5F6FB]"
  }`;

export default function WelcomeStep({
  mode,
  onSelectPersona,
  onSwitchMode,
  initialPersona = null,
}: WelcomeStepProps) {
  const [choice, setSelected] = useState<PersonaConfig | "broker" | null>(
    initialPersona,
  );
  // Broker is only offered on login - drop it if the user switches to sign-up.
  const selected = mode === "signup" && choice === "broker" ? null : choice;

  function handleNext(event: React.FormEvent) {
    event.preventDefault();
    if (selected === "broker") {
      window.location.href = BROKER_LOGIN_HREF;
    } else if (selected) {
      onSelectPersona(selected);
    }
  }

  return (
    <form onSubmit={handleNext} className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-[#13537B]">
          {mode === "signup"
            ? "Let's get you signed up!"
            : "Let's get you signed in!"}
        </h1>
        <p className="text-[13px] text-[#667085]">
          {mode === "signup"
            ? "Let us know you better, please tell us who you are!"
            : "Let us know you better, please tell us who you are, so we can log you in."}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {Object.values(PERSONAS).map((persona) => {
          const isSelected =
            selected !== "broker" && selected?.slug === persona.slug;
          return (
            <button
              key={persona.slug}
              type="button"
              onClick={() => setSelected(persona)}
              aria-pressed={isSelected}
              className={optionClass(isSelected)}
            >
              {persona.label}
            </button>
          );
        })}
        {mode === "login" ? (
          <button
            type="button"
            onClick={() => setSelected("broker")}
            aria-pressed={selected === "broker"}
            className={optionClass(selected === "broker")}
          >
            Broker
          </button>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={!selected}
        className="mt-auto w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </Button>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-[13px] text-[#667085]">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchMode}
                className="cursor-pointer font-semibold text-[#13537B] underline hover:opacity-70"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={onSwitchMode}
                className="cursor-pointer font-semibold text-[#13537B] underline hover:opacity-70"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
