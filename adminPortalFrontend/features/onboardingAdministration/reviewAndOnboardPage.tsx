"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import BackButton from "@/components/ui/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomButton } from "@/components/ui/CustomButton";
import { COLORS } from "@/lib/colors";
import EmployerQuoteDetailsStep from "./reviewAndOnboard/employerQuoteDetailsStep";
import EmployeeValidationStep from "./reviewAndOnboard/employeeValidationStep";
import PricingVarianceStep from "./reviewAndOnboard/pricingVarianceStep";
import CreatePolicyModal from "./reviewAndOnboard/components/createPolicyModal";
import RejectOnboardingModal from "./reviewAndOnboard/components/rejectOnboardingModal";
import { useGetQuoteDetails } from "./reviewAndOnboard/hooks/useGetQuoteDetails";

export default function ReviewAndOnboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteReference = searchParams.get("quoteReference");

  React.useEffect(() => {
    if (!quoteReference) {
      router.push("/onboardingAdministration");
    }
  }, [quoteReference, router]);

  const { data } = useGetQuoteDetails(quoteReference || "");

  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  if (!quoteReference) return null;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setIsModalOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/onboardingAdministration?tab=onboarding-queue");
    }
  };

  const steps = [
    "Employer & Quote Details",
    "Employee Validation",
    "Pricing Variance Validation",
  ];
  const stepTitle = steps[currentStep - 1];

  return (
    <>
      <BackButton onClickHandler={handleBack} />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: "24px",
            p: { xs: 3, lg: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Header Section */}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20 }}>
              Review & Onboard
            </Typography>
            <Stack
              direction="column"
              spacing={1}
              sx={{ alignItems: "flex-end" }}
            >
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: 14, color: "text.primary", mr: 0.5 }}
                >
                  Step {currentStep} of
                </Typography>
                <Typography sx={{ fontSize: 14, color: "text.primary" }}>
                  3
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderRightWidth: 1, my: 0.5, mx: 2 }}
                />
                <Typography
                  sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}
                >
                  {stepTitle}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  bgcolor: "grey.300",
                  borderRadius: 1,
                  alignSelf: "flex-end",
                }}
              >
                <Box
                  sx={{
                    width: `${(currentStep / 3) * 100}%`,
                    height: "100%",
                    bgcolor: COLORS.primary,
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Stack>
          </Stack>

          {/* Content Section */}
          {currentStep === 1 && (
            <EmployerQuoteDetailsStep employer={data.employer} />
          )}
          {currentStep === 2 && (
            <EmployeeValidationStep employees={data.employees} />
          )}
          {currentStep === 3 && (
            <PricingVarianceStep variance={data.variance} />
          )}

          {/* Action Footer */}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", mt: "auto", pt: 2 }}
          >
            <Box>
              {currentStep === 3 && (
                <CustomButton
                  variantType="secondary"
                  sizeType="md"
                  onClick={() => setIsRejectModalOpen(true)}
                  sx={{
                    px: 4,
                    color: "error.dark",
                    borderColor: "error.dark",
                    bgcolor: "error.light",
                    "&:hover": {
                      bgcolor: "error.dark",
                      color: "white   ",
                    },
                  }}
                >
                  Reject Onboarding
                </CustomButton>
              )}
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              {currentStep > 1 && (
                <CustomButton
                  variantType="secondary"
                  sizeType="md"
                  onClick={handleBack}
                  sx={{
                    px: 4,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "grey.300",
                  }}
                >
                  &lt; Back
                </CustomButton>
              )}
              <CustomButton
                variantType="primary"
                sizeType="md"
                onClick={handleNext}
                sx={{
                  px: 4,
                  bgcolor: COLORS.primary,
                  "&:hover": { bgcolor: COLORS.primaryHover },
                }}
              >
                {currentStep === 3 ? "Create Policy" : "Next"}
              </CustomButton>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <CreatePolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quoteReference={quoteReference}
      />
      <RejectOnboardingModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        quoteReference={quoteReference}
      />
    </>
  );
}
