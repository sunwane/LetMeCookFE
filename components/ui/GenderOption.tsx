import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface GenderOptionProps {
  gender: "male" | "female";
  isSelected: boolean;
  onPress: () => void;
  imageSource: any;
  label: string;
}

export default function GenderOption({
  gender,
  isSelected,
  onPress,
  imageSource,
  label,
}: GenderOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.genderOption, isSelected && styles.selectedOption]}
      onPress={onPress}
    >
      <View style={styles.genderIllustration}>
        <Image
          source={imageSource}
          style={styles.genderImage}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.genderText, isSelected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  genderOption: {
    width: (width - 90) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(102, 102, 102, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedOption: {
    borderColor: "#FF5722",
    backgroundColor: "rgba(255, 87, 34, 0.05)",
  },
  genderIllustration: {
    width: 80,
    height: 100,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  genderImage: {
    width: 70,
    height: 90,
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
  },
  selectedText: {
    color: "#FF5722",
    fontWeight: "700",
  },
});
