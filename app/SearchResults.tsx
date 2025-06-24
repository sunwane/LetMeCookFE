import FilterDialog from '@/components/FilterDialog';
import OneRecipe from '@/components/OneRecipe';
import SearchBar from '@/components/searchbar';
import SelectedTags from '@/components/SelectedTags';
import '@/config/globalTextConfig';
import {
  findRecipebyKeyWord // ✅ NEW: Import findRecipebyKeyWord function
  ,


  getRecipesBySubCategory,
  RecipeItem
} from '@/services/types/RecipeItem';
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
  RefreshControl,
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

  // Thêm state để quản lý pagination tốt hơn
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ NEW: State để phân biệt search mode
  const [searchMode, setSearchMode] = useState<'keyword' | 'tags' | 'mixed'>('tags');

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

  // ✅ NEW: Fetch recipes by keyword
  const fetchRecipesByKeyword = async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    setSearchMode('keyword');
    
    try {
      const response = await findRecipebyKeyWord(keyword);
      console.log('SearchResults - Keyword search response:', response);
      
      if (response?.result && Array.isArray(response.result)) {
        setRecipes(response.result);
        setHasMorePages(false); // Keyword search không hỗ trợ pagination
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes by keyword:', error);
      setError('Không thể tìm kiếm công thức. Vui lòng thử lại.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED: Enhanced fetchRecipesByTags với mixed search
  const fetchRecipesByTags = async (page = 0, isLoadMore = false) => {
    if (!isLoadMore) {
      setIsLoading(true);
      setError(null);
      setCurrentPage(0);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      let allRecipes: RecipeItem[] = [];
      
      // ✅ NEW: Mixed search - both keyword and tags
      if (query && typeof query === 'string' && query.trim() && selectedTags.length > 0) {
        setSearchMode('mixed');
        
        // First search by keyword
        const keywordResponse = await findRecipebyKeyWord(query);
        if (keywordResponse?.result) {
          allRecipes = [...keywordResponse.result];
        }
        
        // Then filter by tags
        const matchingSubCategories = subCategories.filter(sub => 
          selectedTags.includes(sub.subCategoryName)
        );
        
        if (matchingSubCategories.length > 0) {
          const tagRecipes: RecipeItem[] = [];
          
          for (const subCategory of matchingSubCategories) {
            try {
              const response = await getRecipesBySubCategory(subCategory.id, 0, 10);
              if (response?.result?.content) {
                tagRecipes.push(...response.result.content);
              }
            } catch (error) {
              console.error(`Error fetching recipes for subcategory ${subCategory.id}:`, error);
            }
          }
          
          // Merge and prioritize keyword results, then add tag results
          const keywordIds = allRecipes.map(r => r.id);
          const additionalTagRecipes = tagRecipes.filter(r => !keywordIds.includes(r.id));
          allRecipes = [...allRecipes, ...additionalTagRecipes];
        }
        
        // Remove duplicates
        const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
          index === self.findIndex(r => r.id === recipe.id)
        );
        
        setRecipes(uniqueRecipes);
        setHasMorePages(false);
      }
      // ✅ Keyword only search
      else if (query && typeof query === 'string' && query.trim() && selectedTags.length === 0) {
        await fetchRecipesByKeyword(query);
        return;
      }
      // ✅ Tags only search (existing logic)
      else if (selectedTags.length > 0) {
        setSearchMode('tags');
        
        // Tìm subcategories có tên trong selectedTags
        const matchingSubCategories = subCategories.filter(sub => 
          selectedTags.includes(sub.subCategoryName)
        );

        if (matchingSubCategories.length === 0) {
          setRecipes([]);
          setHasMorePages(false);
          return;
        }

        // Nếu chỉ có 1 subcategory - hỗ trợ pagination
        if (matchingSubCategories.length === 1) {
          const subCategory = matchingSubCategories[0];
          const response = await getRecipesBySubCategory(subCategory.id, page, 10);
          
          if (response?.result) {
            const newRecipes = response.result.content;

            if (isLoadMore) {
              setRecipes(prev => [...prev, ...newRecipes]);
            } else {
              setRecipes(newRecipes);
            }

            setCurrentPage(response.result.number);
            setTotalPages(response.result.totalPages);
            setHasMorePages(!response.result.last);
          }
        } 
        // Nếu có nhiều subcategories - fetch tất cả (không pagination)
        else {
          for (const subCategory of matchingSubCategories) {
            try {
              const response = await getRecipesBySubCategory(subCategory.id, 0, 10);
              if (response?.result?.content) {
                allRecipes.push(...response.result.content);
              }
            } catch (error) {
              console.error(`Error fetching recipes for subcategory ${subCategory.id}:`, error);
            }
          }

          // Remove duplicates based on recipe id
          const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
            index === self.findIndex(r => r.id === recipe.id)
          );

          if (isLoadMore) {
            setRecipes(prev => [...prev, ...uniqueRecipes]);
          } else {
            setRecipes(uniqueRecipes);
          }
          
          setHasMorePages(false);
        }
      }
      else {
        // No search criteria
        setRecipes([]);
        setHasMorePages(false);
      }
      
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Không thể tải dữ liệu công thức. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // ✅ UPDATED: Enhanced loadMoreRecipes
  const loadMoreRecipes = async () => {
    if (isLoadingMore || !hasMorePages || searchMode !== 'tags' || selectedTags.length !== 1) return;
    await fetchRecipesByTags(currentPage + 1, true);
  };

  // ✅ UPDATED: Main search effect
  useEffect(() => {
    if (subCategories.length === 0) return;
    
    const hasQuery = query && typeof query === 'string' && query.trim();
    const hasTags = selectedTags.length > 0;
    
    if (hasQuery || hasTags) {
      fetchRecipesByTags(0, false);
    } else {
      setRecipes([]);
    }
  }, [selectedTags, subCategories, query]);

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
                    // ✅ NEW: Enhanced search with keyword support
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

  // ✅ UPDATED: Enhanced render footer
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#FF5D00" />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      );
    }
    
    if (!hasMorePages && recipes.length > 0) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>
            {searchMode === 'keyword' || searchMode === 'mixed' 
              ? 'Đã hiển thị tất cả kết quả tìm kiếm'
              : 'Đã tải hết tất cả công thức'
            }
          </Text>
        </View>
      );
    }
    
    return null;
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
            <Text style={styles.loadingText}>
              {searchMode === 'keyword' 
                ? 'Đang tìm kiếm công thức...'
                : 'Đang tải công thức...'
              }
            </Text>
          </View>
        ) : error ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                const hasQuery = query && typeof query === 'string' && query.trim();
                const hasTags = selectedTags.length > 0;
                if (hasQuery || hasTags) {
                  fetchRecipesByTags(0, false);
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
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  const hasQuery = query && typeof query === 'string' && query.trim();
                  const hasTags = selectedTags.length > 0;
                  if (hasQuery || hasTags) {
                    fetchRecipesByTags(0, false);
                  }
                }}
                colors={['#FF5D00']}
                tintColor="#FF5D00"
              />
            }
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {selectedTags.length > 0 && query
                ? `Không tìm thấy công thức nào phù hợp với "${query}" trong thể loại "${selectedTags.join(', ')}"`
                : selectedTags.length > 0 
                  ? `Không tìm thấy công thức nào trong thể loại "${selectedTags.join(', ')}"`
                  : query 
                    ? `Không tìm thấy công thức nào phù hợp với "${query}"`
                    : 'Nhập từ khóa hoặc chọn thể loại để tìm kiếm công thức'
              }
              {(selectedTags.length > 0 || query) && (
                <Text style={styles.noResultsSubText}>
                  {'\n'}Thử tìm kiếm với từ khóa khác hoặc chọn thể loại khác
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
  endFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SearchResults;