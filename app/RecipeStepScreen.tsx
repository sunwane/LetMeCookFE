import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecipeStep {
  id: string;
  step: number;
  description: string;
  waitTime?: string;
  recipe: {
  id: string;
  };
}

interface Recipe {
  id: string;
  foodName: string;
  cookingTime: string;
  difficulty: string;
}

const RecipeStepScreen = () => {
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Parse data from params
  const recipe: Recipe = params.recipeData ? JSON.parse(params.recipeData as string) : null;
  const steps: RecipeStep[] = params.steps ? JSON.parse(params.steps as string) : [];

  // Sort steps by step number
  const sortedSteps = steps.sort((a, b) => a.step - b.step);

  const handleNextStep = () => {
    if (currentStep < sortedSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (!recipe || !steps.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy hướng dẫn nấu ăn</Text>
      </View>
    );
  }

  const currentStepData = sortedSteps[currentStep];

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <Text style={styles.recipeName}>{recipe.foodName}</Text>
        <View style={styles.recipeStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>{recipe.cookingTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star-outline" size={16} color="#666" />
            <Text style={styles.statText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / sortedSteps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Bước {currentStep + 1} / {sortedSteps.length}
        </Text>
      </View>

      {/* Current Step Content */}
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>Bước {currentStepData.step}</Text>
            {currentStepData.waitTime && (
              <View style={styles.waitTimeContainer}>
                <Ionicons name="timer-outline" size={16} color="#FF5D00" />
                <Text style={styles.waitTime}>{currentStepData.waitTime}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>
      </ScrollView>

      {/* Step Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentStep === 0 ? "#ccc" : "#FF5D00"} 
          />
          <Text style={[
            styles.navButtonText, 
            currentStep === 0 && styles.navButtonTextDisabled
          ]}>
            Trước
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentStep === sortedSteps.length - 1 && styles.navButtonDisabled]}
          onPress={handleNextStep}
          disabled={currentStep === sortedSteps.length - 1}
        >
          <Text style={[
            styles.navButtonText, 
            currentStep === sortedSteps.length - 1 && styles.navButtonTextDisabled
          ]}>
            Tiếp
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentStep === sortedSteps.length - 1 ? "#ccc" : "#FF5D00"} 
          />
        </TouchableOpacity>
      </View>

      {/* Step List */}
      <View style={styles.stepListContainer}>
        <Text style={styles.stepListTitle}>Tất cả các bước:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepList}>
            {sortedSteps.map((step, index) => (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepListItem,
                  index === currentStep && styles.stepListItemActive,
                  index < currentStep && styles.stepListItemCompleted
                ]}
                onPress={() => handleStepSelect(index)}
              >
                <Text style={[
                  styles.stepListItemText,
                  index === currentStep && styles.stepListItemTextActive,
                  index < currentStep && styles.stepListItemTextCompleted
                ]}>
                  {step.step}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default RecipeStepScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A2917',
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF5D00',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5D00',
  },
  waitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  waitTime: {
    fontSize: 12,
    color: '#FF5D00',
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF5D00',
    gap: 5,
  },
  navButtonDisabled: {
    borderColor: '#ccc',
  },
  navButtonText: {
    fontSize: 14,
    color: '#FF5D00',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  stepListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepListTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  stepList: {
    flexDirection: 'row',
    gap: 8,
  },
  stepListItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepListItemActive: {
    backgroundColor: '#FF5D00',
    borderColor: '#FF5D00',
  },
  stepListItemCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepListItemText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  stepListItemTextActive: {
    color: '#fff',
  },
  stepListItemTextCompleted: {
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});