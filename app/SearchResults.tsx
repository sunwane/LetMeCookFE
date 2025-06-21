import FilterDialog from '@/components/FilterDialog';
import OneRecipe from '@/components/OneRecipe';
import SearchBar from '@/components/searchbar';
import SelectedTags from '@/components/SelectedTags';
import '@/config/globalTextConfig';
import { getRecipesBySubCategory, RecipeItem } from '@/services/types/RecipeItem';
import { getAllSubCategories, SubCategoryItem } from '@/services/types/SubCategoryItem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SearchResults = () => {
  const { query, selectedTags: initialSelectedTagsParam } = useLocalSearchParams();
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // State cho dữ liệu từ API
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Initialize selectedTags từ params khi component mount
  useEffect(() => {
    if (initialSelectedTagsParam) {
      try {
        const parsedTags = JSON.parse(initialSelectedTagsParam as string);
        setSelectedTags(parsedTags);
      } catch (error) {
        console.log('Error parsing selectedTags:', error);
        setSelectedTags([]);
      }
    }
  }, [initialSelectedTagsParam]);

  // Fetch subcategories để map tag names với IDs
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await getAllSubCategories();
        if (response?.result) {
          setSubCategories(response.result);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, []);

  // Fetch recipes khi selectedTags thay đổi
  useEffect(() => {
    if (selectedTags.length > 0 && subCategories.length > 0) {
      fetchRecipesByTags();
    } else {
      setRecipes([]);
    }
  }, [selectedTags, subCategories]);

  // Hàm fetch recipes dựa trên selected tags
  const fetchRecipesByTags = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(0);
    
    try {
      // Tìm subcategories có tên trong selectedTags
      const matchingSubCategories = subCategories.filter(sub => 
        selectedTags.includes(sub.subCategoryName)
      );

      if (matchingSubCategories.length === 0) {
        setRecipes([]);
        setHasMorePages(false);
        return;
      }

      // Fetch recipes từ tất cả subcategories được chọn
      const allRecipes: RecipeItem[] = [];
      
      for (const subCategory of matchingSubCategories) {
        try {
          const response = await getRecipesBySubCategory(subCategory.id, 0, 5);
          if (response?.result?.content) {
            allRecipes.push(...response.result.content);
          }
        } catch (error) {
          console.error(`Error fetching recipes for subcategory ${subCategory.id}:`, error);
        }
      }

      // Filter theo query nếu có
      let filteredRecipes = allRecipes;
      if (query && typeof query === 'string' && query.trim()) {
        filteredRecipes = allRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      setRecipes(filteredRecipes);
      setHasMorePages(false); // Không hỗ trợ pagination cho multi-subcategory search
      
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Không thể tải dữ liệu công thức. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm load more recipes (cho single subcategory)
  const loadMoreRecipes = async () => {
    if (isLoading || !hasMorePages || selectedTags.length !== 1) return;

    // Chỉ load more khi có đúng 1 tag được chọn
    const matchingSubCategory = subCategories.find(sub => 
      selectedTags.includes(sub.subCategoryName)
    );

    if (!matchingSubCategory) return;

    setIsLoading(true);
    
    try {
      const response = await getRecipesBySubCategory(
        matchingSubCategory.id, 
        currentPage + 1, 
        20
      );
      
      if (response?.result?.content) {
        let newRecipes = response.result.content;
        
        // Filter theo query nếu có
        if (query && typeof query === 'string' && query.trim()) {
          newRecipes = newRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        setRecipes(prev => [...prev, ...newRecipes]);
        setCurrentPage(prev => prev + 1);
        setHasMorePages(!response.result.last);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi apply filter
  const handleApplyFilter = (tags: string[]) => {
    setSelectedTags(tags);
    setShowFilter(false);
  };

  // Hàm xóa tag
  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Hàm xóa tất cả tags
  const clearAllTags = () => {
    setSelectedTags([]);
    setRecipes([]);
  };

  // Cập nhật header với SearchBar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View style={[
              styles.headerContainer,
              isKeyboardVisible && {
                paddingTop: Math.max(10, 50 - keyboardHeight * 0.05),
              }
            ]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FF5D00" />
              </TouchableOpacity>
              <View style={styles.searchBarWrapper}>
                <SearchBar 
                  defaultValue={(query as string) || ''} 
                  containerStyle={[
                    styles.searchBarInHeader,
                    isKeyboardVisible && styles.searchBarFocused
                  ]}
                  searchMode="FindRecipe"
                  onSearch={(newQuery) => {
                    router.push({
                      pathname: '/SearchResults',
                      params: { 
                        query: newQuery,
                        selectedTags: JSON.stringify(selectedTags)
                      },
                    });
                  }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      ),
    });
  }, [navigation, query, selectedTags, isKeyboardVisible, keyboardHeight]);

  const renderRecipeItem = ({ item }: { item: RecipeItem }) => (
    <OneRecipe item={item} />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#FF5D00" />
        <Text style={styles.loadingText}>Đang tải thêm...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fillContain}>
        <View style={[styles.tagContain, styles.fillContain]}>
          {selectedTags.length > 0 && (
            <SelectedTags 
              tags={selectedTags} 
              onRemoveTag={removeTag}
            />
          )}
        </View>
        <View style={[styles.buttonContain, styles.fillContain]}>
          <TouchableOpacity 
            style={[styles.circle, styles.orange]}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name='add' size={15} color={'#FFFFFF'}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.circle, styles.red]}
            onPress={clearAllTags}
          >
            <Ionicons name='close' size={15} color={'#FFFFFF'}/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listContainer}>
        {isLoading && recipes.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF5D00" />
            <Text style={styles.loadingText}>Đang tải công thức...</Text>
          </View>
        ) : error ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                if (selectedTags.length > 0) {
                  fetchRecipesByTags();
                }
              }}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : recipes.length > 0 ? (
          <FlatList
            data={recipes}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderRecipeItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onEndReached={loadMoreRecipes}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {selectedTags.length > 0 
                ? `Không tìm thấy công thức nào trong thể loại "${selectedTags.join(', ')}"`
                : query 
                  ? `Không tìm thấy công thức nào phù hợp với "${query}"`
                  : 'Chọn thể loại để xem công thức'
              }
              {selectedTags.length > 0 && (
                <Text style={styles.noResultsSubText}>
                  {'\n'}Thử chọn thể loại khác để xem thêm kết quả
                </Text>
              )}
            </Text>
          </View>
        )}
      </View>

      <FilterDialog 
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilter}
        initialSelectedTags={selectedTags}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  fillContain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 5,
    minHeight: 40,
  },
  tagContain: {
    flex: 1,
    marginRight: 10,
  },
  buttonContain: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 5,
  },
  circle: {
    borderRadius: 15,
    padding: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orange: {
    backgroundColor: '#FF5D00'
  },
  red: {
    backgroundColor: '#EB3223'
  },
  listContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 50,
    gap: 10,
  },
  backButton: {
    padding: 5,
  },
  searchBarWrapper: {
    flex: 1,
    paddingLeft: 10,
  },
  searchBarInHeader: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  searchBarFocused: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#FF5D00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SearchResults;