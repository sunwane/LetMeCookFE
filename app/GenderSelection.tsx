import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import AppHeader from "../components/ui/AppHeader";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import ContinueButton from "../components/ui/ContinueButton";
import GenderOption from "../components/ui/GenderOption";
import ProgressBar from "../components/ui/ProgressBar";

export default function GenderSelection() {
  const params = useLocalSearchParams();
  const [selectedGender, setSelectedGender] = useState<string>("");

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      router.push({
        pathname: "/HeightSelection",
        params: {
          sex: selectedGender,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ProgressBar progress={10} />

      <View style={styles.content}>
        <AppHeader />

        {/* Gender Icons */}
        <View style={styles.genderIconsContainer}>
          <Image
            source={require("../assets/images/gender-symbol.png")}
            style={styles.genderSymbolImage}
            resizeMode="contain"
          />
        </View>

        {/* Question */}
        <Text style={styles.question}>Giới tính của bạn là gì?</Text>

        {/* Gender Options */}
        <View style={styles.genderContainer}>
          <GenderOption
            gender="male"
            isSelected={selectedGender === "male"}
            onPress={() => handleGenderSelect("male")}
            imageSource={require("../assets/images/man.png")}
            label="Nam"
          />

          <GenderOption
            gender="female"
            isSelected={selectedGender === "female"}
            onPress={() => handleGenderSelect("female")}
            imageSource={require("../assets/images/woman.png")}
            label="Nữ"
          />
        </View>

        {/* Description Text */}
        <Text style={styles.description}>
          Chúng tôi sử dụng thông tin giới tính để đề xuất các công thức nấu ăn
          và kế hoạch dinh dưỡng phù hợp nhất với bạn. Điều này giúp tối ưu hóa
          trải nghiệm cá nhân hóa trong việc học nấu ăn.
        </Text>

        <ContinueButton onPress={handleContinue} disabled={!selectedGender} />
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
  genderIconsContainer: {
    marginBottom: 15,
  },
  genderSymbolImage: {
    width: 40,
    height: 32,
    tintColor: "#666",
    opacity: 0.7,
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.3,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
    paddingHorizontal: 5,
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
