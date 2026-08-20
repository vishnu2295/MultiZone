import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import SelectWrapper from "../../../../components/FormComponents.jsx/SelectWrapper";
import TextfieldWrapper from "../../../../components/FormComponents.jsx/TextFieldWrapper";
import VopdEditRequest from "./VopdEditRequest";

import DiffAlert from "../../../../components/FormComponents.jsx/DiffAlert";
import SwitchWrapper from "../../../../components/FormComponents.jsx/SwitchWrapper";
import PreferredCommunicationSelect from "../../../../components/FormComponents.jsx/PreferredCommunicationSelect";
import SupportDocuments from "../../../../components/PolicyForms/SupportDocuments";
import DownloadFileButton from "../../../../components/Bits/DownloadFileButton";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import dayjs from "dayjs";
import UploadSupportDocuments from "../UploadSupportDocuments";
import GetBenefits from "../../../Onboarding/_components/getBenefits";
import {
  ADDRESS_TYPE,
  ADDRESS_TYPE_OPTIONS,
} from "src/constants/addressTypes";

const MainMemberEditForm = ({
  data,
  setPolicyMembers,
  action,
  differences: diff,
  PolicyData,
  noEdit,
}) => {
  // console.log("MainMemberEditForm data", data);
  const { benefits, isLoadingGetBenefits, isSuccessGetBenefits } = GetBenefits(
    PolicyData?.ProductOptionId,
    1,
    PolicyData?.coverAmount,
    data?.DateOfBirth,
  );

  return (
    <div>
      <Formik
        initialValues={{
          ...data,
          RolePlayerId: data?.RolePlayerId
            ? data?.RolePlayerId
            : Math.floor(Math.random() * 1000),

          IdTypeId: data?.IdTypeId || 1,
          IdNumber: data?.IdNumber.trim() || "",
          isVopdVerified: data?.isVopdVerified || "",
          MemberTypeId: data?.MemberTypeId || 1,
          FirstName: data?.FirstName || "",
          Surname: data?.Surname || "",
          DateOfBirth: data?.DateOfBirth ? dayjs(data?.DateOfBirth) : dayjs(),
          DateOfDeath: data?.DateOfDeath,
          MaritalStatus: data?.MaritalStatus || "",
          MemberAction: data?.MemberAction || action,
          preferredCommunicationTypeId:
            data?.preferredCommunicationTypeId?.toString() || "3",
          MobileNumber: data?.MobileNumber || "",
          SecondaryNumber: data?.SecondaryNumber || "",
          isStudent: data?.isStudent || false,
          isDisabled: data?.isDisabled || false,
          BenefitId: data?.benefitId || 0,
          BenefitCode: data?.BenefitCode || "",
          Gender: data?.Gender || "",

          Premium: data?.Premium || 0.0,
          supportDocument: data?.supportDocument || [],
          CoverAmount: data?.CoverAmount
            ? data?.CoverAmount
            : PolicyData?.coverAmount,
          EmailAddress: data?.EmailAddress
            ? data?.EmailAddress
            : data?.EmailAddress || "",
          isBeneficiary: data?.isBeneficiary || false,
          PolicyInceptionDate: data?.PolicyInceptionDate || dayjs(),
          Addresses: [
            // Check if addresses exist
            ...(data?.Addresses || []).map((address) => {
              return {
                AddressTypeId: address?.AddressTypeId || ADDRESS_TYPE.PHYSICAL,
                AddressLine1: address?.AddressLine1 || "",
                AddressLine2: address?.AddressLine2 || "",
                Suburb: address?.Suburb || "",
                City: address?.City || "",
                PostalCode: address?.PostalCode || "",
                Country: address?.Country || "",
                countryId: 1,
              };
            }),
          ],
          isBeneficiary: data?.isBeneficiary || false,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object({
          preferredCommunicationTypeId: Yup.string().nullable(),
          MobileNumber: Yup.string().when("preferredCommunicationTypeId", {
            is: (val) => val === "2" || val === "3" || val === 2 || val === 3,
            then: (schema) =>
              schema
                .matches(/^0[6-8][0-9]{8}$/, {
                  message:
                    "Mobile phone number must be 10 digits long and start with 06, 07 or 08",
                })
                .required("Mobile number is required"),
          }),
          EmailAddress: Yup.string().when("preferredCommunicationTypeId", {
            is: (val) => val === "1" || val === 1,
            then: (schema) =>
              schema
                .email("Invalid email address")
                .required("Email address is required"),
          }),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setPolicyMembers((prev) => {
            return prev.map((member) => {
              if (member.RolePlayerId === data.RolePlayerId) {
                return {
                  ...member,
                  ...values,
                  IdNumber: values?.IdNumber.trim(),
                  MemberAction: action,
                  benefitId:
                    values?.benefitId || values?.BenefitId || member?.benefitId,
                  BenefitCode: values?.BenefitCode || member?.BenefitCode,
                  Benefit: values?.Benefit || member?.Benefit,
                  Premium: values?.Premium ?? member?.Premium,
                  CoverAmount: values?.CoverAmount,
                  BenefitDetail: values?.BenefitDetail || member?.BenefitDetail,
                  benefitRuleItems:
                    values?.benefitRuleItems || member?.benefitRuleItems || [],
                };
              }
              return member;
            });
          });

          setSubmitting(false);
        }}
      >
        {({ dirty, values, setFieldValue }) => {
          // Removed on request by Mapaseka 5 June 2026 (used by the commented-out benefit select below)
          // const selectedBenefitId = values.BenefitId || "";
          // const isBenefitConfigured =
          //   selectedBenefitId === ""
          //     ? true
          //     : (benefits || []).some(
          //         (benefit) =>
          //           String(benefit?.id) === String(selectedBenefitId),
          //       );

          return (
            <Form>
              <Stack sx={{ mb: 2 }} direction="row" spacing={2}>
                <>
                  <Button
                    disabled={noEdit ? true : dirty ? false : true}
                    type="submit"
                    size="large"
                    variant="contained"
                  >
                    Save
                  </Button>
                  {dirty && <Alert severity="warning">Save your changes</Alert>}
                  {values.insuredLifeRemovalReason && (
                    <Alert severity="warning">
                      {values.insuredLifeRemovalReason}
                    </Alert>
                  )}
                </>
              </Stack>

              <Card sx={{ mb: 2 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack
                        sx={{ mt: 2 }}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography>Policy Details</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FormControl fullWidth>
                          <DatePicker
                            // disabled={action === 1 ? false : true}
                            disabled={true}
                            size="small"
                            views={["year", "month", "day"]}
                            openTo="month"
                            label="Policy Inception Date"
                            maxDate={
                              action === 1 &&
                              dayjs().add(12, "month").endOf("month")
                            }
                            minDate={
                              action === 1 &&
                              dayjs().subtract(0, "month").startOf("month")
                            }
                            name="date"
                            value={values.PolicyInceptionDate}
                            onChange={(newValue) => {
                              setFieldValue(
                                "PolicyInceptionDate",
                                dayjs(newValue).startOf("month"),
                              );
                            }}
                            variant="inline"
                            inputVariant="outlined"
                            fullWidth
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                disabled
                                size="small"
                                {...params}
                              />
                            )}
                          />
                        </FormControl>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Cover Amount
                        </InputLabel>
                        <Select
                          size="small"
                          disabled={values?.MemberTypeId === 4 ? false : true}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values?.CoverAmount}
                          label="Cover Amount"
                          onChange={(event) => {
                            setFieldValue("CoverAmount", event.target.value);
                          }}
                        >
                          {PolicyData?.CoverAmountOptions?.map(
                            (option, index) => {
                              return (
                                <MenuItem key={index} value={option}>
                                  R {option}
                                </MenuItem>
                              );
                            },
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack
                        sx={{ mt: 2 }}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography>Personal Details</Typography>
                        <SwitchWrapper
                          size="small"
                          value={values.isBeneficiary ? true : false}
                          name="isBeneficiary"
                          label="Beneficiary"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <SelectWrapper
                        disabled={true}
                        size="small"
                        name="IdTypeId"
                        label="User ID Type"
                        options={[
                          {
                            value: 1,
                            label: "SA ID",
                          },
                          {
                            value: 2,
                            label: "Passport",
                          },
                        ]}
                      />
                      {diff?.IdTypeId && (
                        <DiffAlert
                          from={
                            diff.IdTypeId.from === 1
                              ? "SA ID"
                              : diff.IdTypeId.from === 2
                                ? "Passport"
                                : "Other"
                          }
                          to={
                            diff.IdTypeId.to === 1
                              ? "SA ID"
                              : diff.IdTypeId.to === 2
                                ? "Passport"
                                : "Other"
                          }
                        />
                      )}
                    </Grid>

                    <>
                      {values.IdTypeId === 1 && (
                        <>
                          <Grid item xs={6}>
                            <TextfieldWrapper
                              size="small"
                              disabled={true}
                              // type="number"
                              name="IdNumber"
                              label="ID Number"
                            />
                            {diff?.IdNumber && (
                              <DiffAlert
                                from={diff.IdNumber.from}
                                to={diff.IdNumber.to}
                              />
                            )}
                          </Grid>

                          <Field type="hidden" name="vopdResponse" />

                          {/* <Grid item xs={2}>
                            {!values.isVopdVerified ? (
                              <VopdEditRequest />
                            ) : (
                              <Alert severity="info">VOPD Complete</Alert>
                            )}
                          </Grid> */}
                        </>
                      )}

                      {values.IdTypeId === 2 && (
                        <>
                          <Grid item xs={6}>
                            <TextfieldWrapper
                              disabled={true}
                              name="IdNumber"
                              size="small"
                              label="Passport Number"
                            />
                            {diff?.IdNumber && (
                              <DiffAlert
                                from={diff.IdNumber.from}
                                to={diff.IdNumber.to}
                              />
                            )}
                          </Grid>
                        </>
                      )}
                    </>

                    {values.IdTypeId !== 1 && (
                      <>
                        <Grid item xs={4}>
                          <DateOfBirthPicker
                            disabled={true}
                            name="DateOfBirth"
                            size="small"
                            label="Date of Birth"
                          />
                          {diff?.DateOfBirth && (
                            <DiffAlert
                              from={diff.DateOfBirth.from}
                              to={diff.DateOfBirth.to}
                            />
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          <SelectWrapper
                            disabled={true}
                            name="Gender"
                            label="Gender"
                            size="small"
                            options={[
                              {
                                value: 1,
                                label: "Male",
                              },
                              {
                                value: 2,
                                label: "Female",
                              },
                            ]}
                          />
                          {diff?.Gender && (
                            <DiffAlert
                              from={diff.Gender.from}
                              to={diff.Gender.to}
                            />
                          )}
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        disabled={true}
                        size="small"
                        name="FirstName"
                        label="First Name"
                      />
                      {diff?.FirstName && (
                        <DiffAlert
                          from={diff.FirstName.from}
                          to={diff.FirstName.to}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        disabled={true}
                        size="small"
                        name="Surname"
                        label="Surname"
                      />
                      {diff?.Surname && (
                        <DiffAlert
                          from={diff.Surname.from}
                          to={diff.Surname.to}
                        />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              {/* Benefit Details Section */}
              <Card sx={{ mb: 2 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Benefit Details</Typography>
                    </Grid>
                    {isLoadingGetBenefits && (
                      <Grid item xs={12}>
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            Loading benefits...
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Benefit"
                        value={values.Benefit || values.BenefitDetail?.name || ""}
                        InputProps={{ readOnly: true }}
                      />
                      {diff?.Benefit && (
                        <DiffAlert
                          from={diff.Benefit.from}
                          to={diff.Benefit.to}
                        />
                      )}
                    </Grid>
                    {/* Removed on request by Mapaseka 5 June 2026
                    {isSuccessGetBenefits &&
                      benefits &&
                      benefits.length > 0 && (
                        <>
                          <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel id="select-benefit-label">
                                Benefit
                              </InputLabel>
                              <Select
                                disabled={noEdit}
                                labelId="select-benefit-label"
                                id="select-benefit"
                                value={selectedBenefitId}
                                size="small"
                                label="Benefit"
                                onChange={(event) => {
                                  const selectedBenefit = benefits.find(
                                    (x) => x.id === event.target.value,
                                  );
                                  setFieldValue(
                                    "BenefitId",
                                    event.target.value,
                                  );
                                  setFieldValue(
                                    "benefitId",
                                    event.target.value,
                                  );
                                  setFieldValue(
                                    "BenefitCode",
                                    selectedBenefit?.code || "",
                                  );
                                  setFieldValue(
                                    "Benefit",
                                    selectedBenefit?.name || "",
                                  );
                                  setFieldValue(
                                    "BenefitDetail",
                                    selectedBenefit || null,
                                  );
                                  setFieldValue(
                                    "benefitRuleItems",
                                    selectedBenefit?.ruleItems || [],
                                  );
                                  setFieldValue(
                                    "Premium",
                                    selectedBenefit?.benefitRates?.[0]?.baseRate
                                      ? selectedBenefit.benefitRates[0]
                                          .baseRate *
                                          (1 +
                                            (PolicyData?.premiumAdjustmentPercentage ||
                                              0))
                                      : 0,
                                  );
                                  setFieldValue(
                                    "CoverAmount",
                                    selectedBenefit?.benefitRates?.[0]
                                      ?.benefitAmount || values.CoverAmount,
                                  );
                                }}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {benefits.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {!isBenefitConfigured && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                  The allocated benefit may not be configured in
                                  the current environment.
                                </Alert>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    */}
                  </Grid>
                </CardContent>
              </Card>
              {/* Section */}
              <Card sx={{ mb: 2 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Support Documents</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <UploadSupportDocuments
                        id={values?.RolePlayerId}
                        values={values?.supportDocument}
                        setFieldValue={setFieldValue}
                      />
                      <DownloadFileButton documents={values?.supportDocument} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              {/* Section */}
              <Card sx={{ mb: 2 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Contact Details</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <PreferredCommunicationSelect
                        disabled={noEdit}
                        size="small"
                        name="preferredCommunicationTypeId"
                        label="Preferred Communication"
                      />
                      {diff?.preferredCommunicationTypeId && (
                        <DiffAlert
                          from={diff.preferredCommunicationTypeId.from}
                          to={diff.preferredCommunicationTypeId.to}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        disabled={noEdit}
                        size="small"
                        name="MobileNumber"
                        label="Mobile Number"
                      />
                      {diff?.MobileNumber && (
                        <DiffAlert
                          from={diff.MobileNumber.from}
                          to={diff.MobileNumber.to}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        disabled={noEdit}
                        size="small"
                        name="SecondaryNumber"
                        label="Secondary Number"
                      />
                      {diff?.SecondaryNumber && (
                        <DiffAlert
                          from={diff.SecondaryNumber.from}
                          to={diff.SecondaryNumber.to}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        disabled={noEdit}
                        size="small"
                        type="email"
                        name="EmailAddress"
                        label="Email Address"
                      />
                      {diff?.EmailAddress && (
                        <DiffAlert
                          from={diff.EmailAddress.from}
                          to={diff.EmailAddress.to}
                        />
                      )}
                    </Grid>

                    <FieldArray name="Addresses">
                      {({ push, remove }) => (
                        <Grid item xs={12}>
                          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Button
                              disabled={noEdit}
                              onClick={() => push({})}
                              size="small"
                              variant="contained"
                            >
                              Add Address
                            </Button>
                          </Stack>
                          {values.Addresses?.map((address, index) => {
                            return (
                              <Card sx={{ my: 2 }} key={index}>
                                <CardContent sx={{ mt: 1 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <FormControl size="small" fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                          Address Type
                                        </InputLabel>
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          value={address.AddressTypeId}
                                          label="Address Type"
                                          name={`Addresses[${index}].AddressTypeId`}
                                          onChange={(event) =>
                                            setFieldValue(
                                              `Addresses[${index}].AddressTypeId`,
                                              event.target.value,
                                            )
                                          }
                                        >
                                          {ADDRESS_TYPE_OPTIONS.map(
                                            (option) => (
                                              <MenuItem
                                                key = {option.label}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </MenuItem>
                                            ),
                                          )}
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].AddressLine1`}
                                        label="Address Line 1"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].AddressLine2`}
                                        label="Address Line 2"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].Suburb`}
                                        label="Suburb"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].City`}
                                        label="City"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].PostalCode`}
                                        label="Postal Code"
                                      />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <TextfieldWrapper
                                        size="small"
                                        name={`Addresses[${index}].Country`}
                                        label="Country"
                                        value="SOUTH AFRICA"
                                        disabled
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{ mb: 2 }}
                                      >
                                        <Button
                                          onClick={() => remove(index)}
                                          size="small"
                                          color="error"
                                          variant="outlined"
                                        >
                                          Remove Address
                                        </Button>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </Grid>
                      )}
                    </FieldArray>
                  </Grid>
                </CardContent>
              </Card>

              <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
                <Button
                  fullWidth
                  disabled={noEdit ? true : dirty ? false : true}
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Save
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MainMemberEditForm;
