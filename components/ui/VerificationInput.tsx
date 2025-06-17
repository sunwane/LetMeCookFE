import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VerificationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
  onSendCode: () => void;
  placeholder?: string;
}

export default function VerificationInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  focused,
  onSendCode,
  placeholder = "Mã xác nhận",
}: VerificationInputProps) {
  return (
    <View style={styles.verificationContainer}>
      <View
        style={[
          styles.inputContainer,
          styles.verificationInput,
          focused && styles.inputContainerFocused,
        ]}
      >
        <FontAwesome
          name="shield"
          size={16}
          color={focused ? "#FF5722" : "#999"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="done"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity
        style={styles.sendCodeButton}
        onPress={onSendCode}
        activeOpacity={0.8}
      >
        <Text style={styles.sendCodeText}>Gửi mã</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
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

  verificationInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
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

  sendCodeButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D2691E",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  sendCodeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
