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
import HealthConditionPicker from "../components/ui/HealthConditionPicker";

const { width } = Dimensions.get("window");

interface HealthConditionSelectionProps {
  onConditionsSelect?: (conditions: string[]) => void;
  onContinue?: () => void;
}

export default function HealthConditionSelection({
  onConditionsSelect,
  onContinue,
}: HealthConditionSelectionProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customConditions, setCustomConditions] = useState<string[]>([]);
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

  const handleConditionsChange = (
    conditions: string[],
    customValues?: string[]
  ) => {
    setSelectedConditions(conditions);
    if (customValues !== undefined) {
      setCustomConditions(customValues);
    }

    if (onConditionsSelect) {
      // Combine regular conditions with custom ones
      const allConditions = [
        ...conditions.filter((c) => c !== "custom"),
        ...(customValues || customConditions),
      ];
      onConditionsSelect(allConditions);
    }
  };

  const handleContinue = () => {
    if (selectedConditions.length === 0) {
      console.log("Vui lòng chọn tình trạng sức khỏe");
      return;
    }

    // Check if custom is selected but no custom conditions entered
    if (
      selectedConditions.includes("custom") &&
      customConditions.length === 0
    ) {
      console.log("Vui lòng nhập tình trạng sức khỏe khác");
      return;
    }

    if (onContinue) {
      onContinue();
    }
    router.push("/Summary");
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
      <ProgressBar progress={87.5} />

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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
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
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.question}>Tình trạng sức khỏe của bạn?</Text>
              <Text style={styles.subtitle}>
                Chọn các vấn đề sức khỏe hiện tại (nếu có)
              </Text>
            </View>

            {/* Health Condition Picker */}
            <HealthConditionPicker
              selectedConditions={selectedConditions}
              onConditionsChange={handleConditionsChange}
              customConditions={customConditions}
              setCustomConditions={setCustomConditions}
            />

            {/* Description Text */}
            <Text style={styles.description}>
              Thông tin này giúp chúng tôi đề xuất các món ăn và kế hoạch dinh
              dưỡng phù hợp với tình trạng sức khỏe của bạn.
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
    paddingBottom: 60,
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
