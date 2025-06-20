import CookingStep from '@/components/CookingStep';
import InfoItem from '@/components/InfoItem';
import ServingAdjuster from '@/components/ServingAdjuster';
import { sampleRecipeIngredients } from '@/services/types/RecipeIngredients';
import { RecipeItem } from '@/services/types/RecipeItem';
import { sampleRecipeSteps } from '@/services/types/RecipeStep';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecipeScreen = () => {
  const { recipeData } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(100);
  const [servingSize, setServingSize] = useState(4);

  // Parse recipe data từ params
  const recipe: RecipeItem = recipeData ? JSON.parse(recipeData as string) : null;

  // Lấy ingredients cho recipe hiện tại
  const recipeIngredients = useMemo(() => {
    if (!recipe) return [];
    return sampleRecipeIngredients.filter(ri => ri.recipe.id === recipe.id);
  }, [recipe]);

  // Tính toán nutrition cho 1 khẩu phần
  const nutritionPerServing = useMemo(() => {
    if (recipeIngredients.length === 0) return [];
    
    const baseServingSize = 4;
    const nutritionData: { name: string; calories: number; amount: number; unit: string }[] = [];
    
    recipeIngredients.forEach(ri => {
      const quantityPerServing = ri.quantity / baseServingSize;
      const caloriesPerServing = quantityPerServing * ri.ingredient.caloriesPerUnit;
      
      nutritionData.push({
        name: ri.ingredient.name,
        calories: caloriesPerServing,
        amount: quantityPerServing,
        unit: ri.ingredient.measurementUnit
      });
    });

    return nutritionData;
  }, [recipeIngredients]);

  // Tính tổng calories cho 1 khẩu phần
  const totalCaloriesPerServing = useMemo(() => {
    return nutritionPerServing.reduce((total, item) => total + item.calories, 0);
  }, [nutritionPerServing]);

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
  };

  // Handle serving size change
  const handleServingSizeChange = (newSize: number) => {
    setServingSize(newSize);
  };

  // Cập nhật header cố định
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
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
              <Image 
                source={isLiked ? require("@/assets/images/icons/Like_Active.png") : require("@/assets/images/icons/Like.png")} 
                style={styles.likeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleBookmark}>
              <Image 
                source={isBookmarked ? require("@/assets/images/icons/Bookmark_Active.png") : require("@/assets/images/icons/Bookmark.png")} 
                style={styles.markIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation, isBookmarked, isLiked]);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy công thức</Text>
      </View>
    );
  }

  // Lấy các bước làm món ăn
  const recipeSteps = useMemo(() => {
    if (!recipe) return [];
    return sampleRecipeSteps.filter(step => step.recipe.id === recipe.id);
  }, [recipe]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {/* Hình ảnh, tiêu đề, mô tả, thông số */}
        <View style={styles.mainInfoContainer}>
          <Text style={styles.recipeTitle}>{recipe.foodName}</Text>
          
          <Text style={styles.recipeDescription}>
            {recipe.description || 'Mì quảng nhưng mà người Quảng Ninh nấu, đặc biệt nước súp có vị than Quảng Ninh.'}
          </Text>
          
          <Text style={styles.recipeTags}>
            Xem thêm các món tương tự tại: 
            <Text style={styles.tagLink}> {recipe.category?.name || 'Bún, mì, phở'}</Text> và 
            <Text style={styles.tagLink}> {recipe.subCategory?.name || 'Mì'}</Text>
          </Text>
          
          {/* Độ khó, thời gian nấu, lượt like */}
          <View style={styles.statsContainer}>
            <View style={styles.leftStats}>
              <View style={[styles.statItem, styles.borderStat]}>
                <Image 
                  source={require('@/assets/images/icons/stars.png')} 
                  style={styles.icon}
                />                
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
              <View style={[styles.statItem, styles.borderStat]}>
                <Image 
                  source={require('@/assets/images/icons/Clock.png')} 
                  style={styles.icon}
                />
                <Text style={styles.statText}>{recipe.cookingTime}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.rightStats} onPress={toggleLike}>
              <View style={styles.statItem}>
                <Image 
                  source={isLiked ? require('@/assets/images/icons/Like_Active.png') : require('@/assets/images/icons/Like.png')} 
                  style={isLiked ? styles.liked : styles.icon}
                />
                <Text style={[
                  styles.statText,
                  isLiked && styles.statTextActive
                ]}>
                  {isLiked ? recipe.likes + 1 : recipe.likes} lượt thích
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hình ảnh chính */}
        <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />

        {/* Nguyên liệu Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nguyên liệu dùng cho công thức</Text>
          
          {/* Sử dụng ServingAdjuster component */}
          <ServingAdjuster
            initialValue={4}
            onValueChange={handleServingSizeChange}
            containerStyle={styles.servingAdjusterContainer}
          />

          <View style={styles.listContainer}>
            {recipeIngredients.length > 0 ? (
              recipeIngredients.map((ri, index) => (
                <InfoItem
                  key={index}
                  label={ri.ingredient.name}
                  value={`${Math.round(ri.quantity * servingSize / 4)}${ri.ingredient.measurementUnit}`}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu</Text>
            )}
          </View>
        </View>
        
        {/* Dinh dưỡng Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dinh dưỡng có trong 1 khẩu phần</Text>
          <View style={styles.listContainer}>
            {nutritionPerServing.length > 0 ? (
              <>
                {/* Tổng calories */}
                <InfoItem
                  label="Tổng năng lượng"
                  value={`${Math.round(totalCaloriesPerServing)} kcal`}
                  badgeType="diet"
                />
                
                {/* Chi tiết từng nguyên liệu */}
                {nutritionPerServing.map((item, index) => (
                  <InfoItem
                    key={index}
                    label={`${item.name} (${Math.round(item.amount)}${item.unit})`}
                    value={`${Math.round(item.calories)} kcal`}
                  />
                ))}
                
              </>
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu</Text>
            )}
          </View>
        </View>

        {/* Instructions Section - Sử dụng CookingStep component */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hướng dẫn nấu</Text>
          
          {/* Cooking Stats Container */}
          <View style={styles.cookingStatContainer}>
            <View style={[styles.statSection, styles.dividerLine]}>
              <Text style={styles.statLabel}>Thời gian nấu:</Text>
              <Text style={styles.statValue}>{recipe.cookingTime}</Text>
            </View>
                        
            <View style={styles.statSection}>
              <Text style={styles.statLabel}>Số bước thực hiện:</Text>
              <Text style={styles.statValue}>{recipeSteps.length} bước</Text>
            </View>
          </View>

          
          
          <View style={styles.instructionsList}>
            {recipeSteps.length > 0 ? (
              recipeSteps.map((step) => (
                <CookingStep
                  key={step.id}
                  stepNumber={step.step}
                  description={step.description}
                  waitTime={step.waitTime}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu</Text>
            )}
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
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 5,
  },
  markIcon: {
    width: 16,
    height: 24,
    tintColor: '#FF5D00',
  },
  likeIcon: {
    width: 24,
    height: 24,
    tintColor: '#FF5D00',
  },
  mainInfoContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A2917',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
    textAlign: 'justify',
  },
  recipeTags: {
    fontSize: 13,
    color: '#666',
    marginBottom: 40,
  },
  tagLink: {
    color: '#FF5D00',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: -3,
  },
  leftStats: {
    flexDirection: 'row',
    gap: 10,
  },
  rightStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 1,
    tintColor: 'rgba(0,0,0,0.7)',
  },
  liked: {
    width: 15,
    height: 15,
    marginRight: 1,
    tintColor: '#FF5D00',
  },
  statText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  statTextActive: {
    color: '#FF5D00',
    fontWeight: '600',
  },
  borderStat: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    marginBottom: 25,
  },
  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  servingAdjusterContainer: {
    marginBottom: 15,
  },
  listContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  
  // Cooking Stats Container Styles
  cookingStatContainer: {
    backgroundColor: '#ececec',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 30,
  },
  statSection: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  dividerLine: {
    borderRightColor: '#cecece',
    borderRightWidth: 2,
    paddingRight: 30,
    paddingVertical: -20,
  },
  
  instructionsList: {
  },
  // Style cho text fallback
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
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