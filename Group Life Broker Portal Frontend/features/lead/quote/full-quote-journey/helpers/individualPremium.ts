import type { Employee } from "./utils";
import type {
  IndividualPremiumRequest,
  IndividualPremiumResponse,
} from "@/lib/api/products";

export const MAX_COVER_AMOUNT = 2_000_000;

export const CORE_BENEFIT_UUIDS = {
  funeral: "714111A3-23A2-4C2A-8671-CB24D4B5EB51",
  life: "D6DE28A9-E50A-4C2C-B684-7605A8EAC30A",
  occupationalDisability: "1669FA08-4F9E-4A46-9EA3-C0A7A4B47D9D",
} as const;

const BENEFIT_META: Record<
  string,
  { benefit_name: string; benefit_type: string }
> = {
  [CORE_BENEFIT_UUIDS.life.toLowerCase()]: {
    benefit_name: "Life",
    benefit_type: "Life",
  },
  [CORE_BENEFIT_UUIDS.occupationalDisability.toLowerCase()]: {
    benefit_name: "Occupational Disability",
    benefit_type: "Occupational Disability",
  },
  [CORE_BENEFIT_UUIDS.funeral.toLowerCase()]: {
    benefit_name: "Funeral",
    benefit_type: "Funeral",
  },
};

/** True when id looks like a persisted UUID (not a local random id). */
export function isPersonUuid(id?: string): boolean {
  if (!id) return false;
  return id.includes("-") && id.length >= 20;
}

export function calculateAgeFromDob(dob?: string): number {
  if (!dob) return 35;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return 35;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age > 0 ? age : 35;
}

/** Male = 1, Female = 2. Returns null when gender is missing/unsupported. */
export function mapGenderCode(gender?: string): 1 | 2 | null {
  const g = (gender || "").trim().toLowerCase();
  if (g.startsWith("m")) return 1;
  if (g.startsWith("f")) return 2;
  return null;
}

export function parseMonthlySalary(employee: Employee): number {
  const raw = String(employee.salary || "0").replace(
    /[^0-9.]/g,
    ""
  );
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function cappedMultipleBenefitAmount(
  monthlySalary: number,
  multiple: number
): number {
  if (monthlySalary <= 0 || multiple <= 0) return 0;
  return Math.min(monthlySalary * 12 * multiple, MAX_COVER_AMOUNT);
}

export interface MultipleCoverSelection {
  lifeCover: number;
  occupationalDisability: number;
  funeralCover: number;
}

/**
 * One object per employee × selected core product (VAPs ignored).
 */
export function buildIndividualPremiumPayload(
  employees: Employee[],
  selection: MultipleCoverSelection
): IndividualPremiumRequest[] {
  const selectedBenefits: {
    benefitUuid: string;
    benefitAmountFor: (emp: Employee) => number;
  }[] = [];

  if (selection.lifeCover > 0) {
    selectedBenefits.push({
      benefitUuid: CORE_BENEFIT_UUIDS.life,
      benefitAmountFor: (emp) =>
        cappedMultipleBenefitAmount(
          parseMonthlySalary(emp),
          selection.lifeCover
        ),
    });
  }

  if (selection.occupationalDisability > 0) {
    selectedBenefits.push({
      benefitUuid: CORE_BENEFIT_UUIDS.occupationalDisability,
      benefitAmountFor: (emp) =>
        cappedMultipleBenefitAmount(
          parseMonthlySalary(emp),
          selection.occupationalDisability
        ),
    });
  }

  if (selection.funeralCover > 0) {
    selectedBenefits.push({
      benefitUuid: CORE_BENEFIT_UUIDS.funeral,
      benefitAmountFor: () => selection.funeralCover,
    });
  }

  if (selectedBenefits.length === 0) return [];

  const payload: IndividualPremiumRequest[] = [];

  for (const employee of employees) {
    if (!isPersonUuid(employee.id)) continue;

    const gender = mapGenderCode(employee.gender);
    if (gender == null) continue;

    const age = calculateAgeFromDob(employee.dob);

    for (const benefit of selectedBenefits) {
      const benefitAmount = benefit.benefitAmountFor(employee);
      if (benefitAmount <= 0) continue;

      payload.push({
        benefitUuid: benefit.benefitUuid,
        personUuid: employee.id,
        benefitAmount,
        age,
        gender,
      });
    }
  }

  return payload;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function aggregateIndividualPremiums(
  responses: IndividualPremiumResponse[]
): {
  lifePremium: number;
  odPremium: number;
  funeralPremium: number;
  benefitBreakdown: {
    benefit_id: string;
    benefit_name: string;
    benefit_type: string;
    premium_amount: number;
    cover_amount?: number;
  }[];
  totalMonthlyPremium: number;
} {
  const lifeKey = CORE_BENEFIT_UUIDS.life.toLowerCase();
  const odKey = CORE_BENEFIT_UUIDS.occupationalDisability.toLowerCase();
  const funeralKey = CORE_BENEFIT_UUIDS.funeral.toLowerCase();

  let lifePremium = 0;
  let odPremium = 0;
  let funeralPremium = 0;
  let lifeCoverTotal = 0;
  let odCoverTotal = 0;

  for (const row of responses) {
    const premium = Number(row.premium) || 0;
    const cover = Number(row.benefitAmount) || 0;
    const key = (row.benefitUuid || "").toLowerCase();

    if (key === lifeKey) {
      lifePremium += premium;
      lifeCoverTotal += cover;
    } else if (key === odKey) {
      odPremium += premium;
      odCoverTotal += cover;
    } else if (key === funeralKey) {
      funeralPremium += premium;
    }
  }

  // Cover Summary shows Life + OD only; Funeral is excluded from breakdown for now.
  const benefitBreakdown: {
    benefit_id: string;
    benefit_name: string;
    benefit_type: string;
    premium_amount: number;
    cover_amount?: number;
  }[] = [];

  if (lifePremium > 0 || lifeCoverTotal > 0) {
    const meta = BENEFIT_META[lifeKey];
    benefitBreakdown.push({
      benefit_id: CORE_BENEFIT_UUIDS.life,
      benefit_name: meta.benefit_name,
      benefit_type: meta.benefit_type,
      premium_amount: round2(lifePremium),
      cover_amount: lifeCoverTotal,
    });
  }

  if (odPremium > 0 || odCoverTotal > 0) {
    const meta = BENEFIT_META[odKey];
    benefitBreakdown.push({
      benefit_id: CORE_BENEFIT_UUIDS.occupationalDisability,
      benefit_name: meta.benefit_name,
      benefit_type: meta.benefit_type,
      premium_amount: round2(odPremium),
      cover_amount: odCoverTotal,
    });
  }

  const totalMonthlyPremium = round2(lifePremium + odPremium + funeralPremium);

  return {
    lifePremium: round2(lifePremium),
    odPremium: round2(odPremium),
    funeralPremium: round2(funeralPremium),
    benefitBreakdown,
    totalMonthlyPremium,
  };
}

export function groupPremiumsByEmployee(
  responses: IndividualPremiumResponse[]
): Record<string, { total: number; life: number; od: number; funeral: number }> {
  const indPremiums: Record<
    string,
    { total: number; life: number; od: number; funeral: number }
  > = {};

  responses.forEach((r: any) => {
    if (r.personUuid) {
      if (!indPremiums[r.personUuid]) {
        indPremiums[r.personUuid] = { total: 0, life: 0, od: 0, funeral: 0 };
      }
      const prem = Number(r.premium || 0);
      indPremiums[r.personUuid].total += prem;
      const uuid = (r.benefitUuid || "").toLowerCase();
      
      if (uuid === CORE_BENEFIT_UUIDS.life.toLowerCase()) {
        indPremiums[r.personUuid].life += prem;
      } else if (uuid === CORE_BENEFIT_UUIDS.occupationalDisability.toLowerCase()) {
        indPremiums[r.personUuid].od += prem;
      } else if (uuid === CORE_BENEFIT_UUIDS.funeral.toLowerCase()) {
        indPremiums[r.personUuid].funeral += prem;
      }
    }
  });

  return indPremiums;
}
