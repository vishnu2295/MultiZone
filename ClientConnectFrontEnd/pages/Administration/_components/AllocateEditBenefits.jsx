import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { nodeSa } from "../../../src/AxiosParams";
import useToken from "../../../hooks/useToken";
import { Alert, Button, Stack } from "@mui/material";
import AlertPopup from "../../../components/Bits/AlertPopup";
import axios from "axios";

const AllocateEditBenefits = ({
  PolicyMembers,
  setPolicyMembers,
  PolicyData,
  setIsPremiumFetched,
  onAllocated,
  // PolicyMembersOrg,
}) => {
  const accessToken = useToken();

  const [requiresBenefit, setRequiresBenefit] = React.useState(false);

  useEffect(() => {
    let requiresBenefit = false;
    PolicyMembers.forEach((member) => {
      if (
        !member?.benefitId &&
        member?.insuredLifeStatus === 1 &&
        member.MemberTypeId !== 5
      ) {
        requiresBenefit = true;
      }
    });

    setRequiresBenefit(requiresBenefit);
  }, [PolicyMembers]);

  const allocate = useMutation({
    mutationFn: async (data) => {
      return await axios.post(`${nodeSa}/edit/benefits/allocate`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
  });

  const SubmitBenefitsRequest = () => {
    // console.log("SubData", PolicyMembers);
    let SubData = {
      ...PolicyData,
      PolicyMembers: PolicyMembers.filter(
        (member) =>
          member?.insuredLifeStatus === 1 &&
          member.MemberTypeId !== 5 &&
          member?.MemberAction !== 3,
      ).map((member) => {
        const benefitId = member?.benefitId || member?.BenefitId || 0;
        const benefitChanged =
          member?.MemberAction === 0 &&
          benefitId &&
          benefitId !== member?.orgBenefitId;

        return {
          ...member,
          // Send benefitId as null so the backend retrieves new benefits
          benefitId: null,
          BenefitId: null,
          MemberAction: benefitChanged ? 2 : member.MemberAction,
          status: benefitChanged ? "Update" : member?.status,
        };
      }),
    };

    // Reset local benefitId so the benefit detail queries reset and refetch
    // fresh values once the allocation response returns new benefitIds.
    setPolicyMembers((prev) =>
      prev.map((member) =>
        member?.insuredLifeStatus === 1 &&
        member.MemberTypeId !== 5 &&
        member?.MemberAction !== 3
          ? { ...member, benefitId: null, BenefitId: null }
          : member,
      ),
    );

    allocate.mutate(SubData, {
      onSuccess: (data) => {
        const returnedMembers = data?.data?.data?.PolicyMembers || [];

        // Only sync benefit IDs from allocate response.
        // The parent's getBenefitsDetails queries will re-run automatically
        // when benefitId changes, populate member.Premium, and then
        // call setIsPremiumFetched(false) to trigger recalculation.
        setPolicyMembers((prev) =>
          prev.map((prevMember) => {
            const updated = returnedMembers.find(
              (m) => m.IdNumber === prevMember.IdNumber,
            );
            if (!updated) return prevMember;

            const benefitId = updated?.BenefitId || updated?.benefitId || 0;
            const benefitChanged =
              prevMember?.MemberAction === 0 &&
              benefitId &&
              benefitId !== prevMember?.orgBenefitId;
            return {
              ...prevMember,
              benefitId,
              BenefitId: benefitId,
              MemberAction: benefitChanged ? 2 : prevMember?.MemberAction,
              status: benefitChanged ? "Update" : prevMember?.status,
            };
          }),
        );
        onAllocated?.();
      },
    });
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <Button
        sx={{ width: "100%" }}
        fullWidth
        onClick={() => SubmitBenefitsRequest()}
        variant="contained"
        disabled={allocate.isLoading}
        color="secondary"
      >
        {allocate.isLoading ? "Allocating Benefits..." : "Allocate Benefits"}
      </Button>
      {requiresBenefit && (
        <Alert
          severity="warning"
          sx={{ width: "100%", mt: 2 }}
          variant="outlined"
        >
          Some Members do not have benefits allocated
        </Alert>
      )}
      <AlertPopup
        open={allocate.isSuccess}
        severity="success"
        message="Benefits Allocated Successfully"
      />
      <AlertPopup
        open={allocate.isError}
        severity="error"
        message={
          allocate?.error?.response?.data?.message ||
          "Error Allocating Benefits"
        }
      />
    </Stack>
  );
};

export default AllocateEditBenefits;
