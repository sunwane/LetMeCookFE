import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function LoginHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/LogoNoName.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>
      <Text style={styles.subtitle}>Chào mừng trở lại với nấu nướng!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "left",
    alignSelf: "flex-start",
    opacity: 0.8,
    fontWeight: "500",
  },
});
