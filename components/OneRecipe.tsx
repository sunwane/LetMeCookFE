import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import { sampleRecipeIngredients } from '@/services/types/RecipeIngredients';
import { RecipeItem } from '@/services/types/RecipeItem';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const {width: screenWidth } = Dimensions.get('window');

interface OneRecipeProps {
  item: RecipeItem | FavoritesRecipe;
  isFavorite?: boolean;
}

const OneRecipe = ({ item, isFavorite = false }: OneRecipeProps) => {
  const [isBookmarked, setIsBookmarked] = useState(isFavorite);
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Helper function để lấy RecipeItem từ input
  const getRecipeData = (): RecipeItem => {
    if ('food' in item) {
      // Nếu là FavoritesRecipe
      return item.food;
    }
    // Nếu là RecipeItem
    return item;
  };

  const recipe = getRecipeData();

  // Lấy danh sách tên nguyên liệu từ sampleRecipeIngredients
  const getIngredientsList = () => {
    const ingredients = sampleRecipeIngredients
      .filter((ing) => ing.recipe.id === recipe.id)
      .map((ing) => ing.ingredient.name);
    return ingredients.length > 0 ? ingredients.join(', ') : 'Không có nguyên liệu';
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default OneRecipe;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        paddingHorizontal: 5,
        flexDirection: 'row',
        gap: 8,
        flexGrow: 1,
        width: screenWidth - 15,
    },
    infor:{
        flex: 1,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    titlePlace: {
        maxWidth: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextTo: {
        marginRight: 7,
    },
    recipeImage: {
        width: 140,
        height: 100,
        borderRadius: 10,
    },
    mark: {
        width: 18,
        height: 24,
        tintColor: '#7A2917'
    },
    bigTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7A2917',
        maxWidth: screenWidth - 198, // Adjusted to fit the image and bookmark icon
        marginRight: 5,
    },
    desView: {
        marginTop: 5,
    },
    des: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
        textAlign: 'justify',
    },
    bold:{
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: '500',
        marginLeft: 1,
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 1,
        tintColor: 'rgba(0,0,0,0.7)',
    },
})