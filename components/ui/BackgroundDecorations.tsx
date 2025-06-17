import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const BackgroundDecorations = () => {
  return (
    <>
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />
      <View style={styles.backgroundCircle4} />
      <View style={styles.backgroundCircle5} />
    </>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF8F0",
  },
  backgroundCircle1: {
    position: "absolute",
    top: -150,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#FF7043",
    opacity: 0.08,
  },
  backgroundCircle2: {
    position: "absolute",
    top: -20,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FF5722",
    opacity: 0.12,
  },
  backgroundCircle3: {
    position: "absolute",
    top: height * 0.4,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFAB91",
    opacity: 0.1,
  },
  backgroundCircle4: {
    position: "absolute",
    bottom: -180,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FF6D00",
    opacity: 0.06,
  },
  backgroundCircle5: {
    position: "absolute",
    top: height * 0.65,
    right: width * 0.15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF8A65",
    opacity: 0.12,
  },
});

export default BackgroundDecorations;
