import OneRecipe from '@/components/OneRecipe';
import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface FavoritesTabProps {
  favorites: FavoritesRecipe[];
  currentUserId?: number; // Thêm prop để biết user hiện tại
}

const FavoritesTab = ({ favorites, currentUserId }: FavoritesTabProps) => {
  // Lọc favorites theo currentUserId
  const userFavorites = currentUserId 
    ? favorites.filter(favorite => favorite.account.id === currentUserId)
    : favorites;


  if (userFavorites.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Chưa có công thức yêu thích nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userFavorites}
        keyExtractor={(item, index) => `${item.account.id}-${item.food.id}-${index}`}
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
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})

export default FavoritesTab