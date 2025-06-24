import OneRecipe from '@/components/OneRecipe';
import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import { getFavouriteRecipeByAccount, RecipeItem } from '@/services/types/RecipeItem';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface FavoritesTabProps {
  favorites: FavoritesRecipe[];
  currentUserId?: number;
}

const FavoritesTab = ({ favorites, currentUserId }: FavoritesTabProps) => {
  // ✅ NEW: State để quản lý favorites từ API
  const [apiFavorites, setApiFavorites] = useState<RecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ NEW: Fetch favorites từ API
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getFavouriteRecipeByAccount();
        console.log('FavoritesTab - API response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setApiFavorites(response.result);
        } else {
          console.log('No favorites found or invalid response format');
          setApiFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Không thể tải danh sách yêu thích');
        setApiFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ✅ UPDATED: Sử dụng API data thay vì props
  const displayFavorites = apiFavorites;

  // ✅ Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#FF5D00" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Vui lòng thử lại sau</Text>
      </View>
    );
  }

  // ✅ Empty state
  if (displayFavorites.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyText}>Chưa có công thức yêu thích nào</Text>
        <Text style={styles.emptySubText}>
          Hãy thả tim những công thức bạn yêu thích nhé!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayFavorites}
        keyExtractor={(item, index) => `favorite-${item.id}-${index}`}
        renderItem={({ item }) => (
          <OneRecipe 
            item={item} 
            isFavorite={true} 
          />
        )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => {
          // ✅ Pull to refresh functionality
          const fetchFavorites = async () => {
            setIsLoading(true);
            try {
              const response = await getFavouriteRecipeByAccount();
              if (response?.result && Array.isArray(response.result)) {
                setApiFavorites(response.result);
              }
            } catch (error) {
              console.error('Error refreshing favorites:', error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchFavorites();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  listContent: {
    padding: 10,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  
  // ✅ Loading styles
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  
  // ✅ Error styles
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  
  // ✅ Empty state styles
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default FavoritesTab;