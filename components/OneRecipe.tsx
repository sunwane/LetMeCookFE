import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import { sampleRecipeIngredients } from '@/services/types/RecipeIngredients';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface OneRecipeProps {
  favorite: FavoritesRecipe;
}

const OneRecipe = ({ favorite }: OneRecipeProps) => {
  const [isBookmarked, setIsBookmarked] = useState(true); // Set default to true since it's a favorite
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Lấy danh sách tên nguyên liệu từ sampleRecipeIngredients
  const getIngredientsList = () => {
    const ingredients = sampleRecipeIngredients
      .filter((item) => item.recipe.id === favorite.food.id)
      .map((item) => item.ingredient.name);
    return ingredients.length > 0 ? ingredients.join(', ') : 'Không có nguyên liệu';
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: favorite.food.imageUrl }}
        style={styles.recipeImage}
      />
      <View style={styles.infor}>
        <View>
          <View style={styles.row}>
            <Text 
              style={styles.bigTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {favorite.food.foodName}
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
              <Text style={styles.smallText}>{favorite.food.difficulty}</Text>
            </View>
            <View style={styles.row}>
              <Image 
                source={require('@/assets/images/icons/Clock.png')} 
                style={styles.icon}
              />
              <Text style={styles.smallText}>{favorite.food.cookingTime}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image 
              source={require('@/assets/images/icons/Like_Active.png')} 
              style={styles.icon}
            />
            <Text style={styles.smallText}>{favorite.food.likes}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default OneRecipe

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 8,
        flexGrow: 1,
    },
    infor:{
        flex: 1,
        flexGrow: 1,
        justifyContent: 'space-between',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7A2917'
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