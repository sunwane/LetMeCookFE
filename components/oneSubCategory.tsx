import { SubCategoryItem } from '@/services/types/SubCategoryItem';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SubCategory {
  item: SubCategoryItem;
  onPress?: (item: SubCategoryItem) => void; // Thêm prop onPress tùy chọn
}

const OneSubCategory: React.FC<SubCategory> = ({ item, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      // Navigate đến SearchResults với subCategory được chọn
      router.push({
        pathname: '/SearchResults',
        params: { 
          selectedTags: JSON.stringify([item.subCategoryName]), // Truyền subCategory name làm selectedTag
          query: '' // Không có query search
        }
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.subCategoryImg }} // SỬA Ở ĐÂY
        style={styles.imagestyle}
        onError={(e) => console.log('Image Error:', e.nativeEvent.error)}
      />
      <Text style={styles.textstyle}>
        {item.subCategoryName} {/* SỬA Ở ĐÂY */}
      </Text>
    </TouchableOpacity>
  );
}

export default OneSubCategory

const styles = StyleSheet.create({
  imagestyle: {
    borderRadius: 40,
    width: 65,
    height: 65,
  },
  textstyle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    width: 70,
    textAlign: 'center',
    color: '#74341C',
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
    // Thêm style cho interactive element
    borderRadius: 10,
    padding: 5,
  },
})