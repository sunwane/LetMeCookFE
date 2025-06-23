import OneSubCategory from '@/components/oneSubCategory'
import { SubCategoryItem, getAllSubCategories } from '@/services/types/SubCategoryItem'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import CategoryNav from '../components/ui/navigation/CategoryNav'
import { Category, getAllCategories } from '../services/types/Category'

const {width : ScreenWidth, height: ScreenHeight} = Dimensions.get('window')

const CategoryScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        console.log('CategoryScreen: Nhận được categories:', response);
        const categoriesData = response.result;
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories(categoriesData);
          setSelectedCategory(categoriesData[0].id);// Set category đầu tiên làm mặc định
        }
      } catch (error) {
        console.error(' CategoryScreen: Lỗi khi fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSubCategoryPress = (item: SubCategoryItem) => {
    router.push({
      pathname: '/SearchResults',
      params: { 
        selectedTags: JSON.stringify([item.subCategoryName]),
        query: ''
      }
    });
  };

  // Lọc subcategories theo category được chọn
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setSubCategoriesLoading(true);
        const response = await getAllSubCategories();
        console.log('CategoryScreen: Nhận được subcategories:', response);
        const subCategoriesData = response.result;
        if (Array.isArray(subCategoriesData) && subCategoriesData.length > 0) {
          setSubCategories(subCategoriesData);
        }
      } catch (error) {
        console.error('CategoryScreen: Lỗi khi fetch subcategories:', error);
      } finally {
        setSubCategoriesLoading(false);
      }
    }
    fetchSubCategories();
  },[])

  const filteredSubCategories = subCategories.filter(
    item => item.categoryId === selectedCategory
  );

  console.log('Filtered subcategories:', filteredSubCategories);
  console.log('Selected category:', selectedCategory);

  // Hiển thị loading chỉ khi đang fetch categories (lần đầu)
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7A2917" />
        <Text style={{ marginTop: 10, color: '#7A2917' }}>Đang tải danh mục...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContain}>
        <Text style={styles.headerTitle}>DANH MỤC CÁC MÓN</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.leftNav}>
          <CategoryNav
            categories={categories} // Sử dụng dữ liệu từ API thay vì sampleCategories
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </View>
        <View style={styles.right}>
          <FlatList
            data={filteredSubCategories}
            numColumns={3}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
              <View style={[
                styles.itemContainer,
              ]}>
                <OneSubCategory 
                  item={item} 
                  onPress={handleSubCategoryPress}
                />
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
    paddingBottom: 15,
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
    maxWidth: '33.3%', // Thêm maxWidth thay vì width cố định
    maxHeight: 115,
    minHeight: 110,
  },
})