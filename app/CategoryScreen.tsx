import OneSubCategory from '@/components/oneSubCategory'
import { sampleSubCategories } from '@/services/types/SubCategoryItem'
import { useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import CategoryNav from '../navigation/CategoryNav'
import { sampleCategories } from '../services/types/Category'

const {width : ScreenWidth, height: ScreenHeight} = Dimensions.get('window')

const CategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  // Lọc subcategories theo category được chọn
  const filteredSubCategories = sampleSubCategories.filter(
    item => item.category?.id === selectedCategory
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContain}>
        <Text style={styles.headerTitle}>DANH MỤC CÁC MÓN</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.leftNav}>
          <CategoryNav
            categories={sampleCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </View>
        <View style={styles.right}>
          <FlatList
            data={filteredSubCategories} // Thay đổi từ sampleSubCategories sang filteredSubCategories
            numColumns={3}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
              <View style={[
                styles.itemContainer,
              ]}>
                <OneSubCategory item={item} />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default CategoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContain: {
    backgroundColor: '#fff',
    paddingTop: 70,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cecece'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#7A2917',
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  leftNav: {
    width: ScreenWidth / 4.3,
  },
  right: {
    flex: 1,
    backgroundColor: "#fffaf5",
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  contentContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '32%', // Thêm maxWidth thay vì width cố định
    maxHeight: 115,
    minHeight: 110,
  },
})
