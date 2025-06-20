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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import components
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import CustomButton from "../components/ui/CustomButton";
import CustomInput from "../components/ui/CustomInput";
import RegisterHeader from "../components/ui/RegisterHeader";
import VerificationInput from "../components/ui/VerificationInput";

// ✅ ADD: Import API functions
import {
  sendCodeAPI,
  createAccountAPI,
  AccountCreationRequest,
} from "../services/types/AccountItem";

const { height } = Dimensions.get("window");

interface RegisterScreenProps {}

export default function RegisterScreen({}: RegisterScreenProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const [usernameFocused, setUsernameFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [verificationCodeFocused, setVerificationCodeFocused] =
    useState<boolean>(false);

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // ✅ ADD: Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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
      setError("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔥 Sending code to:", email);
      const result = await sendCodeAPI(email.trim());
      console.log("✅ Code sent:", result);

      setCodeSent(true);
      setError("✅ Mã xác thực đã được gửi đến email của bạn");
    } catch (error: any) {
      console.error("❌ Send code error:", error);

      // ✅ Parse error response để lấy specific error code
      let errorMessage = "❌ Gửi mã xác thực thất bại. Vui lòng thử lại";

      try {
        // ✅ Extract error details from API response
        if (error.message && error.message.includes("body:")) {
          const bodyMatch = error.message.match(/body: (.+)$/);
          if (bodyMatch) {
            const errorData = JSON.parse(bodyMatch[1]);

            if (errorData.code === 1051) {
              // EMAIL_ALREADY_EXISTED
              errorMessage =
                "📧 Email này đã được đăng ký. Vui lòng đăng nhập để tiếp tục thiết lập tài khoản.";
            } else if (errorData.code === 1027) {
              // ✅ ADD: UNAUTHENTICATED
              errorMessage =
                "📧 Email này đã được đăng ký. Vui lòng đăng nhập để tiếp tục thiết lập tài khoản.";
            } else if (errorData.code === 1015) {
              // SEND_EMAIL_FAILED
              errorMessage = "📧 Không thể gửi email. Vui lòng kiểm tra địa chỉ email.";
            } else if (errorData.message) {
              errorMessage = `❌ ${errorData.message}`;
            }
          }
        }
      } catch (parseError) {
        console.log("⚠️ Could not parse error response");
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATE: handleRegister với real API
  const handleRegister = async (): Promise<void> => {
    // Validation
    if (
      !username.trim() ||
      !password ||
      !confirmPassword ||
      !email.trim() ||
      !verificationCode
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // ✅ Check username length (backend requires min 5)
    if (username.trim().length < 5) {
      setError("Tên người dùng phải có ít nhất 5 ký tự");
      return;
    }

    // ✅ Check password length (backend requires min 7)
    if (password.length < 7) {
      setError("Mật khẩu phải có ít nhất 7 ký tự");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const registerData: AccountCreationRequest = {
        username: username.trim(), // ← ADD username
        email: email.trim(),
        password: password,
        code: verificationCode,
      };

      console.log("🔥 Registering account:", registerData);
      const result = await createAccountAPI(registerData);
      console.log("✅ Account created:", result);

      // ✅ CHỈ lưu credentials, KHÔNG lưu accountId
      await AsyncStorage.setItem("userEmail", email.trim());
      await AsyncStorage.setItem("userPassword", password);
      // ❌ REMOVE: await AsyncStorage.setItem("accountId", result.id);

      // Success - navigate to welcome screen
      router.push("/GenderSelection");
    } catch (error) {
      console.error("❌ Register error:", error);
      setError("Đăng ký thất bại. Vui lòng kiểm tra thông tin");
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
            title="ĐĂNG KÝ"
            subtitle="Gia nhập cộng đồng nấu nướng!"
          />

          {/* Form */}
          <View style={styles.form}>
            {/* Username Input */}
            <CustomInput
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              focused={usernameFocused}
              iconName="user"
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
              returnKeyType="next"
            />

            {/* Confirm Password Input */}
            <CustomInput
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              focused={confirmPasswordFocused}
              iconName="lock"
              secureTextEntry
              returnKeyType="next"
            />

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

            {/* ✅ ADD: Error message display */}
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {/* ✅ UPDATE: Register Button với loading state */}
            <CustomButton
              title={isLoading ? "Đang xử lý..." : "Đăng ký"}
              onPress={handleRegister}
              style={[
                styles.registerButton,
                isLoading && styles.buttonDisabled,
              ]}
              disabled={isLoading}
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Bạn đã có tài khoản?</Text>
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

// ✅ ADD: Error text style
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

  registerButton: {
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

  // ✅ ADD: Error text style
  errorText: {
    color: "#FF5722",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});
