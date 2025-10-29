// app/(tabs)/(contacts)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function ContactStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Danh bạ" }} />
      <Stack.Screen name="[id]" options={{ title: "Chi tiết Liên hệ" }} />
      <Stack.Screen
        name="add"
        options={{ title: "Thêm mới Liên hệ", presentation: "modal" }}
      />
      <Stack.Screen
        name="edit"
        options={{ title: "Chỉnh sửa Liên hệ", presentation: "modal" }}
      />
    </Stack>
  );
}
