# Hướng Dẫn Phát Triển Frontend React Native Cho Ứng Dụng Quản Lý Danh Bạ

## Tổng Quan Dự Án

Ứng dụng quản lý danh bạ fullstack với backend Java Spring Boot và frontend React Native (Expo). Frontend sử dụng SectionList để hiển thị danh bạ theo nhóm, Modal cho form thêm/sửa, Switch để chặn/bỏ chặn liên hệ, và react-hook-form để quản lý form.

## Yêu Cầu Kỹ Thuật

- React Native với Expo
- React Navigation (Stack & Tab)
- React Hook Form
- Axios cho API calls
- AsyncStorage (tùy chọn cho cache local)

### 3. Cài Đặt Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-hook-form @hookform/resolvers yup
npm install axios
npm install @react-native-async-storage/async-storage
```

## Cấu Hình API

### Tạo File API Service

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Thay đổi theo backend

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
```

## Định Nghĩa Types

```typescript
// src/types/index.ts
export type TagType = 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  tag: TagType;
  isBlocked: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  tag: TagType;
}

export type RootStackParamList = {
  ContactList: undefined;
  AddContact: undefined;
  EditContact: { contact: Contact };
  ContactDetail: { contactId: number };
  Blacklist: undefined;
};
```

## Navigation Setup

### Cấu Hình React Navigation

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  ContactList: undefined;
  AddContact: undefined;
  EditContact: { contact: Contact };
  ContactDetail: { contactId: number };
  Blacklist: undefined;
};

export type TabParamList = {
  Contacts: undefined;
  Blacklist: undefined;
};
```

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ContactListScreen from '../screens/ContactListScreen';
import AddContactScreen from '../screens/AddContactScreen';
import EditContactScreen from '../screens/EditContactScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import BlacklistScreen from '../screens/BlacklistScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function ContactStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ContactList" component={ContactListScreen} options={{ title: 'Danh Bạ' }} />
      <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: 'Thêm Liên Hệ' }} />
      <Stack.Screen name="EditContact" component={EditContactScreen} options={{ title: 'Chỉnh Sửa' }} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={{ title: 'Chi Tiết' }} />
    </Stack.Navigator>
  );
}

function BlacklistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Blacklist" component={BlacklistScreen} options={{ title: 'Danh Sách Đen' }} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={{ title: 'Chi Tiết' }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Contacts" component={ContactStack} options={{ title: 'Danh Bạ' }} />
      <Tab.Screen name="Blacklist" component={BlacklistStack} options={{ title: 'Chặn' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
```

## Components

### ContactItem Component

```typescript
// src/components/ContactItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../types';

interface ContactItemProps {
  contact: Contact;
  onPress: () => void;
  onToggleBlock: () => void;
}

export default function ContactItem({ contact, onPress, onToggleBlock }: ContactItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
        <Text style={styles.tag}>{contact.tag}</Text>
      </View>
      <TouchableOpacity style={styles.blockButton} onPress={onToggleBlock}>
        <Text style={styles.blockText}>
          {contact.isBlocked ? 'Bỏ Chặn' : 'Chặn'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  tag: {
    fontSize: 12,
    color: '#999',
  },
  blockButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  blockText: {
    color: 'red',
  },
});
```

### ContactForm Component (sử dụng react-hook-form)

```typescript
// src/components/ContactForm.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ContactFormData, TagType } from '../types';

const schema = yup.object().shape({
  name: yup.string().required('Tên là bắt buộc').max(255, 'Tên không quá 255 ký tự'),
  phone: yup.string().required('Số điện thoại là bắt buộc').matches(/^(\+84|0)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ'),
  tag: yup.mixed<TagType>().oneOf(['FAMILY', 'FRIEND', 'COLLEAGUE', 'OTHER']).required('Tag là bắt buộc'),
});

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  submitText: string;
}

export default function ContactForm({ initialData, onSubmit, submitText }: ContactFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const onFormSubmit = (data: ContactFormData) => {
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Tên"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <Controller
        control={control}
        name="tag"
        render={({ field: { onChange, value } }) => (
          <View style={styles.tagContainer}>
            {(['FAMILY', 'FRIEND', 'COLLEAGUE', 'OTHER'] as TagType[]).map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagButton, value === tag && styles.selectedTag]}
                onPress={() => onChange(tag)}
              >
                <Text style={value === tag ? styles.selectedTagText : styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.tag && <Text style={styles.error}>{errors.tag.message}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitText}>{submitText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagButton: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedTag: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    color: '#333',
  },
  selectedTagText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## Screens

### ContactListScreen (sử dụng SectionList)

```typescript
// src/screens/ContactListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, SectionList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact, RootStackParamList } from '../types';
import { contactApi } from '../services/api';
import ContactItem from '../components/ContactItem';

type ContactListNavigationProp = StackNavigationProp<RootStackParamList, 'ContactList'>;

interface SectionData {
  title: string;
  data: Contact[];
}

export default function ContactListScreen() {
  const navigation = useNavigation<ContactListNavigationProp>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactApi.getAll();
      setContacts(response.data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh bạ');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (contact: Contact) => {
    try {
      await contactApi.toggleBlock(contact.id);
      loadContacts(); // Reload list
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thay đổi trạng thái');
    }
  };

  const sections: SectionData[] = [
    {
      title: 'Gia Đình',
      data: contacts.filter(c => c.tag === 'FAMILY'),
    },
    {
      title: 'Bạn Bè',
      data: contacts.filter(c => c.tag === 'FRIEND'),
    },
    {
      title: 'Đồng Nghiệp',
      data: contacts.filter(c => c.tag === 'COLLEAGUE'),
    },
    {
      title: 'Khác',
      data: contacts.filter(c => c.tag === 'OTHER'),
    },
  ].filter(section => section.data.length > 0);

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactItem
      contact={item}
      onPress={() => navigation.navigate('ContactDetail', { contactId: item.id })}
      onToggleBlock={() => handleToggleBlock(item)}
    />
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

### AddContactScreen

```typescript
// src/screens/AddContactScreen.tsx
import React from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ContactFormData } from '../types';
import { contactApi } from '../services/api';
import ContactForm from '../components/ContactForm';

type AddContactNavigationProp = StackNavigationProp<RootStackParamList, 'AddContact'>;

export default function AddContactScreen() {
  const navigation = useNavigation<AddContactNavigationProp>();

  const handleSubmit = async (data: ContactFormData) => {
    try {
      await contactApi.create(data);
      Alert.alert('Thành công', 'Đã thêm liên hệ mới', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ContactForm onSubmit={handleSubmit} submitText="Thêm Liên Hệ" />
    </View>
  );
}
```

## Custom Hook cho Quản Lý State

```typescript
// src/hooks/useContacts.ts
import { useState, useEffect } from 'react';
import { Contact } from '../types';
import { contactApi } from '../services/api';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactApi.getAll();
      setContacts(response.data);
    } catch (err) {
      setError('Không thể tải danh bạ');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'isBlocked'>) => {
    try {
      const response = await contactApi.create(contactData);
      setContacts(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateContact = async (id: number, contactData: Omit<Contact, 'id' | 'isBlocked'>) => {
    try {
      const response = await contactApi.update(id, contactData);
      setContacts(prev => prev.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const toggleBlock = async (id: number) => {
    try {
      const response = await contactApi.toggleBlock(id);
      setContacts(prev => prev.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await contactApi.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err;
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
    addContact,
    updateContact,
    toggleBlock,
    deleteContact,
  };
}
```

## Chạy Ứng Dụng

```bash
# Khởi động Metro bundler
npm start

# Hoặc chạy trên thiết bị
npm run android  # Android
npm run ios      # iOS
```

## Lưu Ý Quan Trọng

1. **Quản Lý State**: Sử dụng custom hook `useContacts` để đồng bộ state giữa các màn hình
2. **Error Handling**: Xử lý lỗi API và hiển thị thông báo phù hợp
3. **Validation**: Sử dụng Yup với react-hook-form để validate form
4. **Navigation**: Sử dụng React Navigation để chuyển đổi giữa các màn hình
5. **Performance**: Sử dụng SectionList cho danh sách lớn, tối ưu re-render

## Tích Hợp Với Backend

- Đảm bảo backend đang chạy trên `http://localhost:8080`
- Cập nhật `API_BASE_URL` trong `src/services/api.ts` nếu cần
- Test các API endpoints qua Swagger UI trước khi tích hợp

Hướng dẫn này cung cấp nền tảng hoàn chỉnh để phát triển frontend React Native cho ứng dụng quản lý danh bạ. Bạn có thể mở rộng thêm tính năng như tìm kiếm, sắp xếp, hoặc đồng bộ offline.</content>
<parameter name="filePath">d:\KyIV\ReactNative\session23\ContactAPI\FRONTEND_GUIDE.md
