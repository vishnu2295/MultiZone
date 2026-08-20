import React from "react";
import { rmaAPI } from "../../../src/AxiosParams";
import { useQuery } from "react-query";
import axios from "axios";

const GetBenefits = (
  productOptionId,
  coverType,
  coverAmount = null,
  dob = null,
  inceptionDate = null,
) => {
  const [benefits, setBenefits] = React.useState([]);

  let age = null;
  if (dob) {
    const today = inceptionDate ? new Date(inceptionDate) : new Date();
    const birthDate = new Date(dob);
    age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const hasBirthdayPassedThisYear =
      monthDiff > 0 ||
      (monthDiff === 0 && today.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassedThisYear) {
      age -= 1;
    }
  }
  // console.log("ProductOptionId", productOptionId);
  // console.log("CoverType", coverType);
  // console.log("CoverAmount", coverAmount);
  // console.log("Age", age);

  // {rmaApi}/clc/api/Product/Benefit/GetProductBenefitRates/:ProductOptionId/:covertype
  const benefitsRequest = useQuery(
    [`Benefits`, productOptionId],
    () =>
      axios.get(
        `${rmaAPI}/clc/api/Product/Benefit/GetProductBenefitRates/${productOptionId}/${coverType}`,
      ),
    {
      enabled: !!productOptionId && !!coverType && !!dob,
      onSuccess: (data) => {
        const benefitList = data?.data?.benefits || [];

        const finalBenefits = benefitList
          .filter((benefit) => {
            if (!coverAmount) {
              return true;
            }

            return benefit.benefitRates[0]?.benefitAmount === coverAmount;
          })
          .filter((benefit) => {
            if (age === null) {
              return true;
            }

            const rule11 = benefit.ruleItems?.find(
              (rule) => rule.ruleId === 11,
            );
            const rule12 = benefit.ruleItems?.find(
              (rule) => rule.ruleId === 12,
            );

            const parseRuleValue = (rule) => {
              if (!rule?.ruleConfiguration) {
                return null;
              }

              try {
                const parsed = JSON.parse(
                  rule.ruleConfiguration.replace(/'/g, '"'),
                );
                return parsed?.[0]?.fieldValue ?? null;
              } catch {
                return null;
              }
            };

            const maxAge = parseRuleValue(rule11);
            const minAge = parseRuleValue(rule12);

            return (!minAge || age >= minAge) && (!maxAge || age <= maxAge);
          });

        setBenefits(finalBenefits);
      },
    },
  );

  return {
    benefits,
    isLoadingGetBenefits: benefitsRequest.isLoading,
    isErrorGetBenefits: benefitsRequest.isError,
    isSuccessGetBenefits: benefitsRequest.isSuccess,
  };
};

export default GetBenefits;
