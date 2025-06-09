import { SubCategoryItem } from '@/services/types/SubCategoryItem';
import { FlatList, StyleSheet, View } from 'react-native';
import OneSubCategory from './oneSubCategory';

//file riêng
const SubCategoriesData: SubCategoryItem[] = [
  {
    id: '1',
    name: 'Bánh Mì',
    imageUrl: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    description: '111'
  },
  {
    id: '2',
    name: 'Phở',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxsNsnAt3VYWE4z5Eyej4-mc6Gn2JuFwIOQQ&s',
    description: '111'
  },
  {
    id: '3',
    name: 'Matcha',
    imageUrl: 'https://images.prismic.io/nutriinfo/aBHRb_IqRLdaBvL5_hinh-anh-matcha-latte.jpg?auto=format,compress',
    description: '111'
  },
  {
    id: '4',
    name: 'Cơm',
    imageUrl: 'https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/052023/1.com-tam-viet-nam-hap-dan-du-khach-khi-den-da-lat-2_20230529114050.jpg',
    description: '111'
  },
  {
    id: '5',
    name: 'Bánh Ngọt',
    imageUrl: 'https://friendshipcakes.com/wp-content/uploads/2022/03/2-4-1.jpg',
    description: '111'
  },
  {
    id: '6',
    name: 'Các món thịt Bò',
    imageUrl: 'https://nguyenhafood.vn/uploads/files/bo-bit-tet-va-khoai-tay-chien%20%282%29-1.png',
    description: '111'
  },
  {
    id: '7',
    name: 'Các món Gà Rán',
    imageUrl: 'https://cokhiviendong.com/wp-content/uploads/2019/01/kinnh-nghi%E1%BB%87m-m%E1%BB%9F-qu%C3%A1n-g%C3%A0-r%C3%A1n-7.jpg',
    description: '111'
  },
  {
    id: '8',
    name: 'Tokkbokki',
    imageUrl: 'https://daesang.vn/upload/photos/shares/a1.jpg',
    description: '111'
  },
  // Thêm các món khác...
];

const RcmCategoryGroup = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={SubCategoriesData}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <OneSubCategory item={item} />
        )}
      />
    </View>
  )
}

export default RcmCategoryGroup

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
})