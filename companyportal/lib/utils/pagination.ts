// Some list endpoints report an unreliable `pageCount` (e.g. it doesn't
// account for status filters), so derive it locally from `rowCount` and the
// page size we actually requested instead of trusting the API's value.
export function computePageCount(rowCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(rowCount / pageSize));
}
