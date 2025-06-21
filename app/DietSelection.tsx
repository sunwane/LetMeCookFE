"use client";

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createUserInfoAPI, UserInfoCreationRequest } from "../services/types/UserInfo";
import { loginAPI } from "../services/types/auth";
import { API_BASE_URL } from '../constants/api';

// Import components
import ProgressBar from "../components/ui/ProgressBar";
import ContinueButton from "../components/ui/ContinueButton";
import DietPicker from "../components/ui/DietPicker";

const { width } = Dimensions.get("window");

interface DietSelectionProps {
  onDietSelect?: (diet: string) => void;
  onContinue?: () => void;
}

export default function DietSelection({
  onDietSelect,
  onContinue,
}: DietSelectionProps) {
  const params = useLocalSearchParams();
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const [customDiet, setCustomDiet] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDietChange = (diet: string, customValue?: string) => {
    setSelectedDiet(diet);
    if (customValue !== undefined) {
      setCustomDiet(customValue);
    }

    if (onDietSelect) {
      onDietSelect(diet === "custom" ? customValue || "custom" : diet);
    }
  };

  const handleContinue = () => {
    if (!selectedDiet || (selectedDiet === "custom" && !customDiet)) {
      console.log("Vui lòng chọn hoặc nhập chế độ ăn");
      return;
    }

    if (onContinue) {
      onContinue();
    }
    router.push("/HealthConditionSelection");
  };

  // Map frontend options to backend enum
  const mapDietToEnum = (diet: string): string => {
    const dietMap: { [key: string]: string } = {
      "ăn uống thông thường": "NORMAL",
      normal: "NORMAL",
      standard: "NORMAL", 
      "ăn chay": "VEGETARIAN",
      vegetarian: "VEGETARIAN",
      "ăn thuần chay": "VEGETARIAN",
      vegan: "VEGETARIAN",
      keto: "KETO",
      "low-carb": "LOW_CARB",
      mediterranean: "MEDITERRANEAN",
    };

    console.log(
      `🍽️ Mapping diet: "${diet}" → "${
        dietMap[diet.toLowerCase()] || "NORMAL"
      }"`
    );
    return dietMap[diet.toLowerCase()] || "NORMAL";
  };

  const calculateDOB = (age: number): string => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}-01-01`;
  };

 
  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      
      if (!userEmail || !userPassword) {
        throw new Error('Missing login credentials');
      }

      // ✅ FIX: Use setup-token instead of regular login
      console.log("🔑 Getting setup token...");
      
      const setupTokenResponse = await fetch(`${API_BASE_URL}/auth/setup-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          password: userPassword 
        }),
      });

      if (!setupTokenResponse.ok) {
        const errorText = await setupTokenResponse.text();
        throw new Error(`Setup token failed: ${setupTokenResponse.status}, ${errorText}`);
      }

      const authData = await setupTokenResponse.json();
      const token = authData.result.token;
      
      // ✅ Step 2: Save setup token temporarily
      await AsyncStorage.setItem('authToken', token);
      console.log("💾 Setup token saved successfully");

      // ✅ Step 3: Create UserInfo using setup token
      const userInfoData: UserInfoCreationRequest = {
        sex: params.sex === "male" ? "MALE" : "FEMALE",
        height: parseInt(params.height as string),
        weight: parseInt(params.weight as string),
        age: parseInt(params.age as string),
        dietTypes: [mapDietToEnum(selectedDiet)],
      };

      console.log("🆔 Creating UserInfo with data:", userInfoData);
      await createUserInfoAPI(userInfoData);

      // ✅ Step 4: Now login properly with regular token
      console.log("🔄 Getting final login token...");
      const finalLoginResult = await loginAPI({ 
        email: userEmail, 
        password: userPassword 
      });
      
      // ✅ Step 5: Replace setup token with real token
      await AsyncStorage.setItem('authToken', finalLoginResult.token);
      console.log("💾 Final token saved successfully");
    
      // ✅ Step 6: Cleanup sensitive data
      await AsyncStorage.removeItem('userPassword');
    
      console.log("✅ Registration completed successfully");
      router.replace('/?logged=true');
        
    } catch (error: any) {
      console.error("❌ Failed to complete registration:", error);
      setError("Tạo thông tin thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />

        {/* Background Gradient */}
        <LinearGradient
          colors={["#FFF8F0", "#F8F4E6", "#F5F1E8"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Progress Bar */}
        <ProgressBar progress={75} />

        {/* KeyboardAvoidingView bao bọc toàn bộ ScrollView */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            keyboardShouldPersistTaps="handled" // Cho phép lướt khi bàn phím mở
            keyboardDismissMode="interactive" // Đóng bàn phím khi lướt
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header Section - Clean and Simple */}
              <View style={styles.headerSection}>
                <Text style={styles.question}>Bạn theo chế độ ăn nào?</Text>
                <Text style={styles.subtitle}>
                  Chọn phong cách ăn uống phù hợp với bạn
                </Text>
              </View>

              {/* Enhanced Diet Picker without KeyboardAvoidingView */}
              <DietPicker
                selectedDiet={selectedDiet}
                onDietChange={handleDietChange}
                customDiet={customDiet}
                setCustomDiet={setCustomDiet}
              />

              {/* Description Text */}
              <Text style={styles.description}>
                Chúng tôi sẽ đề xuất các món ăn và kế hoạch dinh dưỡng phù hợp với
                sở thích và nhu cầu sức khỏe của bạn.
              </Text>

              {/* Error Message */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* Continue Button */}
              <ContinueButton
                onPress={handleFinalSubmit}
                title={isLoading ? "Đang xử lý..." : "Hoàn thành"}
                disabled={!selectedDiet || isLoading}
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60, // Tăng padding bottom để có không gian khi bàn phím hiện
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 40,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },

  question: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 38,
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
    opacity: 0.8,
    lineHeight: 24,
  },

  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
    opacity: 0.9,
    maxWidth: width - 48,
  },

  errorText: {
    color: "#FF5722",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
