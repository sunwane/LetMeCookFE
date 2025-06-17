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

  const handleSendVerificationCode = (): void => {
    if (!email.trim()) {
      console.log("Vui lòng nhập email trước khi gửi mã xác nhận");
      return;
    }
    console.log("Gửi mã xác nhận cho email:", email);
  };

  const handleResetPassword = (): void => {
    if (
      !email.trim() ||
      !verificationCode.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      console.log("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log("Mật khẩu xác nhận không khớp");
      return;
    }

    console.log("Đặt lại mật khẩu:", {
      email,
      verificationCode,
      newPassword,
      confirmPassword,
    });

    // Sau khi đặt lại mật khẩu thành công, quay về login
    router.back();
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
            />

            {/* Verification Code Input */}
            <VerificationInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              onFocus={() => setVerificationCodeFocused(true)}
              onBlur={() => setVerificationCodeFocused(false)}
              focused={verificationCodeFocused}
              onSendCode={handleSendVerificationCode}
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
            />

            <CustomButton
              title="Đặt lại mật khẩu"
              onPress={handleResetPassword}
              style={styles.primaryButton}
            />

            {/* Back to Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Nhớ mật khẩu?</Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.link}> Đăng nhập</Text>
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
});
