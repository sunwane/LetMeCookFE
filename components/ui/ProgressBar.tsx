import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number; // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(200, 200, 200, 0.4)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6D00",
    borderRadius: 4,
  },
});
