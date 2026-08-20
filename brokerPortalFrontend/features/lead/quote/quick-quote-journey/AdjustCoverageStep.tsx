"use client";

import React, { useState, useEffect, useCallback } from "react";
import CoverSummary from "@/components/ui/CoverSummary";
import { BackButton, NextButton } from "@/components/ui/StepButtons";
import StepProgress from "@/components/ui/StepProgress";
import DownloadQuoteModal from "@/components/ui/DownloadQuoteModal";
import {
  getProductList,
  calculatePricing,
  type Product,
} from "../../../../lib/api/products";
import Slider from "@/components/ui/Slider";

const QUICK_STEPS = ["Quote Details", "Adjust Cover Amounts"];

interface CoverageData {
  lifeCover: number;
  funeralCover: number;
  occupationalDisability: number;
  totalCover: number;
  totalMonthlyPremium: number;
  benefitBreakdown: any[];
}

interface AdjustCoverageStepProps {
  onBack: () => void;
  onGenerateQuote: (coverageData: CoverageData) => void | Promise<void>;
  onContinueToFull?: (coverageData: CoverageData) => void | Promise<void>;
  employeeCount: number;
  averageAge: number;
  averageIncome: number;
  province: string;
  industry: string;
  quoteReference?: string;
  companyName?: string;
  genderMix?: string;
  disableFullQuote?: boolean;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--text-primary)",
  display: "block",
  marginBottom: "8px",
};

const coverageItemStyle: React.CSSProperties = {
  background: "var(--table-header-bg)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const PRICING_DEBOUNCE_MS = 500;

const LIFE_COVER_MIN = 50_000;
const LIFE_COVER_MAX = 2_000_000;
const LIFE_COVER_STEP = 10_000;

const FUNERAL_COVER_MIN = 5_000;
const FUNERAL_COVER_MAX = 50_000;
const FUNERAL_COVER_STEP = 1_000;

const OCC_DISABILITY_MIN = 5_000;
const OCC_DISABILITY_MAX = 50_000;
const OCC_DISABILITY_STEP = 1_000;

const formatCurrency = (value: number | string) => {
  const num =
    typeof value === "string"
      ? parseFloat(value.toString().replace(/[^0-9.-]+/g, ""))
      : value;
  return `R${Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface CoverageSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
}

function CoverageSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  minLabel,
  maxLabel,
}: CoverageSliderProps) {
  return (
    <div style={coverageItemStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label style={labelStyle}>{label}</label>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            background: "var(--slider-value-bg)",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          {formatCurrency(value)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--text-primary)",
        }}
      >
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function AdjustCoverageStep({
  onBack,
  onGenerateQuote,
  onContinueToFull,
  employeeCount,
  averageAge,
  averageIncome,
  province,
  industry,
  disableFullQuote,
}: AdjustCoverageStepProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lifeCover, setLifeCover] = useState(100000);
  const [funeralCover, setFuneralCover] = useState(50000);
  const [occupationalDisability, setOccupationalDisability] = useState(100000);
  const [totalMonthlyPremium, setTotalMonthlyPremium] = useState(0);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [benefitBreakdown, setBenefitBreakdown] = useState<any[]>([]);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductList();
        setProducts(data);

        // Dynamically set default cover amounts from the API data
        let initialLife = 100000;
        let initialDisability = 100000;
        let initialFuneral = 50000;

        data.forEach((p) => {
          p.benefits.forEach((b) => {
            const type = b.benefit_type.toUpperCase();
            if (type === "LIFE" && b.default_cover_amount) {
              initialLife = b.default_cover_amount;
            } else if (
              (type === "ACCIDENT" || type === "OCCUPATIONAL DISABILITY") &&
              b.default_cover_amount
            ) {
              initialDisability = b.default_cover_amount;
            } else if (type === "FUNERAL" && b.default_cover_amount) {
              initialFuneral = b.default_cover_amount;
            }
          });
        });

        setLifeCover(initialLife);
        setOccupationalDisability(initialDisability);
        setFuneralCover(initialFuneral);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Pricing calculation - use API
  const updatePricing = useCallback(async () => {
    if (products.length === 0) return;
    setIsPricingLoading(true);
    try {
      // Use calculatePricing API with products
      const payload = {
        quote_type: "Quick",
        member_count: employeeCount || 1,
        quick_quote_data: {
          workforce_count: employeeCount || 1,
          average_age: averageAge,
          average_salary: averageIncome,
          province: province,
          industry: industry,
        },
        benefits: products.flatMap((p) =>
          p.benefits.map((b: any) => {
            let isSelected = false;
            let coverAmount = 0;

            const type = b.benefit_type.toUpperCase();
            if (type === "LIFE") {
              isSelected = true;
              coverAmount = lifeCover;
            } else if (
              type === "ACCIDENT" ||
              type === "OCCUPATIONAL DISABILITY"
            ) {
              isSelected = true;
              coverAmount = occupationalDisability;
            } else if (type === "FUNERAL") {
              isSelected = true;
              coverAmount = funeralCover;
            }

            return {
              benefit_id: b.benefit_id,
              benefit_name: b.benefit_name,
              benefit_type: b.benefit_type,
              cover_amount: coverAmount,
              is_selected: isSelected,
            };
          })
        ),
      };

      const res = await calculatePricing(payload as any);
      setTotalMonthlyPremium(
        res?.data?.total_premium ?? res?.data?.total_monthly_premium ?? 0
      );
      if (res?.data?.benefits) {
        setBenefitBreakdown(res.data.benefits);
      }
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
    averageAge,
    averageIncome,
    province,
    industry,
    products,
  ]);

  const totalCover = lifeCover + funeralCover + occupationalDisability;

  // Debounce pricing updates to avoid excessive API calls while adjusting sliders
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePricing();
    }, PRICING_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [updatePricing]);

  return (
    <>
      <StepProgress steps={QUICK_STEPS} currentStep={1} variant="continuous" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          flex: 1,
        }}
      >
        {/* Left side - Adjust Cover Amounts */}
        <div
          style={{
            background: "var(--card-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Adjust Cover Amounts
          </h3>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
              marginBottom: "24px",
            }}
          >
            For an average of{" "}
            <strong style={{ color: "var(--primary)" }}>
              {formatCurrency(averageIncome)}
            </strong>{" "}
            per employee p/m, each now would get:
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Life Cover */}
            <CoverageSlider
              label="Life cover"
              value={lifeCover}
              onChange={setLifeCover}
              min={LIFE_COVER_MIN}
              max={LIFE_COVER_MAX}
              step={LIFE_COVER_STEP}
              minLabel="R0.00"
              maxLabel="R2,000,000.00"
            />

            {/* Funeral Cover */}
            <CoverageSlider
              label="Funeral Cover"
              value={funeralCover}
              onChange={setFuneralCover}
              min={FUNERAL_COVER_MIN}
              max={FUNERAL_COVER_MAX}
              step={FUNERAL_COVER_STEP}
              minLabel="R5,000"
              maxLabel="R50,000"
            />

            {/* Occupational Disability */}
            <CoverageSlider
              label="Occupational Disability"
              value={occupationalDisability}
              onChange={setOccupationalDisability}
              min={OCC_DISABILITY_MIN}
              max={OCC_DISABILITY_MAX}
              step={OCC_DISABILITY_STEP}
              minLabel="R5,000"
              maxLabel="R50,000"
            />
          </div>
        </div>

        {/* Right side - Cover Summary */}
        <div style={{ height: "fit-content", position: "relative" }}>
          {isPricingLoading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                zIndex: 10,
              }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[color:var(--primary)]"></div>
            </div>
          )}
          <CoverSummary
            lifeCover={lifeCover}
            funeralCover={funeralCover}
            occupationalDisability={occupationalDisability}
            totalCover={totalCover}
            totalMonthlyPremium={totalMonthlyPremium}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <BackButton onClick={onBack} />
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {onContinueToFull && (
            <NextButton
              variant="outlined"
              label="Continue to Full Quote"
              disabled={disableFullQuote}
              onClick={() =>
                onContinueToFull({
                  lifeCover,
                  funeralCover,
                  occupationalDisability,
                  totalCover,
                  totalMonthlyPremium,
                  benefitBreakdown,
                })
              }
            />
          )}
          <NextButton
            label="Save & Generate Quote"
            onClick={async () => {
              await onGenerateQuote({
                lifeCover,
                funeralCover,
                occupationalDisability,
                totalCover,
                totalMonthlyPremium,
                benefitBreakdown,
              });
              setShowModal(true);
            }}
          />
        </div>
      </div>

      {showModal && <DownloadQuoteModal onClose={() => setShowModal(false)} />}
    </>
  );
}
