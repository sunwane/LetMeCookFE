import OneRecipe from '@/components/OneRecipe';
import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface FavoritesTabProps {
  favorites: FavoritesRecipe[];
}

const FavoritesTab = ({ favorites }: FavoritesTabProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <OneRecipe item={item} isFavorite={true} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  listContent: {
    padding: 10,
  }
})

export default FavoritesTab