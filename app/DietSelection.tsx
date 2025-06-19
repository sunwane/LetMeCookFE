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
      standard: "NORMAL", // ✅ Add this mapping
      "ăn chay": "VEGETARIAN",
      vegetarian: "VEGETARIAN",
      "ăn thuần chay": "VEGETARIAN",
      vegan: "VEGETARIAN",
      keto: "KETO",
      "low-carb": "LOW_CARB",
      mediterranean: "MEDITERRANEAN",
      "tự nhập chế độ ăn khác": "NORMAL",
      custom: "NORMAL",
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

  // ✅ SIMPLE APPROACH - GET FRESH TOKEN WHEN NEEDED
  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      
      if (!userEmail || !userPassword) {
        throw new Error('Missing login credentials');
      }

      const userInfoData: UserInfoCreationRequest = {
        sex: params.sex === "male" ? "MALE" : "FEMALE",
        height: parseInt(params.height as string),
        weight: parseInt(params.weight as string),
        age: parseInt(params.age as string),
        dob: calculateDOB(parseInt(params.age as string)),
        dietTypes: [mapDietToEnum(selectedDiet)],
      };

      console.log("🔥 Creating UserInfo:", userInfoData);

      // ✅ Step 1: Create UserInfo first (might need auth)
      // ✅ Step 2: If 401, get fresh token and retry
      
      let response = await fetch(`http://192.168.1.5:8080/user-info?accountId=${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ Try without auth first
        },
        body: JSON.stringify(userInfoData),
      });

      // ✅ If 401, get fresh token and retry
      if (response.status === 401) {
        console.log("🔄 Getting setup auth token...");
        
        // ✅ DEBUG: Check credentials
        console.log("🔍 Debug credentials:");
        console.log("📧 userEmail:", userEmail);
        console.log("🔐 userPassword exists:", !!userPassword);
        console.log("🔐 userPassword length:", userPassword?.length);
        
        try {
          const authRequestBody = { email: userEmail, password: userPassword };
          console.log("📤 Auth request body:", authRequestBody);
          
          const authResponse = await fetch(`${API_BASE_URL}/auth/setup-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, password: userPassword }),
          });

          console.log("🔑 Setup auth response status:", authResponse.status);
          
          // ✅ DEBUG: Check response details
          const responseText = await authResponse.text();
          console.log("📥 Setup auth response body:", responseText);

          if (authResponse.ok) {
            const authData = JSON.parse(responseText);
            console.log("✅ Got setup token, retrying UserInfo creation");

            // ✅ CALL API WITHOUT accountId parameter
            response = await fetch(`${API_BASE_URL}/user-info`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.result.token}`,
              },
              body: JSON.stringify(userInfoData),
            });

            console.log("📥 Response status:", response.status);

            await AsyncStorage.setItem('authToken', authData.result.token);
          } else {
            console.error("❌ Setup auth failed:", responseText);
            
            // ✅ Try to see if credentials are wrong
            if (responseText.includes("1027") || responseText.includes("Unauthenticated")) {
              setError("Thông tin đăng nhập không đúng. Vui lòng đăng nhập lại.");
              router.push("/");
              return;
            }
            
            throw new Error('Failed to authenticate for setup');
          }
        } catch (authError) {
          console.error("❌ Failed to get setup token:", authError);
          throw new Error('Authentication failed');
        }
      }

      console.log("📥 Final response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ UserInfo created successfully:", result);
        
        // ✅ Clean up temporary password
        await AsyncStorage.removeItem('userPassword');
        
        router.push({
          pathname: "/",
          params: { logged: 'true' }
        });
      } else {
        const errorText = await response.text();
        console.error("❌ UserInfo creation failed:", errorText);
        throw new Error(`Failed to create UserInfo: ${response.status}`);
      }
      
    } catch (error: any) {
      console.error("❌ Failed to create UserInfo:", error);
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
                style={[
                  styles.continueButton,
                  (!selectedDiet || isLoading) && styles.disabledButton,
                ]}
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
