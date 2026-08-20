export const DATE_DISPLAY_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
export const DATE_DB_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats a raw input string to a date mask in the format DD/MM/YYYY,
 * limiting the raw input to exactly 8 numeric digits.
 * e.g., "12" -> "12", "123" -> "12/3", "12345678" -> "12/34/5678"
 */
export const formatToDateMask = (val: string): string => {
  // Strip all non-digits and slice to max 8 characters (DDMMYYYY)
  const digits = val.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

/**
 * Converts a DD/MM/YYYY date string to YYYY-MM-DD for database/API compatibility.
 */
export const toDbFormat = (val: string): string => {
  if (!val) return "";
  if (DATE_DISPLAY_REGEX.test(val)) {
    const [d, m, y] = val.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return val;
};

/**
 * Converts a YYYY-MM-DD date string to a DD/MM/YYYY string for display layout.
 */
export const toDisplayFormat = (val: string): string => {
  if (!val) return "";
  if (DATE_DB_REGEX.test(val)) {
    const [y, m, d] = val.split("-");
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  if (DATE_DISPLAY_REGEX.test(val)) {
    return val;
  }
  return val;
};

/**
 * Validates whether the given string is a valid calendar date.
 * Supports both display format (DD/MM/YYYY) and database format (YYYY-MM-DD).
 * Rejects non-existent dates like 31/02/2025 and invalid values like 99/99/9999.
 */
export const isValidDate = (val: string): boolean => {
  if (!val) return false;
  let d = 0, m = 0, y = 0;

  if (DATE_DISPLAY_REGEX.test(val)) {
    const parts = val.split("/").map(Number);
    d = parts[0];
    m = parts[1];
    y = parts[2];
  } else if (DATE_DB_REGEX.test(val)) {
    const parts = val.split("-").map(Number);
    y = parts[0];
    m = parts[1];
    d = parts[2];
  } else {
    return false;
  }

  // Basic numeric range checks
  if (y < 1000 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) {
    return false;
  }

  // JS Date will auto-roll invalid dates (e.g. Feb 31 -> March 3).
  // Checking if the components match after initialization detects auto-rollover.
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};
