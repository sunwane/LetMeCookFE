import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function RegisterHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/LogoNoName.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>ĐĂNG KÝ</Text>
      <Text style={styles.subtitle}>
        Tham gia cộng đồng nấu nướng ngay hôm nay!
      </Text>
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
