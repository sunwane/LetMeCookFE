import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SocialButton from "../ui/SocialButton";

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  const handleAppleLogin = () => {
    console.log("Apple login");
  };

  return (
    <View style={styles.socialContainer}>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>HOẶC</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <SocialButton
          iconName="google"
          iconColor="#DB4437"
          onPress={handleGoogleLogin}
        />
        <SocialButton
          iconName="facebook"
          iconColor="#3b5998"
          onPress={handleFacebookLogin}
        />
        <SocialButton
          iconName="apple"
          iconColor="#000"
          onPress={handleAppleLogin}
        />
      </View>

      <Text style={styles.socialText}>Đăng nhập bằng phương thức khác</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

  socialText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
    marginTop: 5,
  },
});
