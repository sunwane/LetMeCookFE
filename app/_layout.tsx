import "@/config/globalTextConfig"; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Default: ẩn header cho tất cả
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="ForgotPasswordScreen" />
      <Stack.Screen
        name="EditInforScreen"
        options={{
          headerShown: true,
          title: "Chỉnh sửa thông tin",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#FF5D00",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="EditAccountScreen"
        options={{
          headerShown: true,
          title: "Thay đổi mật khẩu",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#FF5D00",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="NotificationScreen"
        options={{
          headerShown: false, // Sử dụng custom header
        }}
      />
      <Stack.Screen
        name="SuggestRecipeScreen"
        options={{
          headerShown: false, // Sử dụng custom header
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        options={{
          headerShown: true,
          title: "Cài đặt",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#FF5D00",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="SearchResults"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name="RecipeScreen"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name="RecipeStepScreen"
        options={{
          headerShown: true,
          title: "Hướng dẫn từng bước",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#FF5D00",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="CommentScreen"
        options={{
          headerShown: true,
          title: "Bình luận",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#FF5D00",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="UserProfile"
        options={{
          headerShown: false, // Vì đã có custom header
        }}
      />
    </Stack>
  );
}
