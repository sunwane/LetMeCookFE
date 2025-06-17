import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface AgePickerProps {
  selectedAge: number;
  onAgeChange: (age: number) => void;
  minAge?: number;
  maxAge?: number;
}

const AgePicker = ({
  selectedAge,
  onAgeChange,
  minAge = 18,
  maxAge = 80,
}: AgePickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 60;
  const ages = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => minAge + i
  );

  useEffect(() => {
    const initialIndex = ages.indexOf(selectedAge);
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
    const clampedIndex = Math.max(0, Math.min(index, ages.length - 1));
    const newAge = ages[clampedIndex];

    if (newAge !== selectedAge) {
      onAgeChange(newAge);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(contentOffsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, ages.length - 1));

    scrollViewRef.current?.scrollTo({
      y: clampedIndex * itemHeight,
      animated: true,
    });
  };

  const renderAgeItem = (ageValue: number) => {
    const isSelected = ageValue === selectedAge;

    return (
      <View key={ageValue} style={[styles.ageItem, { height: itemHeight }]}>
        <View style={styles.ageItemContent}>
          <Text style={[styles.ageText, isSelected && styles.selectedAgeText]}>
            {ageValue}
          </Text>
          <Text style={[styles.ageUnit, isSelected && styles.selectedAgeUnit]}>
            tuổi
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.selectionOverlay}>
        <View style={styles.selectionBox} />
      </View>

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

      <ScrollView
        ref={scrollViewRef}
        style={styles.agePicker}
        contentContainerStyle={[
          styles.agePickerContent,
          { paddingTop: itemHeight * 2, paddingBottom: itemHeight * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={itemHeight}
        decelerationRate="fast"
      >
        {ages.map((ageValue) => renderAgeItem(ageValue))}
      </ScrollView>
    </View>
  );
};

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
    transform: [{ translateX: -60 }, { translateY: -25 }],
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    pointerEvents: "none",
  },
  selectionBox: {
    width: 120,
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
  agePicker: {
    flex: 1,
  },
  agePickerContent: {
    alignItems: "center",
  },
  ageItem: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  ageItemContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  ageText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },
  selectedAgeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF5722",
  },
  ageUnit: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },
  selectedAgeUnit: {
    fontSize: 20,
    color: "#FF5722",
    fontWeight: "600",
  },
});

export default AgePicker;
