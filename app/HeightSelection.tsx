import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AppHeader from "../components/ui/AppHeader";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import ContinueButton from "../components/ui/ContinueButton";
import HeightPicker from "../components/ui/HeightPicker";
import ProgressBar from "../components/ui/ProgressBar";
import QuestionSection from "../components/ui/QuestionSection";

export default function HeightSelection() {
  const params = useLocalSearchParams();
  const [selectedHeight, setSelectedHeight] = useState<number>(170);

  const handleHeightChange = (height: number) => {
    setSelectedHeight(height);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/AgeSelection",
      params: {
        sex: params.sex,
        height: selectedHeight.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      <ProgressBar progress={37.5} />

      <View style={styles.content}>
        <AppHeader />

        <QuestionSection question="Chiều cao của bạn là bao nhiêu?" />

        <HeightPicker
          selectedHeight={selectedHeight}
          onHeightChange={handleHeightChange}
        />

        {/* Description Text */}
        <Text style={styles.description}>
          Thông tin độ tuổi giúp chúng tôi tính toán chính xác nhu cầu dinh
          dưỡng theo từng giai đoạn phát triển, đảm bảo đề xuất các món ăn phù
          hợp với cơ thể bạn.
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
