import { apiClient } from "./apiClient";
export async function getDashboardMetrics(): Promise<any> {
  const json = await apiClient<{ success: boolean; data: any }>(
    `/broker/dashboard/metrics`,
    { cache: "no-store" }
  );
  return json.data;
}
