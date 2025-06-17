import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface HeightPickerProps {
  selectedHeight: number;
  onHeightChange: (height: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

const HeightPicker = ({
  selectedHeight,
  onHeightChange,
  minHeight = 140,
  maxHeight = 200,
}: HeightPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 60;
  const heights = Array.from(
    { length: maxHeight - minHeight + 1 },
    (_, i) => minHeight + i
  );

  useEffect(() => {
    const initialIndex = heights.indexOf(selectedHeight);
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
    const clampedIndex = Math.max(0, Math.min(index, heights.length - 1));
    const newHeight = heights[clampedIndex];

    if (newHeight !== selectedHeight) {
      onHeightChange(newHeight);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(contentOffsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, heights.length - 1));

    scrollViewRef.current?.scrollTo({
      y: clampedIndex * itemHeight,
      animated: true,
    });
  };

  const renderHeightItem = (heightValue: number) => {
    const isSelected = heightValue === selectedHeight;

    return (
      <View
        key={heightValue}
        style={[styles.heightItem, { height: itemHeight }]}
      >
        <View style={styles.heightItemContent}>
          <Text
            style={[styles.heightText, isSelected && styles.selectedHeightText]}
          >
            {heightValue}
          </Text>
          <Text
            style={[styles.heightUnit, isSelected && styles.selectedHeightUnit]}
          >
            cm
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
        style={styles.heightPicker}
        contentContainerStyle={[
          styles.heightPickerContent,
          { paddingTop: itemHeight * 2, paddingBottom: itemHeight * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={itemHeight}
        decelerationRate="fast"
      >
        {heights.map((heightValue) => renderHeightItem(heightValue))}
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
  heightPicker: {
    flex: 1,
  },
  heightPickerContent: {
    alignItems: "center",
  },
  heightItem: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heightItemContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  heightText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },
  selectedHeightText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF5722",
  },
  heightUnit: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },
  selectedHeightUnit: {
    fontSize: 20,
    color: "#FF5722",
    fontWeight: "600",
  },
});

export default HeightPicker;
