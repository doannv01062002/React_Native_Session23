// screens/BlacklistScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContactData } from '../hooks/useContactData';
import { Contact } from '../types';

export default function BlacklistScreen() {
  const { contacts, loadBlockedContacts, toggleBlockStatus } = useContactData();
  const [blockedContacts, setBlockedContacts] = useState<Contact[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadBlockedContacts();
    }, [])
  );

  useEffect(() => {
    setBlockedContacts(contacts.filter(c => c.isBlocked));
  }, [contacts]);

  const handleUnblock = async (contact: Contact) => {
    try {
      await toggleBlockStatus(contact.id);
      Alert.alert('Thành công', `Đã bỏ chặn ${contact.name}`);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.phoneText}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
      >
        <Text style={styles.unblockButtonText}>Bỏ chặn</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {blockedContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Danh sách đen trống</Text>
        </View>
      ) : (
        <FlatList
          data={blockedContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#aaa', marginTop: 10 },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  nameText: { fontSize: 16, fontWeight: '600' },
  phoneText: { fontSize: 14, color: '#555', marginTop: 2 },
  unblockButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  unblockButtonText: { color: 'white', fontWeight: 'bold' },
});