import { RecipeItem } from '@/services/types/RecipeItem';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import SquareRecipe from './OneSquareRecipe';

interface N2xRecipeGroupProps {
  title: string;
  foods: RecipeItem[];
}

const { width: screenWidth } = Dimensions.get('window');
const SPACING = 10;

const N2xRecipeGroup: React.FC<N2xRecipeGroupProps> = ({ title, foods }) => {
  const renderItem = ({ item }: { item: RecipeItem }) => (
    <SquareRecipe food={item} />
  );

  return (
    <View style={styles.main}>
      <Text style={styles.bigTitle}>{title}</Text>
      <FlatList
        data={foods}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 5,
  },
  bigTitle: {
    fontSize: 17.5, 
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#74341C',
    textTransform: 'uppercase',
  },
  grid: {

  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING,
  },
});

export default N2xRecipeGroup;