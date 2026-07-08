const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/payer';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function getToken(): string | null {
  return localStorage.getItem('payer_token');
}

export function setToken(token: string) {
  localStorage.setItem('payer_token', token);
}

export function clearToken() {
  localStorage.removeItem('payer_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = json?.error || json;
    throw new ApiError(
      err?.message || 'Request failed',
      res.status,
      err?.code || 'UNKNOWN_ERROR',
    );
  }

  return json.data ?? json;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  auth: {
    login: (email: string, password: string) =>
      request<{ user: unknown; token: string }>('/auth/login', { method: 'POST', body: { email, password } }),
    register: (name: string, email: string, password: string) =>
      request<{ user: unknown; token: string }>('/auth/register', { method: 'POST', body: { name, email, password } }),
    me: () => request<unknown>('/auth/me'),
  },

  checkout: {
    createOrder: (data: {
      amount: number;
      currency?: string;
      customerEmail: string;
      customerName?: string;
      orderReference?: string;
      callbackUrl?: string;
      accountId?: string;
    }) => request<{ checkoutLink: string; orderReference: string }>('/payments/checkout-order', { method: 'POST', body: data }),
  },

  transactions: {
    list: (params?: { page?: number; type?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.type) q.set('type', params.type);
      if (params?.status) q.set('status', params.status);
      return request<unknown[]>(`/transactions?${q.toString()}`);
    },
    requery: (sessionId: string) => request<unknown>(`/requery/session/${sessionId}`),
    syncFromNomba: (params?: { page?: number; limit?: number; from?: string; to?: string; type?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.from) q.set('from', params.from);
      if (params?.to) q.set('to', params.to);
      if (params?.type) q.set('type', params.type);
      if (params?.status) q.set('status', params.status);
      return request<unknown>(`/transactions/sync?${q.toString()}`);
    },
  },

  payroll: {
    transfer: (data: {
      amount: number;
      recipientAccount: string;
      recipientBank: string;
      recipientName: string;
      narration?: string;
    }) => request<unknown>('/payroll/transfer', { method: 'POST', body: data }),
    bankLookup: (accountNumber: string, bankCode: string) =>
      request<{ accountName: string; accountNumber: string }>('/payroll/bank-lookup', { method: 'POST', body: { accountNumber, bankCode } }),
    fetchBanks: () => request<{ code: string; name: string }[]>('/payroll/banks'),
    runPayroll: () => request<unknown>('/payroll/payroll/run', { method: 'POST' }),
  },

  staff: {
    list: () => request<unknown[]>('/staff'),
    create: (data: { name: string; accountNumber: string; bankCode: string; salary: number; email?: string }) =>
      request<unknown>('/staff', { method: 'POST', body: data }),
    update: (id: string, data: Record<string, unknown>) =>
      request<unknown>(`/staff/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => request<void>(`/staff/${id}`, { method: 'DELETE' }),
  },

  utilities: {
    airtime: (phoneNumber: string, amount: number, network: string) =>
      request<unknown>('/utilities/airtime', { method: 'POST', body: { phoneNumber, amount, network } }),
    dataPlans: (telco: string) => request<{ amount: number; plan: string }[]>(`/utilities/data-plans/${telco}`),
    billers: () => request<unknown[]>('/utilities/billers'),
    payBill: (data: { biller: string; amount: number; customerId?: string }) =>
      request<unknown>('/utilities/bill-payments', { method: 'POST', body: data }),
  },

  virtualAccounts: {
    list: () => request<unknown[]>('/virtual-accounts'),

    create: (data: { accountRef: string; accountName: string; currency?: string }) =>
      request<unknown>('/virtual-accounts', { method: 'POST', body: data }),
    lookup: (acctNumber: string) => request<unknown>(`/virtual-accounts/${acctNumber}`),
  },

  products: {
    list: () => request<{ id: string; name: string; brand: string; price: number; photo: string; description: string; stock: number }[]>('/products'),
  },
};
