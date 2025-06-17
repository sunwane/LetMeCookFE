import TabNavigator from '@/components/ui/navigation/TabNavigator';
import '@/config/globalTextConfig';
import * as NavigationBar from 'expo-navigation-bar';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import components
import LoginForm from "../components/auth/LoginForm";
import LoginHeader from "../components/auth/LoginHeader";
import SocialLogin from "../components/auth/SocialLogin";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";

const { height } = Dimensions.get("window");

export default function Index() {
  const params = useLocalSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Kiểm tra nếu có parameter logged=true
    if (params.logged === 'true') {
      setIsLoggedIn(true);
    }

    // Ẩn navigation bar khi mở app (chỉ cho Android)
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      // Hoặc dùng immersive mode
      // NavigationBar.setBehaviorAsync('inset-swipe');
    }

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [params]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = () => {
    // Xử lý đăng nhập (giả sử xác thực thành công)
    console.log("Đăng nhập với:", { email, password });
    dismissKeyboard();

    // Đặt trạng thái đã đăng nhập
    setIsLoggedIn(true);
  };

  const navigateToRegister = () => {
    router.push("/RegisterScreen");
  };

  const navigateToForgotPassword = () => {
    router.push("/ForgotPasswordScreen");
  };

  // Nếu đã đăng nhập, hiển thị TabNavigator
  if (isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <TabNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Nếu chưa đăng nhập, hiển thị màn hình Login
  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#FFF8F0"
            translucent={false}
          />

          <BackgroundDecorations />

          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <LoginHeader />

            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLogin={handleLogin}
              navigateToRegister={navigateToRegister}
              navigateToForgotPassword={navigateToForgotPassword}
            />

            <SocialLogin />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

// Thêm cấu hình để ẩn header
export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
    minHeight: height - 100,
  },
});