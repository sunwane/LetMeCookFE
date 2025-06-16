import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface QuestionSectionProps {
  iconSource?: any;
  question: string;
  description?: string;
}

const QuestionSection = ({
  iconSource = require("../../../assets/images/height.png"),
  question,
  description,
}: QuestionSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.question}>{question}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: "#666",
    opacity: 0.7,
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 15,
    opacity: 0.8,
    maxWidth: "95%",
  },
});

export default QuestionSection;
