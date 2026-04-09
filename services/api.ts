import { AUTH_STORAGE_KEY, type AuthSession, type AuthUser } from '../auth/session';
import { Client, Invoice, PaymentDetails, Quote, QuoteStatus, RepairOrder } from '../types';

const API_BASE = '/api/v1';

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

const getStoredSession = (): AuthSession | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

const getAuthToken = (): string | null => getStoredSession()?.token ?? null;

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };
  const token = getAuthToken();
  if (token && !path.startsWith('/auth/login')) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    unauthorizedHandler?.();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let message = `API error ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) {
        message = body.error;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: AuthSession['user'] }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ user: AuthSession['user'] }>('/auth/me'),
  },
  clients: {
    list: () => request<Client[]>('/clients'),
    create: (payload: Omit<Client, 'id'>) => request<Client>('/clients', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Omit<Client, 'id'>) => request<Client>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
  },
  quotes: {
    list: () => request<Quote[]>('/quotes'),
    create: (payload: Omit<Quote, 'id'>) => request<Quote>('/quotes', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Omit<Quote, 'id'>) => request<Quote>(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    changeStatus: (id: string, status: QuoteStatus) => request<Quote>(`/quotes/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    remove: (id: string) => request<void>(`/quotes/${id}`, { method: 'DELETE' }),
  },
  repairOrders: {
    list: () => request<RepairOrder[]>('/repair-orders'),
    createFromQuote: (quoteId: string) => request<RepairOrder>('/repair-orders', { method: 'POST', body: JSON.stringify({ quoteId }) }),
    update: (id: string, payload: Partial<RepairOrder>) => request<RepairOrder>(`/repair-orders/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/repair-orders/${id}`, { method: 'DELETE' }),
  },
  invoices: {
    list: () => request<Invoice[]>('/invoices'),
    createFromRepairOrder: (repairOrderId: string) => request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify({ repairOrderId }) }),
    pay: (invoiceId: string, payload: PaymentDetails) => request<Invoice>(`/invoices/${invoiceId}/pay`, { method: 'POST', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/invoices/${id}`, { method: 'DELETE' }),
  },
  users: {
    list: () => request<AuthUser[]>('/users'),
    create: (payload: { email: string; displayName: string; role: AuthUser['role']; password: string }) =>
      request<AuthUser>('/users', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: { email?: string; displayName?: string; role?: AuthUser['role'] }) =>
      request<AuthUser>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    setPassword: (id: string, password: string) =>
      request<void>(`/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ password }) }),
    remove: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
  },
};
