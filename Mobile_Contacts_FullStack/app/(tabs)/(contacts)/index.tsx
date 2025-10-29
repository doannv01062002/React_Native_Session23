// app/(tabs)/(contacts)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContactData } from '../../../hooks/useContactData';
import { Contact, RootStackParamList, TagColors, TagLabels } from '../../../types';

type ContactListNavigationProp = StackNavigationProp<RootStackParamList, 'ContactList'>;

interface SectionData {
  title: string;
  data: Contact[];
}

export default function ContactListScreen() {
  const navigation = useNavigation<ContactListNavigationProp>();
  const { contacts, loading, loadContacts, deleteContact } = useContactData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  // Lọc contacts theo search query và isBlocked = false
  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (contact) =>
        !contact.isBlocked &&
        (contact.name.toLowerCase().includes(query) || contact.phone.includes(query))
    );
  }, [contacts, searchQuery]);

  // Nhóm contacts theo tag
  const sections: SectionData[] = useMemo(() => {
    const groups: Record<string, Contact[]> = {};

    filteredContacts.forEach((contact) => {
      const tagLabel = TagLabels[contact.tag];
      if (!groups[tagLabel]) {
        groups[tagLabel] = [];
      }
      groups[tagLabel].push(contact);
    });

    return Object.keys(groups)
      .sort()
      .map((title) => ({
        title,
        data: groups[title].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [filteredContacts]);

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  const handleEditContact = (contact: Contact) => {
    navigation.navigate('EditContact', { contactId: contact.id });
  };

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedContact) {
      try {
        await deleteContact(selectedContact.id);
        Alert.alert('Thành công', 'Đã xóa liên hệ');
      } catch (error: any) {
        Alert.alert('Lỗi', error.message);
      }
    }
    setDeleteModalVisible(false);
    setSelectedContact(null);
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('ContactDetail', { contactId: contact.id });
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleContactPress(item)}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPhone}>{item.phone}</Text>
        <View style={[styles.tagBadge, { backgroundColor: TagColors[item.tag] }]}>
          <Text style={styles.tagText}>{TagLabels[item.tag]}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => handleEditContact(item)} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteContact(item)} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh bạ</Text>
        <TouchableOpacity onPress={handleAddContact} style={styles.addButton}>
          <Ionicons name="add-circle" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc SĐT..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Contact List */}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
                keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Danh bạ trống</Text>
          </View>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn xóa liên hệ này?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={confirmDelete}>
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: '#f4f4f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemPhone: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginRight: 15,
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
