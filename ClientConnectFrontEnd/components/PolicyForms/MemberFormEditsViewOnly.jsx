import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Alert,
  Grid,
  Stack,
  Typography,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import TextfieldWrapper from "components/FormComponents.jsx/TextFieldWrapper";
import DOBPicker from "components/FormComponents.jsx/DobPicker";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadFileButton from "components/Bits/DownloadFileButton";
import customGridSeperator from "components/customStyles/gridSeperator";
import SwitchWrapper from "components/FormComponents.jsx/SwitchWrapper";
import { getAddressTypeLabel } from "src/constants/addressTypes";

const getPreferredCommunicationDescription = (
  preferredCommunicationMethod,
  preferredCommunicationTypeId,
) => {
  return preferredCommunicationMethod?.find(
    (item) => String(item.id) === String(preferredCommunicationTypeId),
  )?.description;
};

const MemberFormEditsViewOnly = ({
  data,
  isEdit,
  preferredCommunicationMethod,
}) => {
  const memberTypeId = data?.PolicyMember?.memberTypeId;
  const isMainMember = memberTypeId === 1;
  const isBeneficiaryMemberType = memberTypeId === 5;
  const showContactDetails =
    isMainMember ||
    isBeneficiaryMemberType ||
    Boolean(data?.PolicyMember?.isBeneficiary);
  const addresses = data?.Addresses || [];

  return (
    <>
      <Formik
        initialValues={{
          id: data ? data?.id : uuidv4(),
          client_type: "main_member",
          confirmed: data?.confirmed || false,
          title: data?.title || "",
          firstName: data?.firstName || "",
          surname: data?.surname || "",
          idNumber: data?.idNumber || "",
          vopdResponse: data?.vopdResponse || "",
          dateOfBirth: data?.dateOfBirth
            ? dayjs(data.dateOfBirth).format("DD-MM-YYYY")
            : "",
          idTypeId: data?.idTypeId || 1,
          isVopdVerified: data?.isVopdVerified || false,
          dateVopdVerified: data?.dateVopdVerified || "",
          cellNumber: data?.cellNumber || "",
          emailAddress: data?.emailAddress || "",
          preferredCommunicationTypeId:
            data?.preferredCommunicationTypeId || "",
          tellNumber: data?.tellNumber || "",
          gender: data?.gender || "",
          rolePlayerId: data?.rolePlayerId || "",
          notes: data?.notes || [],
          AstuteResponse: data?.AstuteResponse || "",
          Addresses: addresses,
          PolicyMember: {
            startDate: data?.PolicyMember?.startDate
              ? dayjs(data?.PolicyMember?.startDate).format("DD-MM-YYYY")
              : "",
            endDate: data?.PolicyMember?.endDate
              ? dayjs(data?.PolicyMember?.endDate).format("DD-MM-YYYY")
              : "",
            memberTypeId: data?.PolicyMember?.memberTypeId || 1,
            isBeneficiary: data?.PolicyMember?.isBeneficiary || false,
            isStudying: data?.PolicyMember?.isStudying || false,
            isDisabled: data?.PolicyMember?.isDisabled || false,
            status: isEdit ? "isEdited" : "New",
            statedBenefitId: data?.PolicyMember?.statedBenefitId || "",
            statedBenefit: data?.PolicyMember?.statedBenefit || "",
          },
          ...data,
        }}
        enableReinitialize={true}
      >
        {({ values }) => {
          return (
            <Form>
              <Grid sx={customGridSeperator}>
                <Typography variant="h6" align="left">
                  Personal Details
                </Typography>
              </Grid>

              <Grid sx={{ my: 2 }} container>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="idTypeId"
                      label="User ID Type"
                      value={
                        values.idTypeId === 1
                          ? "SA ID"
                          : values.idTypeId === 2
                            ? "Passport"
                            : ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <>
                    {values.idTypeId === 1 && (
                      <>
                        <Grid item xs={6}>
                          <TextfieldWrapper
                            type="number"
                            name="idNumber"
                            label="ID Number"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
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
                          name="idNumber"
                          label="Passport Number"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    )}
                  </>

                  <Grid item xs={12}>
                    <DownloadFileButton documents={values?.supportDocument} />
                  </Grid>

                  {values.idTypeId !== 1 && (
                    <>
                      <Grid item xs={4}>
                        <DOBPicker
                          name="dateOfBirth"
                          label="Date of Birth"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextfieldWrapper
                          name="gender"
                          label="Gender"
                          value={
                            values.gender === 1
                              ? "Male"
                              : values.gender === 2
                                ? "Female"
                                : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {data?.AstuteResponse && (
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
                            VOPD Response: {data?.AstuteResponse?.status}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Card>
                            <Stack>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                idNumber : {data?.AstuteResponse?.idNumber}
                              </Typography>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                dateOfBirth: {data?.AstuteResponse?.dateOfBirth}
                              </Typography>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                dateOfDeath: {data?.AstuteResponse?.dateOfDeath}
                              </Typography>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                firstName: {data?.AstuteResponse?.firstName}
                              </Typography>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                surname: {data?.AstuteResponse?.surname}
                              </Typography>
                              <Typography variant="caption" sx={{ p: 2 }}>
                                maritalStatus:{" "}
                                {data?.AstuteResponse?.maritalStatus}
                              </Typography>
                            </Stack>
                          </Card>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextfieldWrapper
                    name="firstName"
                    label="First Name"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextfieldWrapper
                    name="surname"
                    label="Surname"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>

              {!isBeneficiaryMemberType && (
                <>
                  <Grid sx={customGridSeperator}>
                    <Typography variant="h6" align="left" sx={{ mb: 3 }}>
                      Benefit Details
                    </Typography>
                  </Grid>

                  <Grid sx={{ pt: 2 }} container spacing={2}>
                    <Grid sx={{ pt: 2 }} item xs={6}>
                      <TextfieldWrapper
                        InputProps={{
                          readOnly: true,
                        }}
                        name="PolicyMember.statedBenefit"
                        label="Benefit"
                      />
                    </Grid>
                  </Grid>

                  <Grid sx={{ pt: 2 }} container spacing={2}>
                    <Grid sx={{ pt: 2 }} item xs={6}>
                      <TextfieldWrapper
                        InputProps={{
                          readOnly: true,
                        }}
                        name="PolicyMember.startDate"
                        label="Start Date"
                      />
                    </Grid>
                    {data?.PolicyMember?.endDate && (
                      <Grid sx={{ pt: 2 }} item xs={6}>
                        <TextfieldWrapper
                          InputProps={{
                            readOnly: true,
                          }}
                          name="PolicyMember.endDate"
                          label="End Date"
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid sx={{ pt: 2 }} container spacing={2}>
                    <Grid sx={{ pt: 2 }} item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(values.PolicyMember?.isStudying)}
                            disabled={true}
                          />
                        }
                        label="Is Student"
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(values.PolicyMember?.isDisabled)}
                            disabled={true}
                          />
                        }
                        label="Is Disabled"
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end">
                <SwitchWrapper
                  value={values.PolicyMember?.isBeneficiary ? true : false}
                  name="PolicyMember.isBeneficiary"
                  label="Beneficiary"
                />
              </Stack>

              {showContactDetails && (
                <>
                  <Grid sx={customGridSeperator}>
                    <Typography variant="h6" align="left" sx={{ mb: 3 }}>
                      Contact Details
                    </Typography>
                  </Grid>

                  <Grid container sx={{ pt: 2 }} spacing={2}>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        name="preferredCommunicationTypeId"
                        label="Preferred Communication"
                        InputProps={{
                          readOnly: true,
                        }}
                        value={getPreferredCommunicationDescription(
                          preferredCommunicationMethod,
                          values.preferredCommunicationTypeId,
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        type="number"
                        name="cellNumber"
                        label="Mobile Phone Number"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        type="number"
                        name="tellNumber"
                        label="Telephone Number"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextfieldWrapper
                        name="emailAddress"
                        label="Email Address"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {isMainMember && (
                <>
                  <Grid sx={customGridSeperator}>
                    <Typography variant="h6" align="left" sx={{ mb: 3 }}>
                      Address Details
                    </Typography>
                  </Grid>

                  {addresses.length > 0 ? (
                    addresses.map((address, index) => {
                      return (
                        <Card
                          sx={{ my: 2 }}
                          key={`${address?.AddressTypeId}-${index}`}
                        >
                          <Stack sx={{ p: 2 }} spacing={2}>
                            <Typography variant="subtitle2">
                              {getAddressTypeLabel(address?.AddressTypeId)}{" "}
                              Address
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].AddressLine1`}
                                  label="Address Line 1"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.AddressLine1 || ""}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].AddressLine2`}
                                  label="Address Line 2"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.AddressLine2 || ""}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].Suburb`}
                                  label="Suburb"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.Suburb || ""}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].City`}
                                  label="City"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.City || ""}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].PostalCode`}
                                  label="Postal Code"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.PostalCode || ""}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextfieldWrapper
                                  name={`Addresses[${index}].Country`}
                                  label="Country"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={address?.Country || "SOUTH AFRICA"}
                                />
                              </Grid>
                            </Grid>
                          </Stack>
                        </Card>
                      );
                    })
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      No address details available.
                    </Alert>
                  )}
                </>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default MemberFormEditsViewOnly;
