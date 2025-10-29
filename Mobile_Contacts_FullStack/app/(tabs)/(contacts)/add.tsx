// app/(tabs)/(contacts)/add.tsx
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Alert } from 'react-native';
import ContactForm from '../../../components/ContactForm';
import { useContactData } from '../../../hooks/useContactData';
import { ContactFormData, RootStackParamList } from '../../../types';

type AddContactNavigationProp = StackNavigationProp<RootStackParamList, 'AddContact'>;

export default function AddContactScreen() {
  const navigation = useNavigation<AddContactNavigationProp>();
  const { addContact } = useContactData();

  const handleSubmit = async (data: ContactFormData) => {
    try {
      await addContact(data);
      Alert.alert('Thành công', 'Đã thêm liên hệ mới', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <ContactForm onSubmit={handleSubmit} submitText="Thêm Liên Hệ" />
  );
}
