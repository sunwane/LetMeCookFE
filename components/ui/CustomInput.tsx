import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName: keyof typeof FontAwesome.glyphMap;
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  iconName,
  secureTextEntry = false,
  returnKeyType = "next",
  onSubmitEditing,
  autoCapitalize = "none",
  autoCorrect = false,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}
    >
      <FontAwesome
        name={iconName}
        size={16}
        color={isFocused ? "#FF5722" : "#999"}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#FF5722",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 87, 34, 0.1)",
  },

  inputContainerFocused: {
    borderColor: "#FF5722",
    borderWidth: 1.5,
    shadowColor: "#FF5722",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },

  inputIcon: {
    marginLeft: 18,
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 18,
    fontSize: 15,
    color: "#2C2C2C",
  },
});
