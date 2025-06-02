import { SubCategoryItem } from '@/services/types/SubCategoryItem';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

interface SubCategory {
  SubCategories: SubCategoryItem[];
}

const RcmCategory: React.FC<SubCategory> = ({ SubCategories }) => {
  return (
    <View>
      <FlatList
        data={SubCategories}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.imagestyle}
            />
            <Text style={styles.textstyle}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export default RcmCategory

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