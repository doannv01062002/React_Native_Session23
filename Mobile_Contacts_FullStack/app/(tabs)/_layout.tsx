// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#007AFF" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(contacts)" // Thư mục stack Danh bạ
        options={{
          title: "Danh bạ",
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blacklist" // File blacklist.tsx
        options={{
          title: "Danh sách đen",
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="shield-checkmark" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
