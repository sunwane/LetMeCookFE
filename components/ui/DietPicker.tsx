"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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

interface DietPickerProps {
  selectedDiet: string;
  onDietChange: (diet: string, customValue?: string) => void;
  customDiet?: string;
  setCustomDiet?: (value: string) => void;
}

const dietOptions = [
  {
    label: "Ăn uống thông thường",
    value: "standard",
    description: "Không hạn chế đặc biệt",
    color: ["#4ECDC4", "#44A08D"],
  },
  {
    label: "Ăn chay",
    value: "vegetarian",
    description: "Không thịt, có trứng & sữa",
    color: ["#56AB2F", "#A8E6CF"],
  },
  {
    label: "Ăn thuần chay",
    value: "vegan",
    description: "Hoàn toàn từ thực vật",
    color: ["#11998E", "#38EF7D"],
  },
  {
    label: "Keto",
    value: "keto",
    description: "Ít carb, nhiều chất béo",
    color: ["#FF6B6B", "#FF8E53"],
  },
  {
    label: "Low-carb",
    value: "low-carb",
    description: "Giảm tinh bột",
    color: ["#667EEA", "#764BA2"],
  },
  {
    label: "Mediterranean",
    value: "mediterranean",
    description: "Dầu olive, cá, rau củ",
    color: ["#F093FB", "#F5576C"],
  },
];

const DietPicker: React.FC<DietPickerProps> = ({
  selectedDiet,
  onDietChange,
  customDiet = "",
  setCustomDiet = () => {},
}) => {
  const [animations] = useState(
    [...dietOptions, { value: "custom" }].map(() => new Animated.Value(1))
  );
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Focus the input when custom is selected
  useEffect(() => {
    if (selectedDiet === "custom" && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [selectedDiet]);

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

    onDietChange(value);

    // If not custom, dismiss keyboard
    if (value !== "custom") {
      Keyboard.dismiss();
    }
  };

  const handleCustomInputChange = (text: string) => {
    setCustomDiet(text);
    onDietChange("custom", text);
  };

  return (
    <View style={styles.container}>
      {/* Regular diet options */}
      {dietOptions.map((option, index) => {
        const isSelected = selectedDiet === option.value;

        return (
          <Animated.View
            key={option.value}
            style={[
              styles.optionWrapper,
              {
                transform: [{ scale: animations[index] }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => handlePress(option.value, index)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <LinearGradient
                  colors={option.color}
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
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.selectedDescription,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioButton,
                    isSelected && styles.selectedRadio,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Custom diet option */}
      <Animated.View
        style={[
          styles.optionWrapper,
          {
            transform: [{ scale: animations[dietOptions.length] }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.option,
            selectedDiet === "custom" && styles.selectedOption,
            inputFocused && styles.focusedOption,
          ]}
          onPress={() => handlePress("custom", dietOptions.length)}
          activeOpacity={0.8}
        >
          {selectedDiet === "custom" && (
            <LinearGradient
              colors={["#FF9966", "#FF5E62"]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          <View style={styles.customOptionContent}>
            <View style={styles.customTextContent}>
              <Text
                style={[
                  styles.optionLabel,
                  selectedDiet === "custom" && styles.selectedLabel,
                ]}
              >
                Tự nhập chế độ ăn khác
              </Text>

              {selectedDiet === "custom" ? (
                <TextInput
                  ref={inputRef}
                  style={[styles.customInput, styles.selectedLabel]}
                  placeholder="Nhập chế độ ăn của bạn..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={customDiet}
                  onChangeText={handleCustomInputChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              ) : (
                <Text style={styles.optionDescription}>
                  Nhập chế độ ăn riêng của bạn
                </Text>
              )}
            </View>

            <View
              style={[
                styles.radioButton,
                selectedDiet === "custom" && styles.selectedRadio,
              ]}
            >
              {selectedDiet === "custom" && <View style={styles.radioInner} />}
            </View>
          </View>
        </TouchableOpacity>
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

  focusedOption: {
    borderColor: "#FF9966",
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

  customOptionContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  textContent: {
    flex: 1,
    paddingRight: 16,
  },

  customTextContent: {
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

  customInput: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    color: "#FFFFFF",
    minHeight: 40, // Đảm bảo input có chiều cao tối thiểu
  },

  radioButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 2, // Căn chỉnh với text
  },

  selectedRadio: {
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF6B6B",
  },
});

export default DietPicker;
