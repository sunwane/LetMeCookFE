import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="EditInforScreen" 
        options={{
          headerShown: true,
          title: 'Chỉnh sửa thông tin',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#FF5D00',
          headerTitleAlign: 'center',
        }} 
      />
    </Stack>
  );
}
