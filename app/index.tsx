import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />

      {/* Enhanced Background */}
      <View style={styles.backgroundGradient} />

      {/* Redesigned Background decorative circles - Bố cục hợp lý hơn */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />
      <View style={styles.backgroundCircle4} />
      <View style={styles.backgroundCircle5} />
      <View style={styles.backgroundCircle6} />
      <View style={styles.backgroundCircle7} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo và tiêu đề */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LogoNoName.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>ĐĂNG NHẬP</Text>
          <Text style={styles.subtitle}>Chào mừng trở lại với nấu nướng!</Text>
        </View>

        {/* Enhanced Form đăng nhập */}
        <View style={styles.form}>
          <View
            style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused,
            ]}
          >
            <FontAwesome
              name="user"
              size={16}
              color={emailFocused ? "#FF5722" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Tài khoản"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused,
            ]}
          >
            <FontAwesome
              name="lock"
              size={16}
              color={passwordFocused ? "#FF5722" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity>
              <Text style={styles.link}> Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Social login */}
        <View style={styles.socialContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <View style={styles.socialButtonInner}>
                <FontAwesome name="google" size={20} color="#DB4437" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <View style={styles.socialButtonInner}>
                <FontAwesome name="facebook" size={20} color="#3b5998" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <View style={styles.socialButtonInner}>
                <FontAwesome name="apple" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.socialText}>Đăng nhập bằng phương thức khác</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    position: "relative",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
  },

  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF8F0",
  },

  // Vòng tròn chính với gradient effect
  backgroundCircle1: {
    position: "absolute",
    top: -150,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#FF7043",
    opacity: 0.08,
    // Tạo hiệu ứng blur nhẹ
    shadowColor: "#FF7043",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 0,
  },

  // Vòng tròn accent với glow effect
  backgroundCircle2: {
    position: "absolute",
    top: -20,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FF5722",
    opacity: 0.12,
    shadowColor: "#FF5722",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 0,
  },

  // Vòng tròn floating với subtle animation effect
  backgroundCircle3: {
    position: "absolute",
    top: height * 0.4,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFAB91",
    opacity: 0.1,
    shadowColor: "#FFAB91",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 0,
  },

  // Vòng tròn lớn với soft gradient
  backgroundCircle4: {
    position: "absolute",
    bottom: -180,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FF6D00",
    opacity: 0.06,
    shadowColor: "#FF6D00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 50,
    elevation: 0,
  },

  // Vòng tròn nhỏ trang trí với sparkle effect
  backgroundCircle5: {
    position: "absolute",
    top: height * 0.2,
    right: width * 0.2,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFB74D",
    opacity: 0.15,
    shadowColor: "#FFB74D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 0,
  },

  // Vòng tròn micro accent
  backgroundCircle6: {
    position: "absolute",
    top: height * 0.65,
    right: width * 0.15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF8A65",
    opacity: 0.12,
    shadowColor: "#FF8A65",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 0,
  },

  // Vòng tròn floating nhỏ
  backgroundCircle7: {
    position: "absolute",
    bottom: height * 0.25,
    left: width * 0.1,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FFCC02",
    opacity: 0.18,
    shadowColor: "#FFCC02",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 0,
  },

  header: {
    alignItems: "flex-start",
    marginBottom: 35,
    zIndex: 10,
  },

  logoContainer: {
    marginBottom: 5,
    alignSelf: "flex-start",
  },

  logo: {
    width: 120,
    height: 120,
    marginLeft: -10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C2C2C",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "left",
    alignSelf: "flex-start",
    opacity: 0.8,
    fontWeight: "500",
  },

  form: {
    marginBottom: 30,
    zIndex: 10,
  },

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

  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgot: {
    color: "#FF5722",
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
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

  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
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

  socialContainer: {
    alignItems: "center",
    zIndex: 10,
    marginTop: 10,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(102, 102, 102, 0.2)",
  },

  orText: {
    marginHorizontal: 15,
    fontWeight: "700",
    color: "#666",
    fontSize: 11,
    letterSpacing: 0.5,
  },

  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "65%",
    marginVertical: 20,
  },

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

  socialText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
    marginTop: 5,
  },
});
