import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import components
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";


interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  navigateToRegister: () => void;
  navigateToForgotPassword: () => void;
  isLoading?: boolean; // ✅ Add this
  error?: string; // ✅ Add this
}

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  navigateToRegister,
  navigateToForgotPassword,
  isLoading = false, // ✅ Add this
  error, // ✅ Add this
}: LoginFormProps) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <View style={styles.form}>
      {/* Email Input */}
      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        focused={emailFocused}
        iconName="user"
        keyboardType="email-address"
        returnKeyType="next"
      />

      {/* Password Input */}
      <CustomInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        focused={passwordFocused}
        iconName="lock"
        secureTextEntry
        returnKeyType="done"
      />

      {/* Forgot Password Link */}
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={navigateToForgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {/* Login Button */}
      <CustomButton
        title={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        onPress={handleLogin}
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        disabled={isLoading}
      />

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.link}> Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 30,
    zIndex: 10,
  },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
    marginTop: 5,
  },

  forgotPasswordText: {
    color: "#FF5722",
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
    marginBottom: 25,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#666",
    fontSize: 13,
  },

  link: {
    color: "#FF5722",
    fontWeight: "700",
    fontSize: 13,
  },

  errorText: {
    color: "#FF5722",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
