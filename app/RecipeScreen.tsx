import { RecipeItem } from '@/services/types/RecipeItem';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecipeScreen = () => {
  const { recipeData } = useLocalSearchParams();
  const navigation = useNavigation();

  // Parse recipe data từ params
  const recipe: RecipeItem = recipeData ? JSON.parse(recipeData as string) : null;

  // Cập nhật header
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FF5D00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết công thức</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#FF5D00" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy công thức</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />
      
      {/* Recipe Info */}
      <View style={styles.contentContainer}>
        <Text style={styles.recipeTitle}>{recipe.foodName}</Text>
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{recipe.difficulty}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color="#FF5D00" />
            <Text style={styles.statText}>{recipe.cookingTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#FF5D00" />
            <Text style={styles.statText}>{recipe.likes} lượt thích</Text>
          </View>
        </View>

        {/* Category Info */}
        {(recipe.category || recipe.subCategory) && (
          <View style={styles.categoryContainer}>
            {recipe.category && (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{recipe.subCategory?.category?.name}</Text>
              </View>
            )}
            {recipe.subCategory && (
              <View style={styles.subCategoryTag}>
                <Text style={styles.subCategoryText}>{recipe.subCategory.name}</Text>
              </View>
            )}
          </View>
        )}

        {/* Description Placeholder */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>
            Đây là một món ăn ngon và bổ dưỡng, phù hợp cho cả gia đình. 
            Với hương vị đặc trưng và cách chế biến đơn giản, đây sẽ là lựa chọn tuyệt vời cho bữa ăn của bạn.
          </Text>
        </View>

        {/* Ingredients Placeholder */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nguyên liệu</Text>
          <View style={styles.ingredientsList}>
            <Text style={styles.ingredientItem}>• Nguyên liệu chính</Text>
            <Text style={styles.ingredientItem}>• Gia vị</Text>
            <Text style={styles.ingredientItem}>• Rau củ</Text>
          </View>
        </View>

        {/* Instructions Placeholder */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hướng dẫn</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>1. Chuẩn bị nguyên liệu</Text>
            <Text style={styles.instructionItem}>2. Sơ chế nguyên liệu</Text>
            <Text style={styles.instructionItem}>3. Tiến hành chế biến</Text>
            <Text style={styles.instructionItem}>4. Trang trí và thưởng thức</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#74341C',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkButton: {
    padding: 5,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#74341C',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  categoryTag: {
    backgroundColor: '#FF5D00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subCategoryTag: {
    backgroundColor: '#FFE5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  subCategoryText: {
    color: '#FF5D00',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#74341C',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'justify',
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    paddingLeft: 10,
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