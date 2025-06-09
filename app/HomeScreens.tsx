import HotRecommended from "@/components/hotRecommended";
import Nx2FoodGroup from "@/components/nx2FoodGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { FoodItem } from "@/services/types/FoodItem";
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreens() {
  return (
    <View style={styles.background}>
      <SearchBar />
      <ScrollView 
        style={styles.maincontainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HotRecommended foods={foodData} />
        <RcmCategoryGroup />
        <Nx2FoodGroup 
          title="Món ăn nổi bật"
          foods={foodData}
        />
        <Nx2FoodGroup 
          title="Món ngọt hấp dẫn"
          foods={foodData}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    background: {
        flex: 1, // Thay đổi height: screenHeight thành flex: 1
        backgroundColor: '#f9f9f9',},
    maincontainer: {
        flex: 1,
        marginHorizontal: 2,
    },
    scrollContent: {
        gap: 25,
        paddingHorizontal: 10,
    }
});

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
  {
    id: '1',
    foodName: 'Mì Ý công thức Jollibee',
    imageUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_2_638318510704271571_ca-ch-la-m-mi-y-00.jpg',
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