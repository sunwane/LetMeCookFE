import CookingStep from '@/components/CookingStep';
import InfoItem from '@/components/InfoItem';
import OneCmt from '@/components/OneCmt';
import ServingAdjuster from '@/components/ServingAdjuster';
import { sampleComments } from '@/services/types/CommentItem';
import { getAllIngredients, Ingredients } from '@/services/types/Ingredients';
import { getAllRecipeIngredientsByRecipeId, RecipeIngredientsResponse } from '@/services/types/RecipeIngredients';
import { createFavoriteRecipe, createLikeRecipe, deleteFavoriteRecipe, deleteLikeRecipe, getAllFavouriteRecipe, getAllRecipeAccoountLike, RecipeItem } from '@/services/types/RecipeItem';
import { sampleRecipeSteps } from '@/services/types/RecipeStep';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Thêm import cho RecipeStep API
import { getStepByRecipeId, RecipeStepsResponse } from '@/services/types/RecipeStep';

const RecipeScreen = () => {
  const { recipeData } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [servingSize, setServingSize] = useState(1); // Thay đổi từ 4 thành 1
  
  // State cho API data
  const [recipeIngredientsData, setRecipeIngredientsData] = useState<RecipeIngredientsResponse[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false); // Thêm loading state cho like
  // Thêm state cho recipe steps
  const [recipeStepsData, setRecipeStepsData] = useState<RecipeStepsResponse[]>([]);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);

  // Parse recipe data và tạo state để cập nhật realtime
  const [recipe, setRecipe] = useState<RecipeItem>(() => {
    return recipeData ? JSON.parse(recipeData as string) : null;
  });

  // Kiểm tra bookmark status từ database
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await getAllFavouriteRecipe();
        if (response?.result && Array.isArray(response.result)) {
          const isInFavorites = response.result.some(favorite => 
            favorite.recipeId === recipe.id
          );
          setIsBookmarked(isInFavorites);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
        setIsBookmarked(false);
      }
    };

    if (recipe?.id) {
      checkBookmarkStatus();
    }
  }, [recipe?.id]);

  const toggleBookmark = async (recipeId: string) => {
    if (isBookmarkLoading || !recipe?.id) return; // Prevent multiple calls
    
    setIsBookmarkLoading(true);
    
    try {
      if (isBookmarked) {
        // Xử lý khi bỏ bookmark
        await deleteFavoriteRecipe(recipe.id);
        setIsBookmarked(false);
      } else {
        // Xử lý khi thêm bookmark
        await createFavoriteRecipe(recipe.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý bookmark:', error);
      
      // Revert lại trạng thái nếu có lỗi
      // setIsBookmarked(!isBookmarked); // Có thể bỏ comment nếu muốn revert
    } finally {
      setIsBookmarkLoading(false);
    }
  };

   useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await getAllRecipeAccoountLike(recipe.id);
        if (response?.result && Array.isArray(response.result)) {
          const isInLikes = response.result.some(like => 
            like.recipeId === recipe.id
          );
          setIsLiked(isInLikes);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
        setIsLiked(false);
      }
    };

    if (recipe?.id) {
      checkLikeStatus();
    }
  }, [recipe?.id]);

const toggleLike = async (recipeId: string) => {
  if (isLikeLoading || !recipe?.id) return; // Prevent multiple calls
  
  setIsLikeLoading(true);
  
  try {
    if (isLiked) {
      // Xử lý khi bỏ like
      await deleteLikeRecipe(recipe.id);
      setIsLiked(false);
      // Giảm totalLikes đi 1
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        totalLikes: Math.max(0, prevRecipe.totalLikes - 1)
      }));
    } else {
      // Xử lý khi thêm like
      await createLikeRecipe(recipe.id);
      setIsLiked(true);
      // Tăng totalLikes lên 1
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        totalLikes: prevRecipe.totalLikes + 1
      }));
    }
  } catch (error) {
    console.error('Lỗi khi xử lý like:', error);
    
    // Revert lại trạng thái nếu có lỗi
    // setIsLiked(!isLiked); // Có thể bỏ comment nếu muốn revert
  } finally {
    setIsLikeLoading(false);
  }
};

  // Fetch ingredients khi component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      if (!recipe?.id) return;
      
      setIsLoadingIngredients(true);
      try {
        // Gọi 2 API song song
        const [recipeIngredientsResponse, allIngredientsResponse] = await Promise.all([
          getAllRecipeIngredientsByRecipeId(recipe.id),
          getAllIngredients()
        ]);

        console.log('RecipeScreen - RecipeIngredients response:', recipeIngredientsResponse);
        console.log('RecipeScreen - AllIngredients response:', allIngredientsResponse);
        
        if (recipeIngredientsResponse?.result && Array.isArray(recipeIngredientsResponse.result)) {
          setRecipeIngredientsData(recipeIngredientsResponse.result);
        }
        
        if (allIngredientsResponse?.result && Array.isArray(allIngredientsResponse.result)) {
          setAllIngredients(allIngredientsResponse.result);
        }
        
      } catch (error) {
        console.error('RecipeScreen - Error fetching ingredients:', error);
        setRecipeIngredientsData([]);
        setAllIngredients([]);
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    fetchIngredients();
  }, [recipe?.id]);

  // Fetch recipe steps khi component mount
  useEffect(() => {
    const fetchRecipeSteps = async () => {
      if (!recipe?.id) return;
      
      setIsLoadingSteps(true);
      try {
        const response = await getStepByRecipeId(recipe.id);
        console.log('RecipeScreen - RecipeSteps response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setRecipeStepsData(response.result);
        }
      } catch (error) {
        console.error('RecipeScreen - Error fetching recipe steps:', error);
        setRecipeStepsData([]);
      } finally {
        setIsLoadingSteps(false);
      }
    };

    fetchRecipeSteps();
  }, [recipe?.id]);

  // Lấy ingredients cho recipe hiện tại từ API
  const recipeIngredients = useMemo(() => {
    if (!recipe || recipeIngredientsData.length === 0 || allIngredients.length === 0) {
      return [];
    }

    // Map RecipeIngredientsResponse với Ingredients để tạo ra format tương tự sampleRecipeIngredients
    return recipeIngredientsData.map(recipeIng => {
      const ingredient = allIngredients.find(ing => ing.id === recipeIng.ingredientId);
      
      return {
        id: recipeIng.id,
        ingredient: ingredient || {
          id: recipeIng.ingredientId,
          ingredientName: recipeIng.ingredientName,
          measurementUnit: recipeIng.unit,
          caloriesPerUnit: 0, // Default value
          description: '',
          ingredientImg: ''
        },
        recipe: recipe,
        quantity: recipeIng.quantity
      };
    });
  }, [recipe, recipeIngredientsData, allIngredients]);

  // Chuyển đổi RecipeStepsResponse thành RecipeStep format
  const recipeSteps = useMemo(() => {
    if (!recipe || recipeStepsData.length === 0) return [];
    
    return recipeStepsData.map(stepData => ({
      id: stepData.id,
      step: stepData.step,
      description: stepData.description,
      recipe: recipe,
      waitTime: stepData.waitingTime ? parseInt(stepData.waitingTime) : undefined,
      stepImg: stepData.recipeStepImage
    }));
  }, [recipe, recipeStepsData]);

  // Tính toán nutrition cho 1 khẩu phần
  const nutritionPerServing = useMemo(() => {
    if (recipeIngredients.length === 0) return [];
    
    const baseServingSize = 1; // Thay đổi từ 4 thành 1
    const nutritionData: { name: string; calories: number; amount: number; unit: string }[] = [];
    
    recipeIngredients.forEach(ri => {
      const quantityPerServing = ri.quantity / baseServingSize;
      const caloriesPerServing = quantityPerServing * (ri.ingredient.caloriesPerUnit || 0);
      
      nutritionData.push({
        name: ri.ingredient.ingredientName,
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

  // ✅ NEW: Lấy comments cho recipe hiện tại
  const recipeComments = useMemo(() => {
    if (!recipe) return [];
    return sampleComments.filter(comment => comment.recipe.id === recipe.id);
  }, [recipe]);

  // ✅ NEW: Lấy 2 comments nổi bật (theo số like)
  const featuredComments = useMemo(() => {
    return recipeComments
      .sort((a, b) => parseInt(b.like) - parseInt(a.like))
      .slice(0, 2);
  }, [recipeComments]);


  // Handle serving size change
  const handleServingSizeChange = (newSize: number) => {
    setServingSize(newSize);
  };

  // ✅ Navigate to step-by-step cooking
  const navigateToStepByCooking = () => {
    router.push({
      pathname: "/RecipeStepScreen",
      params: {
        recipeData: JSON.stringify(recipe),
        steps: JSON.stringify(recipeSteps),
      },
    });
  };

  // ✅ NEW: Navigate to all comments
  const navigateToAllComments = () => {
    router.push({
      pathname: "/CommentScreen",
      params: {
        recipeData: JSON.stringify(recipe),
        comments: JSON.stringify(recipeComments),
      },
    });
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
            <TouchableOpacity 
              style={[
                styles.iconButton,
                isLikeLoading && { opacity: 0.5 } // Giảm opacity khi loading
              ]} 
              onPress={() => toggleLike(recipe.id)}
              disabled={isLikeLoading} // Disable khi loading
            >
              <Image 
                source={isLiked ? require("@/assets/images/icons/Like_Active.png") : require("@/assets/images/icons/Like.png")} 
                style={styles.likeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.iconButton,
                isBookmarkLoading && { opacity: 0.5 }
              ]} 
              onPress={() => toggleBookmark(recipe.id)}
              disabled={isBookmarkLoading}
            >
              <Image 
                source={isBookmarked ? require("@/assets/images/icons/Bookmark_Active.png") : require("@/assets/images/icons/Bookmark.png")} 
                style={styles.markIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation, isBookmarked, isLiked, isBookmarkLoading, isLikeLoading, recipe?.id]);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy công thức</Text>
      </View>
    );
  }

  
  // Lấy các bước làm món ăn
  const recipeStepsDisplay = useMemo(() => {
    if (!recipe) return [];
    return sampleRecipeSteps.filter(step => step.recipe.id === recipe.id);
  }, [recipe]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {/* Hình ảnh, tiêu đề, mô tả, thông số */}
        <View style={styles.mainInfoContainer}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          
          <Text style={styles.recipeDescription}>
            {recipe.description || 'Mì quảng nhưng mà người Quảng Ninh nấu, đặc biệt nước súp có vị than Quảng Ninh.'}
          </Text>
          
          {/* <Text style={styles.recipeTags}>
            Xem thêm các món tương tự tại: 
            <Text style={styles.tagLink}> {recipe.category?.name || 'Bún, mì, phở'}</Text> và 
            <Text style={styles.tagLink}> {recipe.subCategory?.name || 'Mì'}</Text>
          </Text> */}
          
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
            <TouchableOpacity 
              style={[
                styles.rightStats,
                isLikeLoading && { opacity: 0.7 } // Visual feedback khi loading
              ]} 
              onPress={() => toggleLike(recipe.id)}
              disabled={isLikeLoading}
            >
              <View style={styles.statItem}>
                <Image 
                  source={isLiked ? require('@/assets/images/icons/Like_Active.png') : require('@/assets/images/icons/Like.png')} 
                  style={isLiked ? styles.liked : styles.icon}
                />
                <Text style={[
                  styles.statText,
                  isLiked && styles.statTextActive
                ]}>
                  {recipe.totalLikes} lượt thích {/* Hiển thị giá trị real-time từ API */}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hình ảnh chính */}
        <Image source={{ uri: recipe.image }} style={styles.heroImage} />

        {/* Nguyên liệu Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nguyên liệu dùng cho công thức</Text>
          
          <ServingAdjuster
            initialValue={1} // Thay đổi từ 4 thành 1
            onValueChange={handleServingSizeChange}
            containerStyle={styles.servingAdjusterContainer}
          />

          <View style={styles.listContainer}>
            {isLoadingIngredients ? (
              <Text style={styles.loadingText}>Đang tải nguyên liệu...</Text>
            ) : recipeIngredients.length > 0 ? (
              recipeIngredients.map((ri, index) => (
                <InfoItem
                  key={index}
                  label={ri.ingredient.ingredientName}
                  value={`${Math.round(ri.quantity * servingSize / 1)} ${ri.ingredient.measurementUnit}`} // Thay đổi từ /4 thành /1
                />
              ))
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu nguyên liệu</Text>
            )}
          </View>
        </View>
        
        {/* Dinh dưỡng Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dinh dưỡng có trong 1 khẩu phần</Text>
          <View style={styles.listContainer}>
            {isLoadingIngredients ? (
              <Text style={styles.loadingText}>Đang tải thông tin dinh dưỡng...</Text>
            ) : nutritionPerServing.length > 0 ? (
              <>
                <InfoItem
                  label="Tổng năng lượng"
                  value={`${Math.round(totalCaloriesPerServing)} kcal`}
                  badgeType="diet"
                />
                
                {nutritionPerServing.map((item, index) => (
                  <InfoItem
                    key={index}
                    label={`${item.name} (${Math.round(item.amount)} ${item.unit})`}
                    value={`${Math.round(item.calories)} kcal`}
                  />
                ))}
              </>
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu dinh dưỡng</Text>
            )}
          </View>
        </View>

        {/* ✅ NEW: Comment Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.commentSectionHeader}>
            <Text style={styles.sectionTitle}>Bình luận nổi bật</Text>
            <Text style={styles.commentCount}>({recipeComments.length} bình luận)</Text>
          </View>
          
          {featuredComments.length > 0 ? (
            <View style={styles.commentsContainer}>
              {featuredComments.map((comment) => (
                <OneCmt 
                  key={comment.id} 
                  comment={comment}
                  showReportButton={true}
                />
              ))}
              
              {/* Button xem tất cả bình luận */}
              <TouchableOpacity 
                style={styles.viewAllCommentsButton}
                onPress={navigateToAllComments}
              >
                <Text style={styles.viewAllCommentsText}>Tất cả bình luận</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF5D00" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>Chưa có bình luận nào</Text>
              <TouchableOpacity 
                style={styles.firstCommentButton}
                onPress={navigateToAllComments}
              >
                <Text style={styles.firstCommentText}>Hãy là người đầu tiên bình luận</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Instructions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hướng dẫn nấu</Text>
          
          <View style={styles.cookingStatContainer}>
            <View style={[styles.statSection, styles.dividerLine]}>
              <Text style={styles.statLabel}>Thời gian nấu:</Text>
              <Text style={styles.statValue}>{recipe.cookingTime}</Text>
            </View>
                        
            <View style={styles.statSection}>
              <Text style={styles.statLabel}>Số bước thực hiện:</Text>
              <Text style={styles.statValue}>
                {isLoadingSteps ? '...' : `${recipeSteps.length} bước`}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.stepByCookingButton}
            onPress={navigateToStepByCooking}
            activeOpacity={0.8}
            disabled={isLoadingSteps || recipeSteps.length === 0}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="play-circle" size={24} color="#FF5D00" />
              <Text style={styles.buttonText}>
                {isLoadingSteps ? 'Đang tải...' : 'Nấu theo từng bước'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#FF5D00" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.instructionsList}>
            {isLoadingSteps ? (
              <Text style={styles.loadingText}>Đang tải hướng dẫn nấu...</Text>
            ) : recipeSteps.length > 0 ? (
              recipeSteps.map((step) => (
                <CookingStep
                  key={step.id}
                  stepNumber={step.step}
                  description={step.description}
                  waitTime={step.waitTime}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>Không lấy được dữ liệu hướng dẫn nấu</Text>
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
  
  // ✅ NEW: Comment Section Styles
  commentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  commentCount: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  commentsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 10,
  },
  viewAllCommentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 5,
    gap: 5,
  },
  viewAllCommentsText: {
    fontSize: 14,
    color: '#FF5D00',
    fontWeight: '600',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  firstCommentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  firstCommentText: {
    fontSize: 14,
    color: '#FF5D00',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  
  // Cooking Stats Container Styles
  cookingStatContainer: {
    backgroundColor: '#ececec',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
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

  // Step-by-step cooking button styles
  stepByCookingButton: {
    backgroundColor: '#FFF1E6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF5D00',
    marginBottom: 25,
    shadowColor: '#FF5D00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5D00',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  
  instructionsList: {
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  loadingText: {
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