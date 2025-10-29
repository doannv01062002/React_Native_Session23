import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import screens
import AddContactScreen from '../screens/AddContactScreen';
import BlacklistScreen from '../screens/BlacklistScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import ContactListScreen from '../screens/ContactListScreen';
import EditContactScreen from '../screens/EditContactScreen';
import HomeScreen from '../screens/HomeScreen';

import { RootStackParamList, TabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function ContactStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContactList" component={ContactListScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="EditContact" component={EditContactScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Contacts') {
            iconName = 'people';
          } else if (route.name === 'Blacklist') {
            iconName = 'shield-checkmark';
          } else {
            iconName = 'help';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Trang chủ' }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactStack}
        options={{ title: 'Danh bạ', headerShown: false }}
      />
      <Tab.Screen
        name="Blacklist"
        component={BlacklistScreen}
        options={{ title: 'Danh sách đen' }}
      />
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