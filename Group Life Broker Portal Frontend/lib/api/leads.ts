import { getRepresentativeId } from "@/lib/auth";
import { apiClient } from "./apiClient";

export interface CreateLeadPayload {
  employerName: string;
  registrationNumber?: string;
  industryType: string;
  numberOfEmployees: number;
  province: string;
  averageSalary: number;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  contactMobile?: string;
  preferredCommunicationMethod?: "Email" | "SMS" | "Phone";
}

export interface QuoteSummary {
  quoteId: string;
  quoteReference: string;
  quoteStatus: string;
  quoteType?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Lead {
  leadId: string;
  leadReference: string;
  employerName: string;
  registrationNumber?: string;
  numberOfEmployees: number;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  status: string;
  quoteStatus?: string; // Kept for backward compatibility
  quotes: QuoteSummary[];
  createdAt: string;
  lastSavedStep?: number; // Track which step the lead was saved at
}

export async function createLead(payload: CreateLeadPayload) {
  return apiClient<{ success: boolean; data: { leadId: string; leadReference: string } }>(
    "/broker/leads",
    { method: "POST", body: JSON.stringify(payload) }
  );
}



export interface LeadFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
  lead_status?: string;
  quoteStatus?: string;
  clientName?: string;
}

export async function getLeads(
  filters?: LeadFilterParams
): Promise<Lead[] & { pagination?: any, metrics?: any }> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        if (Array.isArray(val)) {
          params.append(key, val.join(","));
        } else {
          params.append(key, String(val));
        }
      }
    });
  } else {
    // If no filters are provided, set limit to "10000" for backward compatibility
    params.set("limit", "10000");
  }

  const json = await apiClient<{ success: boolean; data: any }>(
    `/broker/leads?${params.toString()}`,
    { cache: "no-store" }
  );

  const list = Array.isArray(json.data) ? json.data : (json.data?.leads ?? []);

  const resultList: Lead[] & { pagination?: any } = list.map((l: any) => {
    const mappedQuotes = (l.quotes || [])
      .map((q: any) => ({
        quoteId: q.quote_id,
        quoteReference: q.quote_reference,
        quoteStatus: q.quote_status,
        quoteType: q.quote_type,
        expiryDate: q.quote_expiry_date,
        createdAt: q.created_at || q.createdAt,
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      leadId: l.lead_id,
      leadReference: l.lead_reference,
      employerName: l.employer?.employer_name ?? "",
      registrationNumber: l.employer?.registration_number ?? undefined,
      numberOfEmployees: l.employer?.number_of_employees ?? 0,
      contactFirstName: l.contact?.contact_first_name ?? "",
      contactLastName: l.contact?.contact_last_name ?? "",
      contactEmail: l.contact?.contact_email ?? "",
      status: l.lead_status,
      quoteStatus: mappedQuotes?.[0]?.quoteStatus ?? undefined,
      quotes: mappedQuotes,
      createdAt: l.lead_created_at ?? l.createdAt,
      lastSavedStep: l.last_saved_step ?? undefined,
    };
  });

  if (json.data?.total !== undefined) {
    Object.defineProperty(resultList, "pagination", {
      value: { total: json.data.total },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }

  if (json.data?.metrics) {
    Object.defineProperty(resultList, "metrics", {
      value: json.data.metrics,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }

  return resultList;
}

export async function cancelLead(leadId: string, reason: string): Promise<void> {
  const representativeId = getRepresentativeId() ?? undefined;
  await apiClient(`/broker/leads/${leadId}/cancel`, { 
    method: "POST",
    body: JSON.stringify({ reason, representativeId })
  });
}

export interface LeadDetailResponse {
  lead_id: string;
  lead_reference: string;
  lead_status: string;
  employer: {
    employer_name: string;
    industry_type?: string;
    number_of_employees: number;
    province?: string;
    registration_number?: string;
    address?: string;
    average_salary?: number;
  };
  contact: {
    contact_first_name: string;
    contact_last_name: string;
    contact_email: string;
    contact_mobile?: string;
    contact_position?: string;
    preferred_communication_method?: string;
  };
  quotes: Array<{
    quote_id: string;
    quote_reference: string;
    quote_status: string;
    total_premium: number;
    coverage_amount?: number;
    created_at?: string;
    quote_type?: string;
  }>;
}

export interface LeadDetail {
  leadId: string;
  leadReference: string;
  leadStatus: string;
  employerName: string;
  industry?: string;
  numberOfEmployees: number;
  province?: string;
  registrationNumber?: string;
  address?: string;
  averageSalary?: number;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
  contactPosition?: string;
  preferredCommunicationMethod?: string;
  quotes: Array<{
    quoteId: string;
    quoteReference: string;
    quoteType: "Quick Quote" | "Full Quote";
    status: string;
    monthlyPremium: number;
    coverageAmount: number;
    createdAt: string;
  }>;
}

export async function getLead(leadId: string): Promise<LeadDetail> {
  const json = await apiClient<{ success: boolean; data: LeadDetailResponse }>(
    `/broker/leads/${leadId}`,
    { cache: "no-store" }
  );

  const data = json.data;

  return {
    leadId: data.lead_id,
    leadReference: data.lead_reference,
    leadStatus: data.lead_status,
    employerName: data.employer.employer_name,
    industry: data.employer.industry_type,
    numberOfEmployees: data.employer.number_of_employees,
    province: data.employer.province,
    registrationNumber: data.employer.registration_number,
    address: data.employer.address,
    averageSalary: data.employer.average_salary,
    contactFirstName: data.contact.contact_first_name,
    contactLastName: data.contact.contact_last_name,
    contactEmail: data.contact.contact_email,
    contactPhone: data.contact.contact_mobile,
    contactPosition: data.contact.contact_position,
    preferredCommunicationMethod: data.contact.preferred_communication_method,
    quotes: (data.quotes || []).map((q) => ({
      quoteId: q.quote_id,
      quoteReference: q.quote_reference,
      quoteType: (q.quote_type?.toLowerCase() === "full" ? "Full Quote" : "Quick Quote") as "Quick Quote" | "Full Quote",
      status: q.quote_status,
      monthlyPremium: q.total_premium,
      coverageAmount: q.coverage_amount || 0,
      createdAt: q.created_at || new Date().toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

export interface ImportEmployeeItem {
  firstName: string;
  surname: string;
  gender: "M" | "F" | "Other";
  income: number;
  dateOfBirth: string;
  email: string;
  cellNumber: string;
  employmentStartDate: string;
  idNumber: string;
  nationality: string;
}

export interface ImportEmployeesResponse {
  success: boolean;
  totalEmployees: number;
  insertedEmployees: number;
  duplicateEmployees: number;
  message?: string;
  errors?: Array<{
    row: string;
    field: string;
    message: string;
  }>;
}

export async function importEmployees(
  leadId: string,
  employees: ImportEmployeeItem[]
): Promise<ImportEmployeesResponse> {
  return apiClient<ImportEmployeesResponse>("/broker/employees/import", {
    method: "POST",
    body: JSON.stringify({
      lead_id: leadId,
      employees,
    }),
  });
}

export interface SaveDraftPayload {
  leadId: string;
  draftData: {
    step: number;
    employer?: any;
    contact?: any;
    formData?: any;
    timestamp: string;
  };
}

export async function saveDraft(payload: SaveDraftPayload): Promise<any> {
  return apiClient(`/broker/leads/${payload.leadId}/draft`, {
    method: "POST",
    body: JSON.stringify(payload.draftData),
  });
}

export interface UpdateLeadPayload {
  employer?: {
    employerName?: string;
    registrationNumber?: string;
    industryType?: string;
    numberOfEmployees?: number;
    averageSalary?: number;
    province?: string;
  };
  contact?: {
    contact_first_name?: string;
    contact_last_name?: string;
    contact_email?: string;
    contact_mobile?: string;
    preferred_communication_method?: string;
  };
  lastSavedStep?: number;
}

export async function updateLead(leadId: string, payload: UpdateLeadPayload) {
  return apiClient<{ success: boolean; data: any }>(
    `/broker/leads/${leadId}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

