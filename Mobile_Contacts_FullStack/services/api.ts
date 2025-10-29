import axios from 'axios';

const API_BASE_URL = 'http://192.168.2.181:8080/api/v1'; // Thay đổi theo backend

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Contact {
  id: number;
  name: string;
  phone: string;
  tag: 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';
  isBlocked: boolean;
}

export interface ContactRequest {
  name: string;
  phone: string;
  tag: 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';
}

// API functions
export const contactApi = {
  getAll: () => api.get<Contact[]>('/contacts'),
  getBlocked: () => api.get<Contact[]>('/contacts/blocked'),
  getById: (id: number) => api.get<Contact>(`/contacts/${id}`),
  create: (data: ContactRequest) => api.post<Contact>('/contacts', data),
  update: (id: number, data: ContactRequest) => api.put<Contact>(`/contacts/${id}`, data),
  toggleBlock: (id: number) => api.patch<Contact>(`/contacts/${id}/toggle-block`),
  delete: (id: number) => api.delete(`/contacts/${id}`),
};