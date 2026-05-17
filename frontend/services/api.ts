import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  whatsappNumber: string;
  name: string;
  instagramLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPayload {
  whatsappNumber: string;
  name: string;
  instagramLink?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface CheckCustomerResponse {
  success: boolean;
  exists: boolean;
  data?: Customer;
  message?: string;
}

export interface StatsData {
  total: number;
  todayCount: number;
  weekCount: number;
  recentCustomers: Customer[];
}

// ─── Customer API ────────────────────────────────────────────────────────────

export const customerApi = {
  getAll: async (search = "", page = 1, limit = 50) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(limit));
    const { data } = await api.get<ApiResponse<Customer[]>>(
      `/customers?${params}`
    );
    return data;
  },

  checkByPhone: async (phone: string): Promise<CheckCustomerResponse> => {
    // Try all common Indian phone formats in parallel — matches regardless of how it was stored
    const digits = phone.replace(/\D/g, "");
    const ten = digits.slice(-10);
    const variants = [...new Set([phone.trim(), ten, `+91${ten}`, `91${ten}`])];

    const results = await Promise.allSettled(
      variants.map((v) =>
        api.get<CheckCustomerResponse>(`/customers/${encodeURIComponent(v)}`)
      )
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value.data?.exists) {
        return r.value.data;
      }
    }
    return { success: true, exists: false };
  },

  create: async (payload: CustomerPayload) => {
    const { data } = await api.post<ApiResponse<Customer>>(
      "/customers",
      payload
    );
    return data;
  },

  update: async (id: string, payload: Partial<CustomerPayload>) => {
    const { data } = await api.put<ApiResponse<Customer>>(
      `/customers/${id}`,
      payload
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ success: boolean; message: string }>(
      `/customers/${id}`
    );
    return data;
  },

  getStats: async () => {
    const { data } = await api.get<ApiResponse<StatsData>>(
      "/customers/stats"
    );
    return data;
  },
};

// ─── Export API ──────────────────────────────────────────────────────────────

export const exportApi = {
  downloadExcel: () => {
    const url = `${API_URL}/api/export/excel`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `GodGift-CRM-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default api;
