import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.appName}>LetMeCook</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/LogoNoName.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C2C2C",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
});
