"use client";

import React, { useMemo } from "react";
import CustomTable, { Column } from "@/components/ui/CustomTable";

export interface EmployeePremiumRow {
  id: string;
  name: string;
  salary: string;
}

interface AdditionalBenefitsState {
  augmentation: boolean;
  riotAndStrike: boolean;
  riotAndStrikePlusCover: boolean;
  gpaClassicCover: boolean;
  gpaComprehensiveCover: boolean;
  gpaComprehensivePlusCover: boolean;
}

interface EmployeePremiumTableProps {
  employees: EmployeePremiumRow[];
  additionalBenefits: AdditionalBenefitsState;
  funeralCover: number;
  lifeCover?: number;
  occupationalDisability?: number;
  individualPremiums?: Record<
    string,
    { total: number; life: number; od: number; funeral: number }
  >;
}

const fmt = (v: number) =>
  "R" +
  v.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function EmployeePremiumTable({
  employees,
  additionalBenefits,
  funeralCover,
  lifeCover = 0,
  occupationalDisability = 0,
  individualPremiums,
}: EmployeePremiumTableProps) {
  const columns = useMemo(() => {
    const getPremium = (empId: string) => individualPremiums?.[empId];

    const calculateTotalPremium = (empId: string) => {
      const data = getPremium(empId);
      if (!data) return "-";
      let total = 0;
      if (lifeCover > 0) total += data.life;
      if (occupationalDisability > 0) total += data.od;
      if (funeralCover > 0) total += data.funeral;
      return fmt(total);
    };

    const cols: Column<EmployeePremiumRow>[] = [
      { header: "Name", cell: (emp) => emp.name },
      {
        header: "Premium",
        cell: (emp) => calculateTotalPremium(emp.id),
      },
    ];

    if (lifeCover > 0) {
      cols.push({
        header: "Life",
        cell: (emp) => {
          const premium = getPremium(emp.id);
          return premium ? fmt(premium.life) : "-";
        },
      });
    }

    if (occupationalDisability > 0) {
      cols.push({
        header: "Occupational Disability",
        cell: (emp) => {
          const premium = getPremium(emp.id);
          return premium ? fmt(premium.od) : "-";
        },
      });
    }

    if (funeralCover > 0) {
      cols.push({
        header: "Funeral",
        cell: (emp) => {
          const premium = getPremium(emp.id);
          return premium ? fmt(premium.funeral) : "-";
        },
      });
    }

    if (additionalBenefits.augmentation) {
      cols.push({ header: "Augmentation", cell: () => "Yes" });
    }

    if (
      additionalBenefits.riotAndStrike ||
      additionalBenefits.riotAndStrikePlusCover
    ) {
      cols.push({ header: "Riot & Strike", cell: () => "Yes" });
    }

    const hasPersonalAccident =
      additionalBenefits.gpaClassicCover ||
      additionalBenefits.gpaComprehensiveCover ||
      additionalBenefits.gpaComprehensivePlusCover;

    if (hasPersonalAccident) {
      cols.push({ header: "Personal Accident", cell: () => "Yes" });
    }

    cols.push(
      {
        header: "Annual salary",
        cell: (emp) => `R${Number(emp.salary ?? 0).toLocaleString("en-ZA")}`,
      },
      { header: "Ask medical questions", cell: () => "Yes" }
    );

    return cols;
  }, [
    lifeCover,
    occupationalDisability,
    funeralCover,
    additionalBenefits,
    individualPremiums,
  ]);

  if (employees.length === 0) return null;

  return <CustomTable data={employees} columns={columns} hasActions={false} />;
}
