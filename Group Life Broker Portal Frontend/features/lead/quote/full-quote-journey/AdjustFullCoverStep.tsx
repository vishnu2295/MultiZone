"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getProductList,
  calculatePricing,
  calculateIndividualPremiums,
  type Product,
} from "../../../../lib/api/products";
import Slider from "@/components/ui/Slider";
import Tooltip from "@mui/material/Tooltip";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Employee } from "./helpers/utils";
import EmployeePremiumTable from "./components/EmployeePremiumTable";
import {
  buildIndividualPremiumPayload,
  aggregateIndividualPremiums,
  groupPremiumsByEmployee,
} from "./helpers/individualPremium";

interface AdditionalBenefitsState {
  gpaClassicCover: boolean;
  gpaComprehensiveCover: boolean;
  gpaComprehensivePlusCover: boolean;
  crimeAndCommutingJourney: boolean;
  riotAndStrike: boolean;
  riotAndStrikePlusCover: boolean;
  augmentation: boolean;
}

const DEFAULT_ADDITIONAL_BENEFITS: AdditionalBenefitsState = {
  gpaClassicCover: false,
  gpaComprehensiveCover: false,
  gpaComprehensivePlusCover: false,
  crimeAndCommutingJourney: false,
  riotAndStrike: false,
  riotAndStrikePlusCover: false,
  augmentation: false,
};

interface AdjustFullCoverStepProps {
  employeeList: Employee[];
  employeeCount: number;
  lifeCover: number;
  setLifeCover: (v: number) => void;
  occupationalDisability: number;
  setOccupationalDisability: (v: number) => void;
  funeralCover: number;
  setFuneralCover: (v: number) => void;
  additionalBenefits: AdditionalBenefitsState;
  setAdditionalBenefits: React.Dispatch<
    React.SetStateAction<AdditionalBenefitsState>
  >;
  averageAge?: string;
  setProductId?: (id: string) => void;
  coverMode?: "multiple" | "equal";
  setCoverMode?: (mode: "multiple" | "equal") => void;
  setBenefitBreakdown?: (breakdown: any[]) => void;
  setTotalMonthlyPremium?: (premium: number) => void;
}

const VAPS_Products = (
  benefits: AdditionalBenefitsState,
  setBenefit: (key: keyof AdditionalBenefitsState, value: boolean) => void
) => {
  const {
    gpaClassicCover,
    gpaComprehensiveCover,
    gpaComprehensivePlusCover,
    crimeAndCommutingJourney,
    riotAndStrike,
    riotAndStrikePlusCover,
    augmentation,
  } = { ...DEFAULT_ADDITIONAL_BENEFITS, ...benefits };

  return [
    {
      label:
        "GPA Classic Cover (Group Personal Accident) - Cover up to 4 x Annual Salary",
      active: Boolean(gpaClassicCover),
      onToggle: (v: boolean) => setBenefit("gpaClassicCover", v),
      notes: [] as string[],
    },
    {
      label:
        "GPA Comprehensive Cover (Group Personal Accident) - Cover up to 4 x Annual Salary",
      active: Boolean(gpaComprehensiveCover),
      onToggle: (v: boolean) => setBenefit("gpaComprehensiveCover", v),
      notes: [] as string[],
    },
    {
      label:
        "GPA Comprehensive Plus Cover (Group Personal Accident) - Cover up to 4 x Annual Salary",
      active: Boolean(gpaComprehensivePlusCover),
      onToggle: (v: boolean) => setBenefit("gpaComprehensivePlusCover", v),
      notes: [] as string[],
    },
    {
      label:
        "CICJP Cover (Crime & Commuting Journey Policy) - Monthly Income up to 75% of earnings",
      active: Boolean(crimeAndCommutingJourney),
      onToggle: (v: boolean) => setBenefit("crimeAndCommutingJourney", v),
      notes: [
        "In the event of a crime and injury as the result of awork-related accident, our CRIME AND INJURY COMMUTING JOURNEY POLICY provides employees with a premium top-up cover solution to the shortcomings of COID, for up to R7.5 million for work related travel risks.",
      ],
    },
    {
      label: "Riot and Strike Cover - Cover up to 2 x Annual Salary",
      active: Boolean(riotAndStrike),
      onToggle: (v: boolean) => setBenefit("riotAndStrike", v),
      notes: [
        "In the event of an employee injury or death caused by riots, strikes, faction fights or similar disturbances, our RIOT AND STRIKE POLICY provides a premium top-up cover solution.",
      ],
    },
    {
      label: "Riot and Strike Plus Cover - Cover up to 2 x Annual Salary",
      active: Boolean(riotAndStrikePlusCover),
      onToggle: (v: boolean) => setBenefit("riotAndStrikePlusCover", v),
      notes: [] as string[],
    },
    {
      label:
        "AUG (Augmentation) - Monthly Income up to 75% of earnings above the COIDA limits",
      active: Boolean(augmentation),
      onToggle: (v: boolean) => setBenefit("augmentation", v),
      notes: [
        "Cover for death and disability for those employees earning above the COIDA limit of R668 000 (per annum).",
        "In the event of an employee work place injury, disease or death, our AUGMENTATION POLICY provides employees with a premium top-up cover solution to the short comings of COID, ensuring that your employees and their loved ones are financially protected.",
      ],
    },
  ];
};

export function AdjustFullCoverStep({
  employeeList,
  employeeCount,
  lifeCover,
  setLifeCover,
  occupationalDisability,
  setOccupationalDisability,
  funeralCover,
  setFuneralCover,
  additionalBenefits,
  setAdditionalBenefits,
  setProductId,
  coverMode = "multiple",
  setCoverMode,
  setBenefitBreakdown: setParentBenefitBreakdown,
  setTotalMonthlyPremium: setParentTotalMonthlyPremium,
}: AdjustFullCoverStepProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalMonthlyPremium, setTotalMonthlyPremium] = useState(0);
  const [perEmployeeMonthly, setPerEmployeeMonthly] = useState(0);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [benefitBreakdown, setBenefitBreakdown] = useState<any[]>([]);
  const [individualPremiums, setIndividualPremiums] = useState<
    Record<string, { total: number; life: number; od: number; funeral: number }>
  >({});
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  console.log("life cover amount", lifeCover);
  console.log("employee list", employeeList);
  const {
    gpaClassicCover,
    gpaComprehensiveCover,
    gpaComprehensivePlusCover,
    crimeAndCommutingJourney,
    riotAndStrike,
    riotAndStrikePlusCover,
    augmentation,
  } = { ...DEFAULT_ADDITIONAL_BENEFITS, ...additionalBenefits };

  useEffect(() => {
    getProductList()
      .then((data) => {
        setProducts(data);
        if (data.length > 0 && setProductId) {
          setProductId(data[0].product_id);
        }
      })
      .catch(console.error);
  }, [setProductId]);

  const applyPricingResult = useCallback(
    (total: number, perEmployee: number, breakdown: any[]) => {
      setTotalMonthlyPremium(total);
      setPerEmployeeMonthly(perEmployee);
      setBenefitBreakdown(breakdown);
      if (setParentTotalMonthlyPremium) {
        setParentTotalMonthlyPremium(total);
      }
      if (setParentBenefitBreakdown) {
        setParentBenefitBreakdown(breakdown);
      }
    },
    [setParentBenefitBreakdown, setParentTotalMonthlyPremium]
  );

  const updatePricing = useCallback(async () => {
    setIsPricingLoading(true);
    try {
      if (coverMode === "multiple") {
        const payload = buildIndividualPremiumPayload(employeeList, {
          lifeCover,
          occupationalDisability,
          funeralCover,
        });

        if (payload.length === 0) {
          applyPricingResult(0, 0, []);
          return;
        }

        const responses = await calculateIndividualPremiums(payload);
        const { benefitBreakdown: breakdown, totalMonthlyPremium: total } =
          aggregateIndividualPremiums(responses);

        const indPremiums = groupPremiumsByEmployee(responses);
        setIndividualPremiums(indPremiums);

        const count = employeeCount || employeeList.length;
        const perEmployee =
          count > 0 ? Math.round((total / count) * 100) / 100 : 0;
        applyPricingResult(total, perEmployee, breakdown);
        return;
      }

      if (products.length === 0) return;

      const payload = {
        quote_type: "Full",
        member_count: employeeCount || 1,
        benefits: products.flatMap((p) =>
          p.benefits.map((b: any) => {
            let isSelected = false;
            let coverAmount = 0;
            const multiple = 0;

            const type = b.benefit_type.toUpperCase();
            if (type === "LIFE") {
              isSelected = lifeCover > 0;
              coverAmount = lifeCover;
            } else if (
              type === "ACCIDENT" ||
              type === "OCCUPATIONAL DISABILITY"
            ) {
              isSelected = occupationalDisability > 0;
              coverAmount = occupationalDisability;
            } else if (type === "FUNERAL") {
              isSelected = funeralCover > 0;
              coverAmount = funeralCover;
            } else if (type === "VAPS") {
              const name = b.benefit_name || "";
              if (name.includes("Augmentation") || name.includes("AUG"))
                isSelected = augmentation;
              if (
                name.includes("Commuting") ||
                name.includes("CICJP") ||
                name.includes("Crime")
              ) {
                isSelected = crimeAndCommutingJourney;
              }
              if (name.includes("Riot")) {
                isSelected = name.includes("Plus")
                  ? riotAndStrikePlusCover
                  : riotAndStrike;
              }
              if (name.includes("GPA") || name.includes("Personal Accident")) {
                if (name.includes("Plus"))
                  isSelected = gpaComprehensivePlusCover;
                else if (name.includes("Comprehensive"))
                  isSelected = gpaComprehensiveCover;
                else isSelected = gpaClassicCover;
              }
              coverAmount = b.default_cover_amount || 0;
            }

            return {
              benefit_id: b.benefit_id,
              benefit_name: b.benefit_name,
              benefit_type: b.benefit_type,
              cover_amount: coverAmount > 0 ? coverAmount : undefined,
              multiple: multiple > 0 ? multiple : undefined,
              is_selected: isSelected,
            };
          })
        ),
      };

      const res = await calculatePricing(payload as any);
      const total =
        res?.data?.total_premium ?? res?.data?.total_monthly_premium ?? 0;
      applyPricingResult(
        total,
        res?.data?.per_employee_monthly ?? 0,
        res?.data?.benefits ?? []
      );
    } catch (error) {
      console.error("Pricing calculation failed:", error);
    } finally {
      setIsPricingLoading(false);
    }
  }, [
    lifeCover,
    funeralCover,
    occupationalDisability,
    employeeCount,
    employeeList,
    products,
    coverMode,
    augmentation,
    gpaClassicCover,
    gpaComprehensiveCover,
    gpaComprehensivePlusCover,
    crimeAndCommutingJourney,
    riotAndStrike,
    riotAndStrikePlusCover,
    applyPricingResult,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePricing();
    }, 500);
    return () => clearTimeout(timer);
  }, [updatePricing]);

  const setBenefit = (key: keyof AdditionalBenefitsState, value: boolean) => {
    setAdditionalBenefits((prev) => ({
      ...DEFAULT_ADDITIONAL_BENEFITS,
      ...prev,
      [key]: value,
    }));
  };

  const safeNumber = (v: number | undefined | null, fallback: number) =>
    v == null || Number.isNaN(Number(v)) ? fallback : Number(v);

  const lifeCoverSliderValue = safeNumber(
    lifeCover,
    coverMode === "multiple" ? 1.5 : 100000
  );
  const oDisabilitySliderValue = safeNumber(
    occupationalDisability,
    coverMode === "multiple" ? 2.5 : 100000
  );
  const funeralCoverSliderValue = safeNumber(funeralCover, 5000);

  const fmt = (v: number) =>
    "R" +
    v.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const sliderCard: React.CSSProperties = {
    background: "var(--table-header-bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "12px 14px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "14px",
          position: "relative",
        }}
      >
        {isPricingLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              zIndex: 100,
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "2px solid #1FC3EB",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        <div
          style={{
            background: "var(--card-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            <button
              onClick={() => {
                if (coverMode !== "multiple") {
                  setCoverMode?.("multiple");
                  setLifeCover(1.5);
                  setOccupationalDisability(2.5);
                }
              }}
              style={{
                padding: "6px 10px",
                background:
                  coverMode === "multiple" ? "var(--border)" : "transparent",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color:
                  coverMode === "multiple"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              Multiple of Salary
            </button>
            <button
              onClick={() => {
                if (coverMode !== "equal") {
                  setCoverMode?.("equal");
                  setLifeCover(100000);
                  setOccupationalDisability(100000);
                }
              }}
              style={{
                padding: "6px 10px",
                background:
                  coverMode === "equal" ? "var(--border)" : "transparent",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color:
                  coverMode === "equal"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              Equal Amount
            </button>
          </div>

          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Adjust Cover Amounts
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginBottom: "14px",
            }}
          >
            For an average of{" "}
            <span style={{ color: "#1FC3EB", fontWeight: 600 }}>
              {/* R{averageIncome.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              {/* Todo : Calculate Average Income and populate */}
              R5000
            </span>{" "}
            per employee p/m, each one would get:
          </p>

          {/* Life Cover */}
          <div style={{ ...sliderCard, marginBottom: "10px" }}>
            <label
              style={{
                fontSize: "0.9rem",
                color:
                  lifeCoverSliderValue > 0
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontWeight: 500,
                display: "block",
                marginBottom: "8px",
              }}
            >
              {lifeCoverSliderValue === 0
                ? "Life cover not selected"
                : coverMode === "multiple"
                  ? `Life cover - ${lifeCoverSliderValue}x annual salary (max R2M)`
                  : `Life cover - R${lifeCoverSliderValue.toLocaleString("en-ZA")} (max R2M)`}
            </label>
            <Slider
              min={0}
              max={coverMode === "multiple" ? 5 : 2000000}
              step={coverMode === "multiple" ? 0.5 : 10000}
              value={lifeCoverSliderValue}
              onChange={setLifeCover}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.68rem",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              {lifeCoverSliderValue > 0 && (
                <>
                  {coverMode === "multiple"
                    ? "0.5x annual salary"
                    : "R2,000,000"}
                  <span>
                    {coverMode === "multiple"
                      ? "5x annual salary"
                      : "R2,000,000"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Occupational Disability Cover */}
          <div style={{ ...sliderCard, marginBottom: "10px" }}>
            <label
              style={{
                fontSize: "0.9rem",
                color:
                  oDisabilitySliderValue > 0
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontWeight: 500,
                display: "block",
                marginBottom: "8px",
              }}
            >
              {oDisabilitySliderValue === 0
                ? "Occupational Disability cover not selected"
                : coverMode === "multiple"
                  ? `Occupational Disability cover - ${oDisabilitySliderValue}x annual salary (max R2M)`
                  : `Occupational Disability cover - R${oDisabilitySliderValue.toLocaleString("en-ZA")} (max R2M)`}
            </label>
            <Slider
              min={0}
              max={coverMode === "multiple" ? 5 : 2000000}
              step={coverMode === "multiple" ? 0.5 : 5000}
              value={oDisabilitySliderValue}
              onChange={setOccupationalDisability}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.68rem",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              {oDisabilitySliderValue > 0 && (
                <>
                  {coverMode === "multiple"
                    ? "0.5x annual salary"
                    : "R2,000,000"}
                  <span>
                    {coverMode === "multiple"
                      ? "5x annual salary"
                      : "R2,000,000"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Funeral Cover */}
          <div style={{ ...sliderCard, marginBottom: "12px" }}>
            <label
              style={{
                fontSize: "0.9rem",
                color:
                  funeralCoverSliderValue > 0
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontWeight: 500,
                display: "block",
                marginBottom: "8px",
              }}
            >
              {funeralCoverSliderValue === 0
                ? "Funeral cover not selected"
                : `Funeral cover - R${funeralCoverSliderValue.toLocaleString("en-ZA")}`}
            </label>
            <Slider
              min={0}
              max={50000}
              step={5000}
              value={funeralCoverSliderValue}
              onChange={setFuneralCover}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.68rem",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              {funeralCoverSliderValue > 0 && (
                <>
                  <span>R5,000</span>
                  <span>R50,000</span>
                </>
              )}
            </div>
          </div>

          <h4
            style={{
              fontSize: "0.86rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Additional Benefits
          </h4>

          {VAPS_Products(additionalBenefits, setBenefit).map((benefit) => (
            <div
              key={benefit.label}
              style={{
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: "8px",
                  cursor: "pointer",
                  alignItems: "center",
                  margin: 0,
                }}
              >
                <input
                  type="checkbox"
                  checked={benefit.active}
                  onChange={(e) => benefit.onToggle(e.target.checked)}
                  style={{ accentColor: "#1FC3EB", margin: 0 }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: benefit.active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {benefit.label}
                </span>
              </label>
              {benefit.notes.length > 0 && (
                <Tooltip
                  title={
                    <ul
                      style={{
                        margin: 0,
                        padding: "0 0 0 16px",
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {benefit.notes.map((note) => (
                        <li key={note} style={{ marginBottom: "4px" }}>
                          {note}
                        </li>
                      ))}
                    </ul>
                  }
                  placement="right"
                  arrow
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Info size={14} />
                  </div>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            background: "var(--card-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div
            style={{
              background: "var(--card-primary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              height: "fit-content",
            }}
          >
            {/* TOP COVER SUMMARY */}
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "18px",
              }}
            >
              Cover summary
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {(() => {
                const getCorePremium = (
                  keywords: string[],
                  fallback: string
                ) => {
                  const item = benefitBreakdown.find(
                    (b) =>
                      keywords.some((k) =>
                        b.benefit_name?.toUpperCase().includes(k.toUpperCase())
                      ) ||
                      keywords.some((k) =>
                        b.benefit_type?.toUpperCase().includes(k.toUpperCase())
                      )
                  );
                  if (!item || item.premium_amount == null) return fallback;
                  return `${fmt(Number(item.premium_amount))} pm`;
                };

                // Multiples mode: Life + OD only (Funeral / VAPs ignored in Cover Summary for now).
                const coverSummaryItems =
                  coverMode === "multiple"
                    ? [
                        ...(lifeCoverSliderValue > 0
                          ? [
                              {
                                label: "Life",
                                value: getCorePremium(["Life"], "R0.00 pm"),
                              },
                            ]
                          : []),
                        ...(oDisabilitySliderValue > 0
                          ? [
                              {
                                label: "Occupational Disability",
                                value: getCorePremium(
                                  ["Disability", "Occupational"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                      ]
                    : [
                        ...(lifeCoverSliderValue > 0
                          ? [
                              {
                                label: "Life",
                                value: getCorePremium(["Life"], "R50 pm"),
                              },
                            ]
                          : []),
                        ...(oDisabilitySliderValue > 0
                          ? [
                              {
                                label: "Occupational Disability",
                                value: getCorePremium(
                                  ["Disability", "Occupational"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(funeralCoverSliderValue > 0
                          ? [
                              {
                                label: "Funeral",
                                value: getCorePremium(["Funeral"], "R24 pm"),
                              },
                            ]
                          : []),
                        ...(gpaClassicCover
                          ? [
                              {
                                label: "GPA Classic Cover",
                                value: getCorePremium(
                                  ["Classic", "GPA"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(gpaComprehensiveCover
                          ? [
                              {
                                label: "GPA Comprehensive Cover",
                                value: getCorePremium(
                                  ["Comprehensive", "GPA"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(gpaComprehensivePlusCover
                          ? [
                              {
                                label: "GPA Comprehensive Plus Cover",
                                value: getCorePremium(
                                  ["Plus", "GPA"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(crimeAndCommutingJourney
                          ? [
                              {
                                label: "CICJP Cover",
                                value: getCorePremium(
                                  ["Commuting", "CICJP", "Crime"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(riotAndStrike
                          ? [
                              {
                                label: "Riot and Strike",
                                value: getCorePremium(["Riot"], "R0.00 pm"),
                              },
                            ]
                          : []),
                        ...(riotAndStrikePlusCover
                          ? [
                              {
                                label: "Riot and Strike Plus",
                                value: getCorePremium(
                                  ["Riot", "Plus"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                        ...(augmentation
                          ? [
                              {
                                label: "Augmentation",
                                value: getCorePremium(
                                  ["Augmentation", "AUG"],
                                  "R0.00 pm"
                                ),
                              },
                            ]
                          : []),
                      ];

                return coverSummaryItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </span>

                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ));
              })()}
            </div>

            {/* TOTAL PREMIUM */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: "20px",
                paddingTop: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Total monthly premium
                </span>

                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#00C2FF",
                  }}
                >
                  {fmt(totalMonthlyPremium)} pm
                </span>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                }}
              >
                {employeeCount} employees - average premium per employee{" "}
                <span style={{ color: "var(--text-primary)" }}>
                  {fmt(perEmployeeMonthly)} p/m
                </span>
              </p>
            </div>

            {/* SECOND COVER SUMMARY */}
            {/* <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "18px",
            }}
          >
            Cost Per Member Details
          </h3> */}

            {/* {(() => {
            const costPerMemberDetailsItems = [
              ...(lifeCoverSliderValue > 0
                ? [
                    {
                      label: "Life",
                      value:
                        "0.1% of salary up to a max of R317 per employee p/m*",
                    },
                  ]
                : []),
              ...(oDisabilitySliderValue > 0
                ? [
                    {
                      label: "Occupational Disability",
                      value:
                        "0.19% of salary up to a max of R69 per employee p/m*",
                    },
                  ]
                : []),
              ...(funeralCoverSliderValue > 0
                ? [{ label: "Funeral", value: "R24 per employee p/m*" }]
                : []),
              ...(gpaClassicCover
                ? [
                    {
                      label: "GPA Classic Cover",
                      value: "1.27% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(gpaComprehensiveCover
                ? [
                    {
                      label: "GPA Comprehensive Cover",
                      value: "1.27% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(gpaComprehensivePlusCover
                ? [
                    {
                      label: "GPA Comprehensive Plus Cover",
                      value: "1.27% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(crimeAndCommutingJourney
                ? [
                    {
                      label: "CICJP Cover",
                      value: "0.35% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(riotAndStrike
                ? [
                    {
                      label: "Riot and Strike",
                      value: "0.09% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(riotAndStrikePlusCover
                ? [
                    {
                      label: "Riot and Strike Plus",
                      value: "0.09% of salary per employee p/m*",
                    },
                  ]
                : []),
              ...(augmentation
                ? [
                    {
                      label: "Augmentation",
                      value: "0.86% of salary per employee p/m*",
                    },
                  ]
                : []),
            ];

            return costPerMemberDetailsItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "18px",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    maxWidth: "45%",
                    lineHeight: 1.5,
                  }}
                >
                  {item.label}
                </span>

                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-primary)",
                    textAlign: "right",
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ));
          })()} */}

            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: "16px",
                paddingTop: "14px",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                * The premium is capped at this value for employees who have
                reached the R2m max cover limit
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--card-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: showEmployeeDetails ? "16px" : "0",
          }}
          onClick={() => setShowEmployeeDetails(!showEmployeeDetails)}
        >
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            Show employee cover details ({employeeList.length})
          </span>
          {showEmployeeDetails ? (
            <ChevronUp size={20} color="var(--text-primary)" />
          ) : (
            <ChevronDown size={20} color="var(--text-primary)" />
          )}
        </div>
        {showEmployeeDetails && (
          <EmployeePremiumTable
            employees={employeeList as any}
            additionalBenefits={additionalBenefits}
            funeralCover={funeralCover}
            individualPremiums={individualPremiums}
            lifeCover={lifeCoverSliderValue}
            occupationalDisability={oDisabilitySliderValue}
          />
        )}
      </div>
    </div>
  );
}

export default AdjustFullCoverStep;
