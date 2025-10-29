// screens/ContactDetailScreen.tsx
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContactData } from '../hooks/useContactData';
import { Contact, RootStackParamList, TagColors, TagLabels } from '../types';

type ContactDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ContactDetail'>;
type ContactDetailRouteProp = RouteProp<RootStackParamList, 'ContactDetail'>;

export default function ContactDetailScreen() {
  const navigation = useNavigation<ContactDetailNavigationProp>();
  const route = useRoute<ContactDetailRouteProp>();
  const { contactId } = route.params;
  const { getContactById, toggleBlockStatus } = useContactData();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const contactData = await getContactById(contactId);
        if (contactData) {
          setContact(contactData);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin liên hệ');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId]);

  const handleToggleBlock = async () => {
    if (!contact) return;

    try {
      const updatedContact = await toggleBlockStatus(contact.id);
      setContact(updatedContact);
      Alert.alert(
        updatedContact.isBlocked ? 'Đã chặn' : 'Đã bỏ chặn',
        `${contact.name} đã được ${updatedContact.isBlocked ? 'thêm vào' : 'xóa khỏi'} danh sách đen.`
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!contact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Không tìm thấy liên hệ</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{contact.name[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
        <View style={[styles.tagBadge, { backgroundColor: TagColors[contact.tag] }]}>
          <Text style={styles.tagText}>{TagLabels[contact.tag]}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.blockRow}>
          <Text style={styles.blockLabel}>Chặn liên hệ này</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#FF3B30' }}
            thumbColor={'#f4f3f4'}
            onValueChange={handleToggleBlock}
            value={contact.isBlocked}
          />
        </View>
        <Text style={styles.blockDescription}>
          Các cuộc gọi và tin nhắn từ số này sẽ bị chặn và không thông báo cho bạn.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, alignItems: 'center' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: { fontSize: 48, color: 'white', fontWeight: '300' },
  name: { fontSize: 26, fontWeight: '600', marginBottom: 5 },
  phone: { fontSize: 20, color: '#555', marginBottom: 15 },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  tagText: { color: 'white', fontSize: 14, fontWeight: '500' },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 30,
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  blockLabel: { fontSize: 16, fontWeight: '500' },
  blockDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 8,
    width: '100%',
  },
});