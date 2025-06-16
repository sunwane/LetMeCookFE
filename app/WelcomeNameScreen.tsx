"use client";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  type KeyboardEvent,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Import components
import BackgroundDecorations from "./components/ui/BackgroundDecorations";
import CustomButton from "./components/ui/CustomButton";
import CustomInput from "./components/ui/CustomInput";
import RegisterHeader from "./components/ui/RegisterHeader";
import ProgressBar from "./components/ui/ProgressBar";

const { height } = Dimensions.get("window");

type WelcomeNameScreenProps = {};

export default function WelcomeNameScreen({}: WelcomeNameScreenProps) {
  const [name, setName] = useState<string>("");
  const [nameFocused, setNameFocused] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    // Animation khi màn hình load
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

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

  const handleContinue = (): void => {
    if (!name.trim()) {
      console.log("Vui lòng nhập tên của bạn");
      return;
    }

    console.log("Tên người dùng:", name);

    // Lưu tên vào storage hoặc context để sử dụng sau này
    // Chuyển đến màn hình GenderSelection
    router.push("/GenderSelection");
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFF8F0"
          translucent={false}
        />

        {/* Background Gradient */}
        <LinearGradient
          colors={["#FFF8F0", "#F8F4E6", "#F5F1E8"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Background decorations */}
        <BackgroundDecorations />

        {/* Progress Bar - Bước đầu tiên trong quy trình */}
        <ProgressBar progress={12.5} />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bounces={true}
        >
          <Animated.View
            style={[
              styles.animatedContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <RegisterHeader
              logoSource={require("../assets/images/LogoNoName.png")}
              title="CHÀO MỪNG!"
              subtitle="Chúng tôi rất vui được gặp bạn"
            />

            {/* Welcome Content */}
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>
                Hãy cho chúng tôi biết tên của bạn
              </Text>
              <Text style={styles.welcomeDescription}>
                Chúng tôi sẽ sử dụng tên này để cá nhân hóa trải nghiệm của bạn
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <CustomInput
                placeholder="Tên của bạn"
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                focused={nameFocused}
                iconName="user"
                returnKeyType="done"
                autoCapitalize="words"
              />

              {/* Continue Button */}
              <CustomButton
                title="Tiếp tục"
                onPress={handleContinue}
                style={styles.continueButton}
              />
            </View>

            {/* Footer message */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{" "}
                <Text style={styles.linkText}>Chính sách bảo mật</Text> của
                chúng tôi
              </Text>
            </View>
          </Animated.View>
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
    paddingTop: 60, // Thêm padding top để tránh đụng ProgressBar
    paddingBottom: 20,
    minHeight: height - 140, // Giảm minHeight để tính đến padding top
  },

  animatedContent: {
    flex: 1,
  },

  welcomeContent: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  welcomeDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    opacity: 0.9,
  },

  form: {
    marginBottom: 30,
    zIndex: 10,
  },

  continueButton: {
    marginTop: 24,
    marginBottom: 25,
  },

  footerContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 20,
  },

  footerText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.8,
  },

  linkText: {
    color: "#FF5722",
    fontWeight: "600",
  },
});
