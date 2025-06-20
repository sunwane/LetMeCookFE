// WeightSelection.tsx - Main Component (Refactored)
import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Import components
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import ProgressBar from "../components/ui/ProgressBar";
import AppHeader from "../components/ui/AppHeader";
import WeightPicker from "../components/ui/WeightPicker";
import ContinueButton from "../components/ui/ContinueButton";

interface WeightSelectionProps {
  onWeightSelect?: (weight: number) => void;
  onContinue?: () => void;
}

export default function WeightSelection({
  onWeightSelect,
  onContinue,
}: WeightSelectionProps) {
  const params = useLocalSearchParams();
  const [selectedWeight, setSelectedWeight] = useState<number>(60);

  // Tạo mảng cân nặng từ 30 đến 150 kg
  const weights = Array.from({ length: 121 }, (_, i) => 30 + i);

  const handleWeightChange = (weight: number) => {
    setSelectedWeight(weight);
    if (onWeightSelect) {
      onWeightSelect(weight);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: "/DietSelection",
      params: {
        sex: params.sex,
        height: params.height,
        age: params.age,
        weight: selectedWeight.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Progress Bar */}
      <ProgressBar progress={62.5} />

      <View style={styles.content}>
        {/* Header Section */}
        <AppHeader />

        {/* Weight Icon */}
        <View style={styles.weightIconContainer}>
          <Image
            source={require("../assets/images/weight.png")}
            style={styles.weightIcon}
            resizeMode="contain"
          />
        </View>

        {/* Question */}
        <Text style={styles.question}>Cân nặng hiện tại của bạn?</Text>

        {/* Weight Picker */}
        <WeightPicker
          selectedWeight={selectedWeight}
          onWeightChange={handleWeightChange}
          weights={weights}
        />

        {/* Description Text */}
        <Text style={styles.description}>
          Thông tin cân nặng giúp chúng tôi tính toán chính xác lượng calo và
          các chất dinh dưỡng cần thiết cho cơ thể bạn, từ đó đề xuất các món ăn
          phù hợp với mục tiêu sức khỏe.
        </Text>

        {/* Continue Button */}
        <ContinueButton onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    paddingTop: 30,
  },

  weightIconContainer: {
    marginBottom: 15,
  },

  weightIcon: {
    width: 40,
    height: 40,
    tintColor: "#666",
    opacity: 0.7,
  },

  question: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.3,
  },

  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 15,
    opacity: 0.8,
    maxWidth: "95%",
  },
});
