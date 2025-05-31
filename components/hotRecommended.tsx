import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

const HotRecommended = () => {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.imageContainer}>
          <Image 
            style={styles.image}
            source={require('@/assets/images/food/BanhMi.png')}
          />
          <View style={styles.overlayTop}>
            <Text>Bánh Mì Ram Ram</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
    },
    imageContainer: {
      width: '100%', // Chiếm toàn bộ chiều rộng của parent
      height: 180, 
      position: 'relative', // Để có thể đặt overlay
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      resizeMode: 'cover',
    },
    overlayTop:{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    overlayBottom:{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
      justifyContent: 'center',
      alignItems: 'center',
    }
})

export default HotRecommended