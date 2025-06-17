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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

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
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const [customDiet, setCustomDiet] = useState<string>("");
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

  return (
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

            {/* Continue Button */}
            <ContinueButton onPress={handleContinue} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
});
