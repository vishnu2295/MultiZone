import { apiClient } from "./apiClient";

export interface AuditLogFilterParams {
  eventType?: string;
  outcome?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

function buildParams(filters?: AuditLogFilterParams): URLSearchParams {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, String(val));
      }
    });
  }
  return params;
}

export async function getAuditLogs(filters?: AuditLogFilterParams): Promise<{ logs: any[]; totalCount: number }> {
  const params = buildParams(filters);

  const json = await apiClient<{ success: boolean; data: any }>(
    `/audit/logs?${params.toString()}`,
    { cache: "no-store" }
  );

  return {
    logs: json.data?.rows || [],
    totalCount: json.data?.count || 0
  };
}

export async function getLeadAuditLogs(leadId: string, filters?: AuditLogFilterParams): Promise<{ logs: any[]; totalCount: number }> {
  const params = buildParams(filters);

  const json = await apiClient<{ success: boolean; data: any }>(
    `/broker/leads/${leadId}/audit?${params.toString()}`,
    { cache: "no-store" }
  );

  return {
    logs: json.data?.rows || (Array.isArray(json.data) ? json.data : []),
    totalCount: json.data?.count || (Array.isArray(json.data) ? json.data.length : 0)
  };
}
