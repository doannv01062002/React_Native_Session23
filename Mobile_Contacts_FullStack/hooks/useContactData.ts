// hooks/useContactData.ts
import { useEffect, useState } from 'react';
import { contactApi } from '../services/api';
import { Contact, ContactFormData } from '../types';

export const useContactData = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactApi.getAll();
      setContacts(response.data);
    } catch (err: any) {
      setError('Không thể tải danh bạ');
      console.error('Load contacts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockedContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactApi.getBlocked();
      setContacts(response.data);
    } catch (err: any) {
      setError('Không thể tải danh sách đen');
      console.error('Load blocked contacts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getContactById = async (id: number): Promise<Contact | null> => {
    try {
      const response = await contactApi.getById(id);
      return response.data;
    } catch (err: any) {
      console.error('Get contact by id error:', err);
      return null;
    }
  };

  const addContact = async (contactData: ContactFormData) => {
    try {
      const response = await contactApi.create(contactData);
      setContacts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể thêm liên hệ');
    }
  };

  const updateContact = async (id: number, contactData: ContactFormData) => {
    try {
      const response = await contactApi.update(id, contactData);
      setContacts(prev => prev.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể cập nhật liên hệ');
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await contactApi.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể xóa liên hệ');
    }
  };

  const toggleBlockStatus = async (id: number) => {
    try {
      const response = await contactApi.toggleBlock(id);
      setContacts(prev => prev.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể thay đổi trạng thái');
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    loadContacts,
    loadBlockedContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact,
    toggleBlockStatus,
  };
};
