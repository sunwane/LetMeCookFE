import { RecipeItem } from '@/services/types/RecipeItem';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const SPACING = 10;
const CARD_WIDTH = screenWidth * 0.80; // 80% chiều rộng màn hình

interface HotRecommendedProps {
  foods: RecipeItem[];
}

const HotRecommended: React.FC<HotRecommendedProps> = ({ 
  foods,
}) => {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
        decelerationRate={0.99}
        pagingEnabled
        contentContainerStyle={[
          styles.scrollViewContent
        ]}
      >
        {foods.map((food) => (
          <View 
            key={food.id} 
            style={[
              styles.imageContainer,
              { marginHorizontal: SPACING / 2 }
            ]}
          >
            <Image 
              style={styles.image} resizeMode='cover'
              source={{uri: food.imageUrl}}
            />
            <View style={styles.overlayTop}>
              <View style={styles.overlayContent}>
                <Text 
                  style={styles.hotTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {food.foodName}
                </Text>
                <View style={styles.hotContainer}>
                  <Text style={styles.hotText}>HOT</Text>
                  <Image 
                    source={require('@/assets/images/icons/Fire.png')}
                    style={styles.fireIcon} 
                  />
                </View>
              </View>
            </View>
            <View style={styles.overlayBottom}>
              <View style={styles.groupAttributes}>
                <Image 
                  source={require('@/assets/images/icons/stars.png')}
                  style={styles.smallIcon} />
                <Text style={styles.smallText}>{food.difficulty}</Text>
              </View>
              <View style={styles.groupAttributes}>
                <Image 
                  source={require('@/assets/images/icons/Clock.png')}
                  style={styles.smallIcon} />
                <Text style={styles.smallText}>{food.cookingTime}</Text>
              </View>
              <View style={styles.groupAttributes}>
                <Image 
                  source={require('@/assets/images/icons/Like_Active.png')}
                  style={styles.smallIcon} />
                <Text style={styles.smallText}>{food.likes}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
    },
    imageContainer: {
      height: 180,
      position: 'relative',
      width: CARD_WIDTH,
      // width được set động qua style inline
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    overlayTop:{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    overlayContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
    },
    hotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EB3223',
      paddingHorizontal: 11,
      paddingBottom: 5,
      borderRadius: 10,
      paddingTop: 2,
    },
    hotText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    fireIcon: {
      width: 15, 
      height: 15, 
      marginRight: -4,
    },
    hotTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 4,
    },
    overlayBottom: {
      position: 'absolute',
      bottom: 10,
      left: 10, // Thay đổi từ 0 thành giá trị cụ thể
      // Bỏ right: 0 để không stretch full width
      height: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 10,
      paddingHorizontal: 5,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start', // Thêm thuộc tính này để container chỉ rộng bằng nội dung
      paddingLeft: 10,
    },
    smallIcon: {
      width: 12,
      height: 12,
      marginRight: 2,
      tintColor: 'rgba(255, 255, 255, 0.75)',
      marginTop: 1, // Căn chỉnh với text
    },
    groupAttributes: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10, // Tăng khoảng cách giữa các nhóm
    },
    smallText: {
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: 13,
      fontWeight: '500',
    }
})

export default HotRecommended