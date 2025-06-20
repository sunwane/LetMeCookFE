import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardEvent,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Import components
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import CustomButton from "../components/ui/CustomButton";
import CustomInput from "../components/ui/CustomInput";
import RegisterHeader from "../components/ui/RegisterHeader";
import VerificationInput from "../components/ui/VerificationInput";

// ✅ ADD: Import API functions
import {
  requestPasswordResetAPI,
  resetPasswordAPI,
  ResetPasswordRequest,
} from "../services/types/AccountItem";

const { height } = Dimensions.get("window");

interface ForgotPasswordScreenProps {}

export default function ForgotPasswordScreen({}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [verificationCodeFocused, setVerificationCodeFocused] =
    useState<boolean>(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState<boolean>(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    useState<boolean>(false);

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // ✅ ADD: Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  // ✅ UPDATE: handleSendVerificationCode với real API
  const handleSendVerificationCode = async (): Promise<void> => {
    if (!email.trim()) {
      setError("Vui lòng nhập email trước khi gửi mã xác nhận");
      setSuccessMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("🔥 Sending reset code to:", email);
      const result = await requestPasswordResetAPI(email.trim());
      console.log("✅ Reset code sent:", result);

      setCodeSent(true);
      setSuccessMessage("✅ Mã xác nhận đã được gửi đến email của bạn");
      setError("");
    } catch (error) {
      console.error("❌ Send reset code error:", error);
      setError("❌ Gửi mã xác nhận thất bại. Vui lòng kiểm tra email");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATE: handleResetPassword với real API
  const handleResetPassword = async (): Promise<void> => {
    // Validation
    if (
      !email.trim() ||
      !verificationCode.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setSuccessMessage("");
      return;
    }

    if (newPassword.length < 7) {
      setError("Mật khẩu phải có ít nhất 7 ký tự");
      setSuccessMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const resetData: ResetPasswordRequest = {
        email: email.trim(),
        code: verificationCode.trim(),
        newPassword: newPassword,
      };

      console.log("🔥 Resetting password:", {
        email: resetData.email,
        code: resetData.code,
      });
      const result = await resetPasswordAPI(resetData);
      console.log("✅ Password reset successful:", result);

      setSuccessMessage("✅ Đặt lại mật khẩu thành công!");
      setError("");

      // Delay 2 seconds then navigate back to login
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error("❌ Reset password error:", error);
      setError("❌ Đặt lại mật khẩu thất bại. Vui lòng kiểm tra mã xác nhận");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = (): void => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFF8F0"
          translucent={false}
        />

        {/* Background decorations */}
        <BackgroundDecorations />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header */}
          <RegisterHeader
            logoSource={require("../assets/images/LogoNoName.png")}
            title="QUÊN MẬT KHẨU"
            subtitle="Nhập thông tin để đặt lại mật khẩu"
          />

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              focused={emailFocused}
              iconName="envelope"
              keyboardType="email-address"
              returnKeyType="next"
              editable={!isLoading}
            />

            {/* Verification Code Input */}
            <VerificationInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              onFocus={() => setVerificationCodeFocused(true)}
              onBlur={() => setVerificationCodeFocused(false)}
              focused={verificationCodeFocused}
              onSendCode={handleSendVerificationCode}
              disabled={isLoading}
            />

            {/* New Password Input */}
            <CustomInput
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
              focused={newPasswordFocused}
              iconName="lock"
              secureTextEntry
              returnKeyType="next"
              editable={!isLoading}
            />

            {/* Confirm New Password Input */}
            <CustomInput
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              focused={confirmPasswordFocused}
              iconName="lock"
              secureTextEntry
              returnKeyType="done"
              editable={!isLoading}
            />

            {/* ✅ ADD: Error and Success Messages */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            {/* ✅ UPDATE: Reset Password Button với loading state */}
            <CustomButton
              title={isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              onPress={handleResetPassword}
              style={[
                styles.primaryButton,
                isLoading && styles.buttonDisabled,
              ]}
              disabled={isLoading}
            />

            {/* Back to Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Nhớ mật khẩu?</Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
                <Text
                  style={[
                    styles.link,
                    isLoading && styles.linkDisabled,
                  ]}
                >
                  {" "}
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
    minHeight: height - 100,
  },

  form: {
    marginBottom: 30,
    zIndex: 10,
  },

  primaryButton: {
    marginBottom: 25,
    marginTop: 10,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#666",
    fontSize: 13,
  },

  link: {
    color: "#FF5722",
    fontWeight: "700",
    fontSize: 13,
  },

  // ✅ ADD: New styles for messages and loading states
  errorText: {
    color: "#FF5722",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  successText: {
    color: "#4CAF50",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  linkDisabled: {
    opacity: 0.6,
  },
});
