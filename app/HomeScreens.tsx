import HotRecommended from "@/components/hotRecommended";
import Nx2FoodGroup from "@/components/nx2FoodGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { FoodItem } from "@/services/types/FoodItem";
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

//file riêng
const foodData: FoodItem[] = [
    {
      id: '1',
      foodName: 'Bánh Mì Ram Ram',
      imageUrl: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
      difficulty: 'Dễ',
      cookingTime: '1h50m',
      likes: 100
    },
    {
      id: '2',
      foodName: 'Phở Bò',
      imageUrl: 'https://bizweb.dktcdn.net/100/479/802/files/ham-luong-calo-trong-pho-bo-1024x712-jpeg.jpg?v=1722918596207',
      difficulty: 'Trung bình',
      cookingTime: '2h30m',
      likes: 150
    },
    // Thêm các món khác...
  ];

export default function HomeScreens() {
  return (
    <View style={styles.background}>
      <View style={styles.body}>
          <SearchBar />
          <ScrollView 
            style={styles.maincontainer}
            contentContainerStyle={{ gap: 25 }}
          >
              <HotRecommended foods={foodData} />
              <RcmCategoryGroup />
              <Nx2FoodGroup />
          </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#fff',
        height: screenHeight,
    },
    body: {
        marginHorizontal: 10,
    },
    maincontainer: {
        flex: 1,
        marginTop: 25,
        marginHorizontal: 10,
    },
});