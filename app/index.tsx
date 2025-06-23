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

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsLoading(true);
    setError("");
    
    await AsyncStorage.clear();
    
    try {
      // ✅ Check account status first
      const emailStatus = await checkEmailStatus(email);
      
      if (emailStatus?.status === 'PENDING') {
        // ✅ Account chưa hoàn tất → chuyển đến setup
        setIsLoading(false);
        
        Alert.alert(
          'Hoàn tất đăng ký',
          'Tài khoản của bạn chưa được thiết lập hoàn tất. Bạn có muốn tiếp tục thiết lập không?',
          [
            { 
              text: 'Hủy', 
              style: 'cancel',
              onPress: () => console.log('❌ User cancelled setup completion')
            },
            { 
              text: 'Tiếp tục', 
              onPress: async () => {
                console.log('🔄 Continuing account setup...');
                
                // ✅ Save credentials and navigate to setup
                await AsyncStorage.setItem('userEmail', email.trim());
                await AsyncStorage.setItem('userPassword', password);
                
                router.push('/GenderSelection');
              }
            }
          ]
        );
        return;
      }
      
      if (emailStatus?.status === 'NOT_EXISTS') {
        // ✅ Email chưa được đăng ký
        setError('Email chưa được đăng ký. Vui lòng đăng ký tài khoản mới.');
        setIsLoading(false);
        return;
      }
      
      // ✅ Account đã hoàn tất (COMPLETED) hoặc status check fail → login bình thường
      console.log('🔑 Attempting normal login...');
      
      const result = await loginAPI({ email: email.trim(), password });
      
      console.log("✅ Login successful - has UserInfo");
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('userEmail', email.trim());
      setIsLoggedIn(true);
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      // ✅ Fallback: Error 1054 = User authenticated but no UserInfo
      if (error.message?.includes("1054")) {
        console.log("🔄 User exists but no UserInfo, saving credentials...");
        
        Alert.alert(
          'Thiết lập tài khoản',
          'Tài khoản của bạn cần hoàn tất thông tin. Tiếp tục thiết lập?',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Tiếp tục', 
              onPress: async () => {
                // ✅ Save credentials for UserInfo creation
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

// index.tsx - ensure proper flow order
useEffect(() => {
  const initializeApp = async () => {
    try {
      // ✅ 1. Check if user has auth token first
      const existingToken = await AsyncStorage.getItem('authToken');
      
      if (existingToken) {
        console.log("🔑 Found existing token, checking validity...");
        
        // ✅ 2. If has token, verify it works
        try {
          const response = await fetch(`${API_BASE_URL}/auth/introspect`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${existingToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: existingToken }),
          });
          
          if (response.ok) {
            console.log("✅ Token valid, user already logged in");
            setIsLoggedIn(true);
            return;
          } else {
            console.log("❌ Token invalid, clearing...");
            await AsyncStorage.removeItem('authToken');
          }
        } catch (tokenError) {
          console.log("❌ Token check failed, clearing...");
          await AsyncStorage.removeItem('authToken');
        }
      }
      
      // ✅ 3. No valid token, check account status (PUBLIC call)
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        console.log("📧 Checking status for:", userEmail);
        
        const statusResponse = await fetch(`${API_BASE_URL}/accounts/check-status?email=${userEmail}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // ✅ NO Authorization header for public endpoint
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log("📊 Account status:", statusData);
          
          if (statusData.result.hasUserInfo) {
            console.log("✅ Account has UserInfo, can login normally");
            // Proceed with normal login flow
          } else {
            console.log("⚠️ Account exists but no UserInfo, redirect to setup");
            // Redirect to gender selection
          }
        } else {
          console.log("❌ Status check failed:", statusResponse.status);
        }
      }
      
    } catch (error) {
      console.error("❌ App initialization error:", error);
    }
  };
  
  initializeApp();
}, []);