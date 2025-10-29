// types.ts
export type TagType = 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';

export const TagLabels: Record<TagType, string> = {
  FAMILY: 'Gia đình',
  FRIEND: 'Bạn bè',
  COLLEAGUE: 'Đồng nghiệp',
  OTHER: 'Khác',
};

export const TagColors: Record<TagType, string> = {
  FAMILY: '#FF6B6B',
  FRIEND: '#4ECDC4',
  COLLEAGUE: '#45B7D1',
  OTHER: '#96CEB4',
};

export interface Contact {
  id: number;
  name: string;
  phone: string;
  tag: TagType;
  isBlocked: boolean;
}

// Dùng cho Form
export interface ContactFormData {
  name: string;
  phone: string;
  tag: TagType;
}

// Dùng cho SectionList
export interface ContactSection {
  title: string;
  data: Contact[];
}

// Navigation types
export type RootStackParamList = {
  ContactList: undefined;
  AddContact: undefined;
  EditContact: { contactId: number };
  ContactDetail: { contactId: number };
};

export type TabParamList = {
  Home: undefined;
  Contacts: undefined;
  Blacklist: undefined;
};
