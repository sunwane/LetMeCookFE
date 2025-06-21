import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CookingStepProps {
  stepNumber: number;
  description: string;
  waitTime?: number; // Giữ lại để có thể sử dụng cho logic khác
}

const CookingStep = ({ stepNumber, description, waitTime }: CookingStepProps) => {
  return (
    <View style={styles.instructionItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{stepNumber}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.instructionText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5D00',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default CookingStep;