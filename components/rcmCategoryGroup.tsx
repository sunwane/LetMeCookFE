import { sampleSubCategories } from '@/services/types/SubCategoryItem';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import OneSubCategory from './oneSubCategory';

const { width: screenWidth } = Dimensions.get('window');

const RcmCategoryGroup = () => {
  // Handle khi ấn vào subCategory từ HomeScreen
  const handleSubCategoryPress = (item: any) => {
    router.push({
      pathname: '/SearchResults',
      params: { 
        selectedTags: JSON.stringify([item.name]),
        query: '' // Không có query search
      }
    });
  };

  // Lấy một số SubCategory phổ biến để hiển thị trên HomeScreen
  const recommendedSubCategories = sampleSubCategories.slice(0, 8); // Lấy 8 item đầu

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục phổ biến</Text>
      <FlatList
        data={recommendedSubCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <OneSubCategory 
              item={item} 
              onPress={handleSubCategoryPress} // Truyền handler giống CategoryScreen
            />
          </View>
        )}
      />
    </View>
  );
};

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A2917',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  itemWrapper: {
    marginHorizontal: 5,
    width: 80, // Đặt width cố định cho mỗi item
  },
});

export default RcmCategoryGroup;