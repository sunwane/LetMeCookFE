"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface HealthConditionPickerProps {
  selectedConditions: string[];
  onConditionsChange: (conditions: string[], customValues?: string[]) => void;
  customConditions?: string[];
  setCustomConditions?: (values: string[]) => void;
}

const healthConditions = [
  {
    label: "Không có vấn đề sức khỏe",
    value: "none",
    description: "Sức khỏe tốt, không bệnh lý",
    color: ["#4ECDC4", "#44A08D"],
  },
  {
    label: "Huyết áp cao",
    value: "hypertension",
    description: "Tăng huyết áp",
    color: ["#FF6B6B", "#FF8E53"],
  },
  {
    label: "Tiểu đường",
    value: "diabetes",
    description: "Đái tháo đường type 1 hoặc 2",
    color: ["#667EEA", "#764BA2"],
  },
  {
    label: "Bệnh tim",
    value: "heart_disease",
    description: "Các vấn đề về tim mạch",
    color: ["#F093FB", "#F5576C"],
  },
  {
    label: "Cholesterol cao",
    value: "high_cholesterol",
    description: "Mỡ máu cao",
    color: ["#4FACFE", "#00F2FE"],
  },
  {
    label: "Béo phì",
    value: "obesity",
    description: "Thừa cân, béo phì",
    color: ["#43E97B", "#38F9D7"],
  },
  {
    label: "Dị ứng thực phẩm",
    value: "food_allergies",
    description: "Dị ứng với một số thực phẩm",
    color: ["#FA709A", "#FEE140"],
  },
  {
    label: "Bệnh dạ dày",
    value: "stomach_problems",
    description: "Viêm loét dạ dày, trào ngược",
    color: ["#A8EDEA", "#FED6E3"],
  },
  {
    label: "Bệnh thận",
    value: "kidney_disease",
    description: "Suy thận, sỏi thận",
    color: ["#FF9A9E", "#FECFEF"],
  },
  {
    label: "Bệnh gan",
    value: "liver_disease",
    description: "Gan nhiễm mỡ, viêm gan",
    color: ["#A18CD1", "#FBC2EB"],
  },
];

const HealthConditionPicker: React.FC<HealthConditionPickerProps> = ({
  selectedConditions,
  onConditionsChange,
  customConditions = [],
  setCustomConditions = () => {},
}) => {
  const [animations] = useState(
    [...healthConditions, { value: "custom" }].map(() => new Animated.Value(1))
  );
  const [inputFocused, setInputFocused] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handlePress = (value: string, index: number) => {
    // Animation feedback
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    let newConditions = [...selectedConditions];

    // Handle "none" selection - if selected, clear all others
    if (value === "none") {
      if (selectedConditions.includes("none")) {
        newConditions = [];
      } else {
        newConditions = ["none"];
      }
    } else {
      // Remove "none" if selecting other conditions
      if (selectedConditions.includes("none")) {
        newConditions = newConditions.filter((c) => c !== "none");
      }

      // Toggle the selected condition
      if (selectedConditions.includes(value)) {
        newConditions = newConditions.filter((c) => c !== value);
      } else {
        newConditions.push(value);
      }
    }

    onConditionsChange(newConditions, customConditions);

    // If not custom, dismiss keyboard
    if (value !== "custom") {
      Keyboard.dismiss();
    }
  };

  const handleAddCustomCondition = () => {
    if (customInput.trim()) {
      const newCustomConditions = [...customConditions, customInput.trim()];
      setCustomConditions(newCustomConditions);
      onConditionsChange(selectedConditions, newCustomConditions);
      setCustomInput("");
    }
  };

  const handleRemoveCustomCondition = (index: number) => {
    const newCustomConditions = customConditions.filter((_, i) => i !== index);
    setCustomConditions(newCustomConditions);
    onConditionsChange(selectedConditions, newCustomConditions);
  };

  return (
    <View style={styles.container}>
      {/* Regular health condition options */}
      {healthConditions.map((condition, index) => {
        const isSelected = selectedConditions.includes(condition.value);

        return (
          <Animated.View
            key={condition.value}
            style={[
              styles.optionWrapper,
              {
                transform: [{ scale: animations[index] }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => handlePress(condition.value, index)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <LinearGradient
                  colors={condition.color}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}

              <View style={styles.optionContent}>
                <View style={styles.textContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.selectedLabel,
                    ]}
                  >
                    {condition.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.selectedDescription,
                    ]}
                  >
                    {condition.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.selectedCheckbox,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Custom condition option */}
      <Animated.View
        style={[
          styles.optionWrapper,
          {
            transform: [{ scale: animations[healthConditions.length] }],
          },
        ]}
      >
        <View
          style={[
            styles.option,
            styles.customOption,
            inputFocused && styles.focusedOption,
          ]}
        >
          <LinearGradient
            colors={["#FF9966", "#FF5E62"]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.customContent}>
            <Text style={[styles.optionLabel, styles.selectedLabel]}>
              Tình trạng khác
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.customInput}
                placeholder="Nhập tình trạng sức khỏe khác..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={customInput}
                onChangeText={setCustomInput}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onSubmitEditing={handleAddCustomCondition}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCustomCondition}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Display added custom conditions */}
            {customConditions.map((condition, index) => (
              <View key={index} style={styles.customTag}>
                <Text style={styles.customTagText}>{condition}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveCustomCondition(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 32,
  },

  optionWrapper: {
    marginBottom: 14,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },

  selectedOption: {
    borderColor: "transparent",
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  customOption: {
    borderColor: "transparent",
  },

  focusedOption: {
    shadowColor: "#FF9966",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContent: {
    flex: 1,
    paddingRight: 16,
  },

  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 6,
    lineHeight: 22,
  },

  selectedLabel: {
    color: "#FFFFFF",
  },

  optionDescription: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    lineHeight: 20,
  },

  selectedDescription: {
    color: "#FFFFFF",
    opacity: 0.9,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  selectedCheckbox: {
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  checkmark: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },

  customContent: {
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  customInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    marginRight: 12,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  customTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },

  customTagText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },

  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HealthConditionPicker;
