// @ts-nocheck
import React from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  Alert,
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

import PageHeader from "components/Bits/PageHeader";
import SelectBroker from "components/FormComponents.jsx/SelectBroker";
import SelectScheme from "components/FormComponents.jsx/SelectScheme";
import useToken from "hooks/useToken";
import { rmaAPI, nodeSa } from "src/AxiosParams";
import BenefitIssueReportModal from "./_components/BenefitIssueReportModal";
import MainMemberBenefits from "./_components/MainMemberBenefits";
import UnallocatedBenefits from "./_components/UnallocatedBenefits";

interface Broker {
  id: string | number;
  name: string;
}

interface Scheme {
  policyId: string | number;
  displayName: string;
  policyNumber: string;
}

interface BenefitRow {
  id?: string | number;
  benefitId?: number;
  benefit?: string;
  benefitAmount?: number;
  minAge?: number;
  maxAge?: number;
  spouse?: number;
  children?: number;
  familyMembers?: number;
  [key: string]: unknown;
}

const Benefits: React.FC = () => {
  const accessToken = useToken();
  const { user } = useUser();

  const [broker, setBroker] = React.useState<Broker | null>(null);
  const [scheme, setScheme] = React.useState<Scheme | null>(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [isIssueReportOpen, setIsIssueReportOpen] = React.useState(false);

  const role = user?.rmaAppRoles?.[0];

  // Step 4: Get productOptionId from the selected scheme
  const schemeId = scheme?.policyId;

  const policyQuery = useQuery(
    `benefitsPolicyQuery${schemeId}`,
    async () =>
      await axios.get(`${rmaAPI}/clc/api/Policy/Policy/${schemeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    {
      enabled: !!accessToken && !!schemeId,
    },
  );

  const productOptionId = policyQuery?.data?.data?.productOptionId;

  // Step 5: Get main member benefits using productOptionId
  const benefitsQuery = useQuery(
    `benefitRules${productOptionId}`,
    async () =>
      await axios.get(`${nodeSa}/rules/benefitRules/${productOptionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    {
      enabled: !!accessToken && !!productOptionId,
    },
  );

  const benefits =
    benefitsQuery?.data?.data?.data ?? benefitsQuery?.data?.data ?? [];

  // Get all RMA benefits for unallocated comparison
  const rmaBenefitsQuery = useQuery(
    `rmaBenefitRates${productOptionId}`,
    async () =>
      await axios.get(
        `${rmaAPI}/clc/api/Product/Benefit/GetProductBenefitRates/${productOptionId}/1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    {
      enabled: !!accessToken && !!productOptionId,
    },
  );

  const rmaBenefits = rmaBenefitsQuery?.data?.data ?? [];

  // Get all dependent benefit options for this product option
  const dependentBenefitsQuery = useQuery(
    `dependentBenefits${productOptionId}`,
    async () =>
      await axios.get(`${nodeSa}/rules/dependentBenefits/${productOptionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    {
      enabled: !!accessToken && !!productOptionId,
    },
  );

  const dependentBenefits =
    dependentBenefitsQuery?.data?.data?.data ??
    dependentBenefitsQuery?.data?.data ??
    [];

  // console.log(
  //   "Dependent benefits fetched for product option:",
  //   dependentBenefits,
  // );

  const deleteBenefitMutation = useMutation(
    async (benefitId: number | string) =>
      axios.delete(
        `${nodeSa}/rules/productOptionBenefit/${productOptionId}/${benefitId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    {
      onSuccess: () => {
        benefitsQuery.refetch();
        rmaBenefitsQuery.refetch();
      },
    },
  );

  const deleteBenefit = async (benefitId: number | string) => {
    await deleteBenefitMutation.mutateAsync(benefitId);
  };

  const addBenefitMutation = useMutation(
    async (row: BenefitRow) =>
      axios.post(
        `${nodeSa}/rules/mainMemberBenefit`,
        {
          productOptionId,
          benefit: row,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    {
      onSuccess: () => {
        benefitsQuery.refetch();
        rmaBenefitsQuery.refetch();
      },
    },
  );

  const addBenefit = async (row: BenefitRow) => {
    await addBenefitMutation.mutateAsync(row);
  };

  // Filter out benefits that already exist in the main member grid
  const allocatedBenefitIds = new Set(
    Array.isArray(benefits) ? benefits.map((b) => b.benefitId) : [],
  );

  // console.log("Benefits fetched from main member query:", allocatedBenefitIds);
  // console.log("Rrma benefits fetched for unallocated comparison:", rmaBenefits);

  const unallocatedBenefits = Array.isArray(rmaBenefits.benefits)
    ? rmaBenefits.benefits.filter((b) => !allocatedBenefitIds.has(b.id))
    : [];

  // console.log("Benefits fetched from main member query:", unallocatedBenefits);

  const unallocatedRows = unallocatedBenefits.map((b) => ({
    id: b.id,
    name: b.name,
    benefitAmount: b.benefitRates?.[0]?.benefitAmount ?? null,
  }));

  const unallocatedCount = unallocatedRows.length;
  const hasUnallocatedBenefits = unallocatedCount > 0;

  return (
    <div>
      <PageHeader
        title="Benefits"
        subTitle="View Main Member Benefits"
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Benefits", href: "/Benefits" },
        ]}
      />

      <Stack sx={{ my: 2, alignItems: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={() => setIsIssueReportOpen(true)}
        >
          Possible Benefit Issues
        </Button>
      </Stack>

      {/* Step 2: Broker Lookup */}
      <Stack sx={{ my: 2 }}>
        <SelectBroker select={broker} setSelect={setBroker} />
      </Stack>

      {/* Step 3: Scheme Selection (enabled after broker is selected) */}
      {broker && (
        <Stack sx={{ my: 2 }}>
          <SelectScheme select={scheme} setSelect={setScheme} id={broker?.id} />
        </Stack>
      )}

      {/* Loading state for policy lookup */}
      {scheme && policyQuery.isLoading && (
        <Skeleton variant="rectangular" height={60} sx={{ my: 2 }} />
      )}

      {policyQuery.isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching scheme details
        </Alert>
      )}

      <BenefitIssueReportModal
        open={isIssueReportOpen}
        onClose={() => setIsIssueReportOpen(false)}
      />

      {productOptionId && (
        <Box sx={{ my: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ minHeight: 48, mb: 2 }}
          >
            <Tab label="Main Member Benefits" />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Unallocated Benefits</span>
                  {hasUnallocatedBenefits && (
                    <Chip
                      label={unallocatedCount}
                      size="small"
                      sx={{
                        height: 22,
                        fontWeight: 700,
                        bgcolor: "warning.main",
                        color: "warning.contrastText",
                      }}
                    />
                  )}
                </Stack>
              }
              sx={
                hasUnallocatedBenefits
                  ? {
                      color: "warning.main",
                      "&.Mui-selected": {
                        color: "warning.dark",
                      },
                    }
                  : undefined
              }
            />
          </Tabs>

          {/* Main Member Benefits Tab */}
          {tabValue === 0 && (
            <MainMemberBenefits
              benefitsQuery={benefitsQuery}
              benefits={benefits}
              role={role}
              deleteBenefit={deleteBenefit}
              isDeletingBenefit={deleteBenefitMutation.isLoading}
              dependentBenefits={dependentBenefits}
            />
          )}

          {/* Unallocated Benefits Tab */}
          {tabValue === 1 && (
            <UnallocatedBenefits
              rmaBenefitsQuery={rmaBenefitsQuery}
              unallocatedRows={unallocatedRows}
              addBenefit={addBenefit}
              isAddingBenefit={addBenefitMutation.isLoading}
              role={role}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default Benefits;
