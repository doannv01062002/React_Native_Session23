// screens/EditContactScreen.tsx
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import ContactForm from '../components/ContactForm';
import { useContactData } from '../hooks/useContactData';
import { Contact, ContactFormData, RootStackParamList } from '../types';

type EditContactNavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;
type EditContactRouteProp = RouteProp<RootStackParamList, 'EditContact'>;

export default function EditContactScreen() {
  const navigation = useNavigation<EditContactNavigationProp>();
  const route = useRoute<EditContactRouteProp>();
  const { contactId } = route.params;
  const { getContactById, updateContact } = useContactData();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const contactData = await getContactById(contactId);
        setContact(contactData);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin liên hệ');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId]);

  const handleSubmit = async (data: ContactFormData) => {
    try {
      await updateContact(contactId, data);
      Alert.alert('Thành công', 'Đã cập nhật liên hệ', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy liên hệ</Text>
      </View>
    );
  }

  const initialData: Partial<ContactFormData> = {
    name: contact.name,
    phone: contact.phone,
    tag: contact.tag,
  };

  return (
    <ContactForm
      initialData={initialData}
      onSubmit={handleSubmit}
      submitText="Cập nhật"
    />
  );
}