import { FoodItem } from '@/services/types/FoodItem';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const {width: ScreenWidth} = Dimensions.get('window');

interface SquareFoodProps {
  food: FoodItem;
}

const SquareFood: React.FC<SquareFoodProps> = ({ food }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <View style={styles.main}>
      <Image 
        source={{ uri: food.imageUrl }} 
        style={styles.foodImage} 
      />
      <View style={styles.horizontalContainer}>
        <Text 
          style={styles.foodTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {food.foodName}
        </Text>
        <TouchableOpacity onPress={toggleBookmark}>
            <Image 
              source={
                isBookmarked 
                  ? require('@/assets/images/icons/Bookmark_Active.png')
                  : require('@/assets/images/icons/Bookmark.png')
              } 
              style={[
                styles.mark]} 
            />
        </TouchableOpacity>
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
            <Text style={styles.smallText}>{food.likes}</Text>
        </View>
      </View>
    </View>
  );
}

export default SquareFood

const styles = StyleSheet.create({
    main: {
        width: ScreenWidth / 2 - 24,
        marginBottom: 5,
    },
    foodTitle: {
        fontSize: 17.5,
        fontWeight: 'bold',
        color: '#74341C',
        marginBottom: 5,
    },
    mark: {
        height: 22,
        width: 15,
        tintColor: 'rgb(116,52,28)',
    },
    foodImage:{
        width: ScreenWidth / 2 - 24,
        height: ScreenWidth / 3.5,
        borderRadius: 10,
        marginBottom: 3,
        resizeMode: 'cover',
    },
    icon: {
        width: 12,
        height: 12,
        tintColor: 'rgba(0,0,0,0.7)',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextTo: {
        marginRight: 5,
    },
    smallText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        fontWeight: '500',
        marginLeft: 1,
    },
})