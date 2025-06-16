import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface ContinueButtonProps {
  onPress: () => void;
  disabled: boolean;
  title?: string;
}

export default function ContinueButton({
  onPress,
  disabled,
  title = "Tiếp tục",
}: ContinueButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.continueButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={require("../../../assets/images/kindpng_7677531.png")}
        style={[styles.continueIcon, disabled && styles.disabledIcon]}
        resizeMode="contain"
      />
      <Text style={[styles.continueText, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: "#FF6D00",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6D00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 150,
  },
  disabledButton: {
    backgroundColor: "rgba(102, 102, 102, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#FFFFFF",
  },
  disabledIcon: {
    tintColor: "rgba(102, 102, 102, 0.6)",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabledText: {
    color: "rgba(102, 102, 102, 0.6)",
  },
});
