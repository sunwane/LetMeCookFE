import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import { sampleRecipeIngredients } from '@/services/types/RecipeIngredients';
import { RecipeItem } from '@/services/types/RecipeItem';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const {width: screenWidth } = Dimensions.get('screen');

interface OneRecipeProps {
  item: RecipeItem | FavoritesRecipe;
  isFavorite?: boolean;
}

const OneRecipe = ({ item, isFavorite = false }: OneRecipeProps) => {
  const [isBookmarked, setIsBookmarked] = useState(isFavorite);
  
  const toggleBookmark = (e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark
    setIsBookmarked(!isBookmarked);
  };

  // Helper function để lấy RecipeItem từ input
  const getRecipeData = (): RecipeItem => {
    if ('food' in item) {
      return item.food;
    }
    return item;
  };

  const recipe = getRecipeData();

  // Hàm navigate đến RecipeScreen
  const handleRecipePress = () => {
    router.push({
      pathname: '/RecipeScreen',
      params: {
        recipeData: JSON.stringify(recipe)
      }
    });
  };

  // Lấy danh sách tên nguyên liệu từ sampleRecipeIngredients
  const getIngredientsList = () => {
    const ingredients = sampleRecipeIngredients
      .filter((ing) => ing.recipe.id === recipe.id)
      .map((ing) => ing.ingredient.name);
    return ingredients.length > 0 ? ingredients.join(', ') : 'Không có nguyên liệu';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleRecipePress} activeOpacity={0.8}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.recipeImage}
      />
      <View style={styles.infor}>
        <View>
          <View style={[styles.row, styles.titlePlace]}>
            <Text 
              style={styles.bigTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {recipe.foodName}
            </Text>
            <TouchableOpacity onPress={toggleBookmark}>
              <Image
                source={
                  isBookmarked 
                    ? require('@/assets/images/icons/Bookmark_Active.png')
                    : require('@/assets/images/icons/Bookmark.png')
                }
                style={styles.mark}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.desView}>
            <Text 
              style={styles.des}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              <Text style={styles.bold}>Nguyên liệu: </Text>
              {getIngredientsList()}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.row}>
            <View style={[styles.row, styles.nextTo]}>
              <Image 
                source={require('@/assets/images/icons/stars.png')} 
                style={styles.icon}
              />
              <Text style={styles.smallText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.row}>
              <Image 
                source={require('@/assets/images/icons/Clock.png')} 
                style={styles.icon}
              />
              <Text style={styles.smallText}>{recipe.cookingTime}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image 
              source={require('@/assets/images/icons/Like_Active.png')} 
              style={styles.icon}
            />
            <Text style={styles.smallText}>{recipe.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OneRecipe;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 8, // Giảm từ 5 xuống để có thêm padding
        flexDirection: 'row',
        gap: 10, // Tăng gap để có khoảng cách đẹp hơn
        flexGrow: 1,
    },
    infor:{
        flex: 1,
        flexGrow: 1,
        justifyContent: 'space-between',
        minWidth: 0, // Đảm bảo flex hoạt động đúng
    },
    titlePlace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1, // Sử dụng flex thay vì maxWidth cố định
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextTo: {
        marginRight: 8, // Tăng margin để dễ nhìn hơn
    },
    recipeImage: {
        width: 120, // Giảm từ 140 xuống 120
        height: 80,  // Giảm từ 90 xuống 80
        borderRadius: 10,
        flexShrink: 0, // Đảm bảo image không bị co lại
    },
    mark: {
        width: 14,
        height: 20,
        tintColor: '#7A2917',
        flexShrink: 0, // Đảm bảo icon không bị co lại
    },
    bigTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#7A2917',
        flex: 1, // Sử dụng flex thay vì width cố định
        marginRight: 8, // Margin với bookmark icon
    },
    desView: {
        marginTop: 3,
        flex: 1, // Cho phép mở rộng
    },
    des: {
        fontSize: 11.5,
        color: 'rgba(0,0,0,0.7)',
        textAlign: 'justify',
        flexShrink: 1, // Cho phép text co lại nếu cần
    },
    bold:{
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: '500',
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 2, // Tăng từ 1 lên 2
        tintColor: 'rgba(0,0,0,0.7)',
    },
})