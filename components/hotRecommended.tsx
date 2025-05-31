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
            <View style={styles.overlayContent}>
              <Text style={styles.hotTitle}>
                Bánh Mì Ram Ram
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
              <Text style={styles.smallText}>Dễ</Text>
            </View>
            <View style={styles.groupAttributes}>
              <Image 
                source={require('@/assets/images/icons/Frying Pan.png')}
                style={styles.smallIcon} />
              <Text style={styles.smallText}>1h 50m</Text>
            </View>
            <View style={styles.groupAttributes}>
              <Image 
                source={require('@/assets/images/icons/Thumbs Up.png')}
                style={styles.smallIcon} />
              <Text style={styles.smallText}>100</Text>
            </View>
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
      height: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Màu nền mờ
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 10,
      paddingHorizontal: 5,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start', // Thêm thuộc tính này để container chỉ rộng bằng nội dung
      paddingLeft: 10,
    },
    smallIcon: {
      width: 15,
      height: 15,
      marginRight: 2,
      tintColor: 'rgba(255, 255, 255, 0.75)',
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