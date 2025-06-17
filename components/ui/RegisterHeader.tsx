import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface RegisterHeaderProps {
  logoSource: any;
  title: string;
  subtitle: string;
}

export default function RegisterHeader({
  logoSource,
  title,
  subtitle,
}: RegisterHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={logoSource} style={styles.logo} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
