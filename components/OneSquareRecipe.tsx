import { RecipeItem } from '@/services/types/RecipeItem';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const {width: ScreenWidth} = Dimensions.get('window');

interface SquareRecipeProps {
  food: RecipeItem;
}

const SquareRecipe: React.FC<SquareRecipeProps> = ({ food }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Hàm navigate đến RecipeScreen
  const handleRecipePress = () => {
    router.push({
      pathname: '/RecipeScreen',
      params: {
        recipeData: JSON.stringify(food)
      }
    });
  };

  return (
    <TouchableOpacity style={styles.main} onPress={handleRecipePress} activeOpacity={0.8}>
      <Image 
        source={{ uri: food.image }} 
        style={styles.foodImage} 
        resizeMode='cover'
      />
      <View style={[styles.horizontalContainer, styles.titlePlace]}>
        <Text 
          style={styles.foodTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {food.title}
        </Text>
      </View>
      <View style={styles.horizontalContainer}>
        <View style={styles.horizontalContainer}>
            <View style={[styles.horizontalContainer, styles.nextTo]}>
                <Image 
                source={require('@/assets/images/icons/stars.png')} 
                style={styles.icon} />
                <Text style={styles.smallText}>{food.difficulty}</Text>
            </View>
            <View style={styles.horizontalContainer}>
                <Image 
                source={require('@/assets/images/icons/Clock.png')} 
                style={styles.icon} />
                <Text style={styles.smallText}>{food.cookingTime}</Text>
            </View>
        </View>
        <View style={styles.horizontalContainer}>
            <Image 
              source={require('@/assets/images/icons/Like_Active.png')} 
              style={styles.icon} />
            <Text style={styles.smallText}>{food.totalLikes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SquareRecipe

const styles = StyleSheet.create({
    main: {
        width: ScreenWidth / 2 - 24,
        marginBottom: 5,
    },
    foodTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#74341C',
        marginBottom: 3,
        maxWidth: ScreenWidth / 2 - 0, // Adjusted to fit the image and bookmark icon -44
    },
    titlePlace: {
      maxWidth: '100%',
      alignItems: 'center',
    },
    mark: {
        height: 22,
        width: 15,
        marginTop: -2,

        tintColor: 'rgb(116,52,28)',
    },
    foodImage:{
        width: ScreenWidth / 2 - 24,
        height: ScreenWidth / 3.5,
        borderRadius: 10,
        marginBottom: 3,
    },
    icon: {
        width: 10,
        height: 10,
        tintColor: 'rgba(0,0,0,0.7)',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextTo: {
        marginRight: 4,
    },
    smallText: {
        fontSize: 11.5,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: '500',
        marginLeft: 1,
    },
})