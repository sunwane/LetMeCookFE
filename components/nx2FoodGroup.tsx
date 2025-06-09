import { FoodItem } from '@/services/types/FoodItem';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import SquareFood from './squareFood';

interface Nx2FoodGroupProps {
  title: string;
  foods: FoodItem[];
}

const { width: screenWidth } = Dimensions.get('window');
const SPACING = 10;

const Nx2FoodGroup: React.FC<Nx2FoodGroupProps> = ({ title, foods }) => {
  const renderItem = ({ item }: { item: FoodItem }) => (
    <SquareFood food={item} />
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
    fontSize: 19, 
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

export default Nx2FoodGroup;