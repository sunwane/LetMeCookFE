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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import LoginForm from "../components/auth/LoginForm";
import LoginHeader from "../components/auth/LoginHeader";
import SocialLogin from "../components/auth/SocialLogin";
import { loginAPI, AuthRequest } from "../services/types/auth";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";


const { height } = Dimensions.get("window");

export default function Index() {
  const params = useLocalSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsLoading(true);
    setError("");
    
    await AsyncStorage.clear();
    
    try {
      const result = await loginAPI({ email: email.trim(), password });
      
      // ✅ Login thành công -> có UserInfo
      console.log("✅ Login successful - has UserInfo");
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('userEmail', email.trim());
      setIsLoggedIn(true);
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      // ✅ Error 1054 = User authenticated but no UserInfo
      if (error.message?.includes("1054")) {
        console.log("🔄 User exists but no UserInfo, saving credentials...");
        
        // ✅ Save credentials for UserInfo creation
        await AsyncStorage.setItem('userEmail', email.trim());
        await AsyncStorage.setItem('userPassword', password); // ✅ Save password temporarily
        
        router.push("/GenderSelection");
        
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } finally {
      setIsLoading(false);
    }
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
              isLoading={isLoading}  
              error={error}          
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