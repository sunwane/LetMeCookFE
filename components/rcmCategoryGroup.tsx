import { SubCategoryItem } from '@/services/types/SubCategoryItem';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import OneSubCategory from './oneSubCategory';

const { width: screenWidth } = Dimensions.get('window');

interface RcmCategoryGroupProps {
  subCategories: SubCategoryItem[];
  isLoading?: boolean;
}

const RcmCategoryGroup: React.FC<RcmCategoryGroupProps> = ({ subCategories, isLoading = false }) => {
  // Handle khi ấn vào subCategory từ HomeScreen
  const handleSubCategoryPress = (item: SubCategoryItem) => {
    router.push({
      pathname: '/SearchResults',
      params: { 
        selectedTags: JSON.stringify([item.subCategoryName]),
        query: ''
      }
    });
  };

  // ✅ UPDATED: Sử dụng tất cả 6 items từ getTop6subcategories thay vì slice(0, 8)
  const recommendedSubCategories = subCategories; // Không cần slice vì API đã trả về đúng 6 items

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 120 }]}>
        <ActivityIndicator size="large" color="#FF5D00" />
        <Text style={styles.loadingText}>Đang tải danh mục phổ biến...</Text>
      </View>
    );
  }

  if (recommendedSubCategories.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 120 }]}>
        <Text style={styles.noDataText}>Không có dữ liệu danh mục</Text>
      </View>
    );
  }

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
              onPress={handleSubCategoryPress}
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
    width: 80,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
});

export default RcmCategoryGroup;