import { SubCategoryItem } from '@/services/types/SubCategoryItem';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface SubCategory {
  item: SubCategoryItem;
}

const OneSubCategory: React.FC<SubCategory> = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.imagestyle}
      />
      <Text style={styles.textstyle}>
        {item.name}
      </Text>
    </View>
  );
}

export default OneSubCategory

const styles = StyleSheet.create({
  imagestyle: {
    borderRadius: '50%',
    width: 75,
    height: 75,
  },
  textstyle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 3,
    width: 75,
    textAlign: 'center',
    color: '#74341C',
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
})