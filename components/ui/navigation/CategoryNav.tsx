import React from 'react';
import { ScrollView } from 'react-native';
import { Category } from '../../../services/types/Category';
import CategoryItem from '../../categoryItem';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: number;
  onSelectCategory: (categoryId: number) => void;
}

const CategoryNav = ({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) => {
  return (
    <ScrollView>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onSelect={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
};

export default CategoryNav;