import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SocialButtonProps {
  iconName: keyof typeof FontAwesome.glyphMap;
  iconColor: string;
  onPress: () => void;
}

export default function SocialButton({
  iconName,
  iconColor,
  onPress,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.socialButtonInner}>
        <FontAwesome name={iconName} size={20} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  socialButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
});
