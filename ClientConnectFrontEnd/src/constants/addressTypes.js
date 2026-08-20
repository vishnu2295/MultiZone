export const ADDRESS_TYPE = Object.freeze({
  POSTAL: 1,
  PHYSICAL: 2,
});

export const ADDRESS_TYPE_LABELS = Object.freeze({
  [ADDRESS_TYPE.POSTAL]: "Postal",
  [ADDRESS_TYPE.PHYSICAL]: "Physical",
});

export const ADDRESS_TYPE_OPTIONS = Object.freeze([
  {
    value: ADDRESS_TYPE.PHYSICAL,
    label: ADDRESS_TYPE_LABELS[ADDRESS_TYPE.PHYSICAL],
  },
  { value: ADDRESS_TYPE.POSTAL, 
    label: ADDRESS_TYPE_LABELS[ADDRESS_TYPE.POSTAL] 
  },
]);

export const getAddressTypeLabel = (addressTypeId) =>
  ADDRESS_TYPE_LABELS[Number(addressTypeId)] || "Address";
