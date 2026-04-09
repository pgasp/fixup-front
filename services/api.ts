import { Client, Invoice, PaymentDetails, Quote, QuoteStatus, RepairOrder } from '../types';

const API_BASE = '/api/v1';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
};

export const apiClient = {
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
};
