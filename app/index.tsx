import TabNavigator from '@/components/ui/navigation/TabNavigator';
import '@/config/globalTextConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { API_BASE_URL } from '../constants/api';
import { loginAPI } from "../services/types/auth";

const { height } = Dimensions.get("window");

// ✅ Interface for account status response
interface AccountStatusResponse {
  status: string; // COMPLETED, PENDING, NOT_EXISTS
  canLogin: boolean;
  canRegister: boolean;
  message: string;
}

export default function Index() {
  const params = useLocalSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FIRST useEffect - Params check và keyboard listeners
  useEffect(() => {
    // Kiểm tra nếu có parameter logged=true
    if (params.logged === 'true') {
      setIsLoggedIn(true);
    }

    // Ẩn navigation bar khi mở app (chỉ cho Android)
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
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

  // ✅ SECOND useEffect - Token verification
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // ✅ Check if user already logged in
        if (params.logged === 'true') {
          setIsLoggedIn(true);
          return;
        }
        
        // ✅ Check existing token
        const existingToken = await AsyncStorage.getItem('authToken');
        
        if (existingToken) {
          console.log("🔑 Found existing token, verifying...");
          
          // ✅ Test token validity with simple API call
          try {
            const response = await fetch(`${API_BASE_URL}/user-info`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${existingToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              console.log("✅ Token valid, auto-login");
              setIsLoggedIn(true);
              return;
            } else {
              console.log("❌ Token invalid, clearing...");
              await AsyncStorage.removeItem('authToken');
            }
          } catch (tokenError) {
            console.log("❌ Token verification failed, clearing...");
            await AsyncStorage.removeItem('authToken');
          }
        }
        
    
        
      } catch (error) {
        console.error("❌ Auth check error:", error);
      }
    };
    
    checkAuthStatus();
  }, [params]);

  // ✅ Function to check email status
  const checkEmailStatus = async (email: string): Promise<AccountStatusResponse | null> => {
    try {
      console.log(`🔍 Checking status for email: ${email}`);
      
      const response = await fetch(`${API_BASE_URL}/accounts/check-status?email=${email.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📥 Status check response: ${response.status}`);

      if (!response.ok) {
        console.error(`❌ Status check failed: ${response.status}`);
        return null;
      }

      const result = await response.json();
      console.log(`✅ Account status result:`, result.result);
      
      return result.result;
    } catch (error) {
      console.error('❌ Failed to check email status:', error);
      return null;
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // index.tsx - Clean up handleLogin
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      console.log('🔑 Attempting login...');
      
      // ✅ DIRECT LOGIN - Không cần check status trước
      const result = await loginAPI({ email: email.trim(), password });
      
      console.log("✅ Login successful:", result);
      
      // ✅ CRITICAL: Save token ngay sau khi login thành công
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('userEmail', email.trim());
      
      console.log("💾 Token saved successfully");
      
      setIsLoggedIn(true);
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      // ✅ Parse specific backend error codes
      if (error.message?.includes("1054")) {
        // User authenticated but no UserInfo created yet
        Alert.alert(
          'Thiết lập tài khoản',
          'Tài khoản của bạn cần hoàn tất thông tin. Tiếp tục thiết lập?',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Tiếp tục', 
              onPress: async () => {
                // Save credentials for UserInfo creation flow
                await AsyncStorage.setItem('userEmail', email.trim());
                await AsyncStorage.setItem('userPassword', password);
                router.push("/GenderSelection");
              }
            }
          ]
        );
      } else if (error.message?.includes("1012")) {
        // Account registered but incomplete
        Alert.alert(
          'Hoàn tất đăng ký',
          'Tài khoản của bạn chưa được thiết lập hoàn tất. Tiếp tục thiết lập?',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Tiếp tục', 
              onPress: async () => {
                await AsyncStorage.setItem('userEmail', email.trim());
                await AsyncStorage.setItem('userPassword', password);
                router.push("/GenderSelection");
              }
            }
          ]
        );
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

// ✅ Thêm cấu hình để ẩn header
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