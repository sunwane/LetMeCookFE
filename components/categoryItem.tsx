import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../services/types/Category';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

const CategoryItem = ({ category, isSelected, onSelect }: CategoryItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        isSelected && styles.selectedCategory,
      ]}
      onPress={() => onSelect(category.id)}
    >
      <View style={styles.contentContainer}>
        {category.categoryImg && (
          <Image
            source={{ uri: category.categoryImg }}
            style={[
              styles.icon,
              isSelected && styles.selectedIcon,
            ]}
          />
        )}
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
        >
          {category.categoryName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  contentContainer: {
    alignItems: 'center',
  },
  icon: {
    // tintColor: '#333',
    marginBottom: 3,
    width: 20,
    height: 20,
  },
  selectedIcon: {
    // tintColor: '#fff',
  },
  selectedCategory: {
    backgroundColor: '#FF5D00',
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});


export default CategoryItem;