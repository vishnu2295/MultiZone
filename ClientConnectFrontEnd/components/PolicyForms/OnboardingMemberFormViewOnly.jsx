import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Box,
} from "@mui/material";
import TextfieldWrapper from "components/FormComponents.jsx/TextFieldWrapper";
import DOBPicker from "components/FormComponents.jsx/DobPicker";
import SelectWrapper from "components/FormComponents.jsx/SelectWrapper";
import PreferredCommunicationSelect from "components/FormComponents.jsx/PreferredCommunicationSelect";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import WaitingPeriodInfo from "components/FormComponents.jsx/NotificationWaitingPeriod";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DiffAlert from "components/FormComponents.jsx/DiffAlert";
import MemberNotes from "components/FormComponents.jsx/MemberNotes";
import ExceptionsHandler from "./ExceptionsHandler";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadFileButton from "components/Bits/DownloadFileButton";

const OnboardingMemberFormViewOnly = ({
  data,
  setMembers,
  isEdit,
  diff,
  needsConfirmation,
  disabledFields,
  policyInceptionDate,
  waitingPeriod,
  maxCover,
  benefits,
  setUpdatedMainMember,
}) => {
  return (
    <Card
      sx={{
        py: 2,
        px: 1,
        borderColor: "primary.main",
        borderStyle: "solid",
        borderWidth: 1,
      }}
      variant="outlined"
    >
      <Formik
        initialValues={{
          id: data ? data?.id : uuidv4(),
          client_type: data?.client_type || "",
          confirmed: data?.confirmed || false,
          title: data?.title || "",
          firstName: data?.firstName || "",
          surname: data?.surname || "",
          idNumber: data?.idNumber || "",
          vopdResponse: data?.vopdResponse || "",
          dateOfBirth: data?.dateOfBirth || "",
          idTypeId: data?.idTypeId || 1,
          isVopdVerified: data?.isVopdVerified || false,
          dateVopdVerified: data?.dateVopdVerified || "",
          cellNumber: data?.cellNumber || "",
          emailAddress: data?.emailAddress || "",
          preferredCommunicationTypeId:
            data?.preferredCommunicationTypeId || "",
          tellNumber: data?.tellNumber || "",
          gender: data?.gender || "",
          addressLine1: data?.addressLine1 || data?.address_line_1 || "",
          addressLine2: data?.addressLine2 || data?.address_line_2 || "",
          city: data?.city || "",
          province: data?.province || "",
          postalCode: data?.postalCode || data?.postal_code || "",
          notes: data?.notes || [],
          supportDocument: data?.supportDocument || [],
          memberType: data?.client_type,
          memberTypeId: data?.memberTypeId || 1,
          isBeneficiary: data?.isBeneficiary || false,
          status: "New",
          statedBenefitId: data?.statedBenefitId || "",
          statedBenefit: data?.statedBenefit || "",
          benefitName: data?.benefitName || "",
          PreviousInsurerPolicyNumber: data?.PreviousInsurerPolicyNumber || "",
          PreviousInsurerJoinDate:
            data?.PreviousInsurer &&
            data?.PreviousInsurerJoinDate &&
            data?.PreviousInsurerJoinDate !== ""
              ? dayjs(data?.PreviousInsurerJoinDate)
              : "",
          PreviousInsurerCancellationDate:
            data?.PreviousInsurer &&
            data?.PreviousInsurerCancellationDate &&
            data?.PreviousInsurerCancellationDate !== ""
              ? dayjs(data?.PreviousInsurerCancellationDate)
              : "",
          PreviousInsurer: data?.PreviousInsurer || "",
          PreviousInsurerCoverAmount: data?.PreviousInsurerCoverAmount || 0,
          exceptions: data?.exceptions || [],
        }}
        enableReinitialize={true}
        validationSchema={validation}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <ExceptionsHandler data={values} setFieldValue={setFieldValue} />

              {/* Personal Details */}
              <Card sx={{ mb: 1 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Personal Details</Typography>
                    </Grid>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <Grid item xs={4}>
                        <SelectWrapper
                          name="idTypeId"
                          size="small"
                          label="User ID Type"
                          disabled={disabledFields?.idTypeId}
                          options={[
                            { value: 1, label: "SA ID" },
                            { value: 2, label: "Passport" },
                          ]}
                          inputProps={{ readOnly: true }}
                        />
                        {diff?.idTypeId && (
                          <DiffAlert
                            from={
                              diff.idTypeId.from === 1
                                ? "SA ID"
                                : diff.idTypeId.from === 2
                                  ? "Passport"
                                  : "Other"
                            }
                            to={
                              diff.idTypeId.to === 1
                                ? "SA ID"
                                : diff.idTypeId.to === 2
                                  ? "Passport"
                                  : "Other"
                            }
                          />
                        )}
                      </Grid>

                      {values.idTypeId === 1 && (
                        <>
                          <Grid item xs={6}>
                            <TextfieldWrapper
                              size="small"
                              name="idNumber"
                              disabled={disabledFields?.idNumber}
                              label="ID Number"
                              inputProps={{ readOnly: true }}
                            />
                            {diff?.idNumber && (
                              <DiffAlert
                                from={diff.idNumber.from}
                                to={diff.idNumber.to}
                              />
                            )}
                          </Grid>
                          <Field type="hidden" name="vopdResponse" />
                          <Grid item xs={2}>
                            {values.isVopdVerified && (
                              <Alert severity="info">VOPD Complete</Alert>
                            )}
                          </Grid>
                        </>
                      )}

                      {values.idTypeId === 2 && (
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            size="small"
                            disabled={disabledFields?.idNumber}
                            name="idNumber"
                            label="Passport Number"
                            inputProps={{ readOnly: true }}
                          />
                          {diff?.idNumber && (
                            <DiffAlert
                              from={diff.idNumber.from}
                              to={diff.idNumber.to}
                            />
                          )}
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <DownloadFileButton
                          documents={values?.supportDocument}
                        />
                      </Grid>

                      {values.idTypeId !== 1 && (
                        <>
                          <Grid item xs={4}>
                            <DOBPicker
                              size="small"
                              name="dateOfBirth"
                              disabled={disabledFields?.dateOfBirth}
                              label="Date of Birth"
                              readOnly
                            />
                            {diff?.dateOfBirth && (
                              <DiffAlert
                                from={diff.dateOfBirth.from}
                                to={diff.dateOfBirth.to}
                              />
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            <SelectWrapper
                              size="small"
                              name="gender"
                              label="Gender"
                              options={[
                                { value: 1, label: "Male" },
                                { value: 2, label: "Female" },
                              ]}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={6}>
                        <TextfieldWrapper
                          size="small"
                          disabled={disabledFields?.firstName}
                          name="firstName"
                          label="First Name"
                          inputProps={{ readOnly: true }}
                        />
                        {diff?.firstName && (
                          <DiffAlert
                            from={diff.firstName.from}
                            to={diff.firstName.to}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper
                          size="small"
                          disabled={disabledFields?.surname}
                          name="surname"
                          label="Surname"
                          inputProps={{ readOnly: true }}
                        />
                        {diff?.surname && (
                          <DiffAlert
                            from={diff.surname.from}
                            to={diff.surname.to}
                          />
                        )}
                      </Grid>

                      {data?.vopdResponse && (
                        <Grid item xs={6}>
                          <Accordion
                            sx={{
                              borderColor: "primary.main",
                              borderStyle: "solid",
                              borderWidth: 1,
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>
                                VOPD Response: {data?.vopdResponse?.status}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Card>
                                <Stack>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    idNumber: {data?.vopdResponse?.idNumber}
                                  </Typography>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    dateOfBirth:{" "}
                                    {data?.vopdResponse?.dateOfBirth}
                                  </Typography>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    dateOfDeath:{" "}
                                    {data?.vopdResponse?.dateOfDeath}
                                  </Typography>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    firstName: {data?.vopdResponse?.firstName}
                                  </Typography>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    surname: {data?.vopdResponse?.surname}
                                  </Typography>
                                  <Typography variant="caption" sx={{ p: 2 }}>
                                    maritalStatus:{" "}
                                    {data?.vopdResponse?.maritalStatus}
                                  </Typography>
                                </Stack>
                              </Card>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Benefit Details — hidden for memberType 6 */}
              {values.memberTypeId !== 6 && (
                <Card sx={{ mb: 1 }} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography>Benefit Details</Typography>
                      </Grid>
                      <Grid sx={{ p: 2 }} container spacing={2}>
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            size="small"
                            disabled={true}
                            name="statedBenefit"
                            label="Benefit"
                          />
                        </Grid>
                        {data?.benefitName && (
                          <Grid item xs={6}>
                            <TextfieldWrapper
                              size="small"
                              disabled={true}
                              name="benefitName"
                              label="Benefit on file"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Contact Details — main member, beneficiary, or memberType 6 */}
              {(values.memberTypeId <= 1 ||
                values.memberTypeId === 6 ||
                values.isBeneficiary) && (
                <>
                  {/* Contact Details */}
                  <Card sx={{ mb: 1 }} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography>Contact Details</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <PreferredCommunicationSelect
                            size="small"
                            name="preferredCommunicationTypeId"
                            label="Preferred Communication"
                            inputProps={{ readOnly: true }}
                          />
                          {diff?.preferredCommunicationTypeId && (
                            <DiffAlert
                              from={
                                diff.preferredCommunicationTypeId.from === 1
                                  ? "Email"
                                  : diff.preferredCommunicationTypeId.from === 2
                                    ? "Phone"
                                    : diff.preferredCommunicationTypeId.from ===
                                        3
                                      ? "SMS"
                                      : diff.preferredCommunicationTypeId
                                            .from === 4
                                        ? "Post"
                                        : ""
                              }
                              to={
                                diff.preferredCommunicationTypeId.to === 1
                                  ? "Email"
                                  : diff.preferredCommunicationTypeId.to === 2
                                    ? "Phone"
                                    : diff.preferredCommunicationTypeId.to === 3
                                      ? "SMS"
                                      : diff.preferredCommunicationTypeId.to ===
                                          4
                                        ? "Post"
                                        : ""
                              }
                            />
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            name="cellNumber"
                            label="Mobile Phone Number"
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                          {diff?.cellNumber && (
                            <DiffAlert
                              from={diff.cellNumber.from}
                              to={diff.cellNumber.to}
                            />
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            name="tellNumber"
                            label="Telephone Number"
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                          {diff?.tellNumber && (
                            <DiffAlert
                              from={diff.tellNumber.from}
                              to={diff.tellNumber.to}
                            />
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            name="emailAddress"
                            label="Email Address"
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                          {diff?.emailAddress && (
                            <DiffAlert
                              from={diff.emailAddress.from}
                              to={diff.emailAddress.to}
                            />
                          )}
                        </Grid>
                      </Grid>

                      {values.memberTypeId !== 6 &&
                        (values.memberTypeId <= 1 || !values.isBeneficiary) && (
                          <Card sx={{ p: 3, mt: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography>Address Details</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name="addressLine1"
                                  label="Address Line 1"
                                  size="small"
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name="addressLine2"
                                  label="Address Line 2"
                                  size="small"
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name="city"
                                  label="City"
                                  size="small"
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <SelectWrapper
                                  name="province"
                                  size="small"
                                  label="Province"
                                  options={[
                                    {
                                      value: "EASTERN CAPE",
                                      label: "EASTERN CAPE",
                                    },
                                    {
                                      value: "FREE STATE",
                                      label: "FREE STATE",
                                    },
                                    { value: "GAUTENG", label: "GAUTENG" },
                                    {
                                      value: "KWAZULU-NATAL",
                                      label: "KWAZULU-NATAL",
                                    },
                                    { value: "LIMPOPO", label: "LIMPOPO" },
                                    {
                                      value: "MPUMALANGA",
                                      label: "MPUMALANGA",
                                    },
                                    {
                                      value: "NORTH WEST",
                                      label: "NORTH WEST",
                                    },
                                    {
                                      value: "NORTHERN CAPE",
                                      label: "NORTHERN CAPE",
                                    },
                                    {
                                      value: "WESTERN CAPE",
                                      label: "WESTERN CAPE",
                                    },
                                  ]}
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name="postalCode"
                                  label="Postal Code"
                                  size="small"
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                            </Grid>
                          </Card>
                        )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Previous Insurer Details — main member only */}
              {values.memberTypeId <= 1 && (
                <Accordion
                  sx={{
                    border: "divider",
                    backgroundColor: "background.default",
                    mb: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon color="primary" fontSize="large" />
                    }
                    aria-controls="prev-insurer-content"
                    id="prev-insurer-header"
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <ExpandMoreIcon
                        color="primary"
                        fontSize="large"
                        sx={{
                          transition: "transform 0.3s ease",
                          ".Mui-expanded &": { transform: "rotate(180deg)" },
                        }}
                      />
                      <Typography>Previous Insurer Details (Expand)</Typography>
                      <Box />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ pt: 2 }} spacing={2}>
                      <Grid item xs={6}>
                        <TextfieldWrapper
                          name="PreviousInsurer"
                          label="Previous Insurer"
                          size="small"
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper
                          name="PreviousInsurerPolicyNumber"
                          label="Previous Insurer Policy Number"
                          size="small"
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper
                          name="PreviousInsurerCoverAmount"
                          label="Previous Insurer Cover Amount"
                          size="small"
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="en-gb"
                          >
                            <DatePicker
                              views={["year", "month", "day"]}
                              openTo="day"
                              label="Previous Insurer Join Date"
                              name="PreviousInsurerJoinDate"
                              value={values.PreviousInsurerJoinDate}
                              onChange={() => {}}
                              variant="inline"
                              inputVariant="outlined"
                              fullWidth
                              readOnly
                              renderInput={(params) => (
                                <TextField fullWidth size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="en-gb"
                          >
                            <DatePicker
                              views={["year", "month", "day"]}
                              openTo="day"
                              label="Previous Insurer Cancellation Date"
                              name="PreviousInsurerCancellationDate"
                              value={
                                values.PreviousInsurerCancellationDate === ""
                                  ? null
                                  : values.PreviousInsurerCancellationDate
                              }
                              onChange={() => {}}
                              variant="inline"
                              inputVariant="outlined"
                              fullWidth
                              readOnly
                              renderInput={(params) => (
                                <TextField fullWidth size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <WaitingPeriodInfo
                          PreviousInsurerJoinDate={
                            values.PreviousInsurerJoinDate
                          }
                          PreviousInsurerCancellationDate={
                            values.PreviousInsurerCancellationDate
                          }
                          waitingPeriod={waitingPeriod}
                          policyInceptionDate={policyInceptionDate}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Member Notes */}
              <Card sx={{ p: 3, mt: 1 }} variant="outlined">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>Member Notes</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MemberNotes name="notes" />
                  </Grid>
                </Grid>
              </Card>

              {needsConfirmation && diff && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                  {!values.confirmed ? (
                    <Button
                      size="large"
                      onClick={() => setFieldValue("confirmed", true)}
                      variant="contained"
                    >
                      Confirm Edits
                    </Button>
                  ) : (
                    <Button disabled size="large" variant="contained">
                      Confirmed
                    </Button>
                  )}
                </Stack>
              )}
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default OnboardingMemberFormViewOnly;

const validation = Yup.object({
  idTypeId: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  surname: Yup.string().required("Required"),
  idNumber: Yup.string().when("idTypeId", {
    is: "1",
    then: (schema) => schema
      .required("Id Number is required")
      .matches(
        /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/,
        "SA Id Number seems to be invalid",
      ),
    otherwise: (schema) => schema.required("Required"),
  }),

  preferredCommunicationTypeId: Yup.string().required(
    "Preferred Communication is required",
  ),

  cellNumber: Yup.string()
    .nullable()
    .matches(/^[0-9]*$/, "Mobile phone number must be only numbers")
    .matches(/^[0-9]{10}$/, "Mobile phone number must be 10 digits long")
    // must match valid format
    .matches(/^0[1-9][0-9]{8}$/, {
      message: "Please enter a valid 10-digit mobile number starting with 0.",
    })
    // only validate if preferredCommunicationType is Phone or SMS
    .when("preferredCommunicationTypeId", {
      is: (val) => String(val) === "2" || String(val) === "3",
      then: (schema) => schema.required("Mobile phone number is required"),
    }),

  emailAddress: Yup.string()
    .nullable()
    .when("preferredCommunicationTypeId", {
      is: (val) => String(val) === "1",
      then: (schema) => schema
        .email("Invalid email address")
        .required(
          "Email address is required if preferred communication is email",
        ),
    }),

  // age cannot be more than 65 Or less than 18
  // dateOfBirth validation only for non SA ID, where idTypeId is not 1
  dateOfBirth: Yup.date().when("idTypeId", {
    is: (idTypeId) => idTypeId !== "1",
    then: (schema) => schema.required("Required"),
  }),

  addressLine1: Yup.string().required("Address Line 1 is required"),

  city: Yup.string().required("A city is required"),
  // province: Yup.string().required("A province is required"),

  // postalCode: Yup.string()
  //   .nullable()
  //   .matches(
  //     /^[0-9]{4}$/,
  //     "Postal Code must be 4 digits long and only numbers",
  //   ),
});
