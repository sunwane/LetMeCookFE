// AgeSelection.tsx - Refactored version
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

// Import các components đã tách
import AgePicker from "../components/ui/AgePicker";
import AppHeader from "../components/ui/AppHeader";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import ContinueButton from "../components/ui/ContinueButton";
import ProgressBar from "../components/ui/ProgressBar";

export default function AgeSelection() {
  const params = useLocalSearchParams();
  const [selectedAge, setSelectedAge] = useState<number>(25);

  const handleAgeChange = (age: number) => {
    setSelectedAge(age);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/WeightSelection",
      params: {
        sex: params.sex,
        height: params.height,
        age: selectedAge.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Progress Bar */}
      <ProgressBar progress={40} />

      <View style={styles.content}>
        {/* Header Section */}
        <AppHeader />

        {/* Age Icon */}
        <View style={styles.ageIconContainer}>
          <Image
            source={require("../assets/images/age-icon.png")}
            style={styles.ageIcon}
            resizeMode="contain"
          />
        </View>

        {/* Question */}
        <Text style={styles.question}>Bạn bao nhiêu tuổi?</Text>

        {/* Age Picker */}
        <AgePicker selectedAge={selectedAge} onAgeChange={handleAgeChange} />

        {/* Description Text */}
        <Text style={styles.description}>
          Thông tin độ tuổi giúp chúng tôi tính toán chính xác nhu cầu dinh
          dưỡng theo từng giai đoạn phát triển, đảm bảo đề xuất các món ăn phù
          hợp với cơ thể bạn.
        </Text>

        {/* Continue Button */}
        <ContinueButton onPress={handleContinue} disabled={false} />
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

  ageIconContainer: {
    marginBottom: 15,
  },

  ageIcon: {
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
