import { apiClient } from "./apiClient";

export interface SaveEmployeesPayload {
  lead_id: string;
  employees: any[];
}

export async function saveEmployees(
  payload: SaveEmployeesPayload
): Promise<{ success: boolean; data: any }> {
  return apiClient("/broker/employees/import", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getEmployees(
  leadId: string
): Promise<{ success: boolean; data: any[] }> {
  return apiClient(`/broker/employees/${leadId}`);
}
export async function deleteEmployee(
  leadId: string,
  employeeId: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  return apiClient(`/broker/employees/${leadId}/${employeeId}`, {
    method: "DELETE",
  });
}

export async function updateEmployee(
  leadId: string,
  employeeId: string,
  payload: any
): Promise<{ success: boolean; data?: any; message?: string }> {
  return apiClient(`/broker/employees/${leadId}/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
