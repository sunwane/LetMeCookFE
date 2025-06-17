import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  activeOpacity?: number;
}

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.8,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={activeOpacity}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF5722",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#FF5722",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 9,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
