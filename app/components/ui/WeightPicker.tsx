// components/WeightPicker.tsx
import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface WeightPickerProps {
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
  weights: number[];
}

export default function WeightPicker({
  selectedWeight,
  onWeightChange,
  weights,
}: WeightPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 60;

  useEffect(() => {
    const initialIndex = weights.indexOf(selectedWeight);
    if (initialIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: initialIndex * itemHeight,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(contentOffsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, weights.length - 1));
    const newWeight = weights[clampedIndex];

    if (newWeight !== selectedWeight) {
      onWeightChange(newWeight);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(contentOffsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, weights.length - 1));

    scrollViewRef.current?.scrollTo({
      y: clampedIndex * itemHeight,
      animated: true,
    });
  };

  const renderWeightItem = (weightValue: number) => {
    const isSelected = weightValue === selectedWeight;

    return (
      <View
        key={weightValue}
        style={[styles.weightItem, { height: itemHeight }]}
      >
        <View style={styles.weightItemContent}>
          <Text
            style={[styles.weightText, isSelected && styles.selectedWeightText]}
          >
            {weightValue}
          </Text>
          <Text
            style={[styles.weightUnit, isSelected && styles.selectedWeightUnit]}
          >
            kg
          </Text>
        </View>
        {isSelected && <View style={styles.selectedIndicator} />}
      </View>
    );
  };

  return (
    <View style={styles.pickerContainer}>
      {/* Selection Overlay */}
      <View style={styles.selectionOverlay}>
        <View style={styles.selectionBox} />
      </View>

      {/* Fade Gradients */}
      <LinearGradient
        colors={["#FFF8F0", "transparent"]}
        style={styles.fadeTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "#FFF8F0"]}
        style={styles.fadeBottom}
        pointerEvents="none"
      />

      {/* Weight Picker ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.weightPicker}
        contentContainerStyle={[
          styles.weightPickerContent,
          { paddingTop: itemHeight * 2, paddingBottom: itemHeight * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={itemHeight}
        decelerationRate="fast"
      >
        {weights.map((weightValue) => renderWeightItem(weightValue))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: "100%",
    height: 240,
    position: "relative",
    marginBottom: 20,
  },

  selectionOverlay: {
    position: "absolute",
    top: "64%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -25 }],
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    pointerEvents: "none",
  },

  selectionBox: {
    width: 150,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(255, 87, 34, 0.1)",
    borderWidth: 2,
    borderColor: "#FF5722",
  },

  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 5,
    pointerEvents: "none",
  },

  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 5,
    pointerEvents: "none",
  },

  weightPicker: {
    flex: 1,
  },

  weightPickerContent: {
    alignItems: "center",
  },

  weightItem: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  weightItemContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },

  weightText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },

  selectedWeightText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF5722",
  },

  weightUnit: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },

  selectedWeightUnit: {
    fontSize: 20,
    color: "#FF5722",
    fontWeight: "600",
  },

  selectedIndicator: {
    // Có thể thêm indicator nếu cần
  },
});
