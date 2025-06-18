import FilterDialog from '@/components/FilterDialog';
import OneRecipe from '@/components/OneRecipe';
import SearchBar from '@/components/searchbar';
import SelectedTags from '@/components/SelectedTags';
import '@/config/globalTextConfig';
import { foodData } from '@/services/types/RecipeItem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SearchResults = () => {
  const { query, selectedTags: initialSelectedTagsParam } = useLocalSearchParams();
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  // Logic filter 2 lớp: theo tên món ăn và theo tags
  const getFilteredFood = () => {
    let filteredData = foodData;

    // Lớp 1: Filter theo query (tên món ăn)
    if (query && typeof query === 'string' && query.trim()) {
      filteredData = filteredData.filter(food => 
        food.foodName.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Lớp 2: Filter theo selectedTags (categories/subcategories)
    if (selectedTags.length > 0) {
      filteredData = filteredData.filter(food => {
        // Kiểm tra xem món ăn có thuộc category hoặc subcategory nào được chọn không
        const matchesCategory = food.category && selectedTags.includes(food.category.name);
        const matchesSubCategory = food.subCategory && selectedTags.includes(food.subCategory.name);
        
        // Cũng có thể match trực tiếp với tên món ăn nếu được tag
        const matchesFoodName = selectedTags.includes(food.foodName);
        
        return matchesCategory || matchesSubCategory || matchesFoodName;
      });
    }

    return filteredData;
  };

  const SearchFilterFood = getFilteredFood();

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
  };

  // Cập nhật header với SearchBar chế độ FindRecipe
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF5D00" />
          </TouchableOpacity>
          <SearchBar 
            defaultValue={(query as string) || ''} 
            containerStyle={styles.searchHeader}
            searchMode="FindRecipe"
            onSearch={(newQuery) => {
              router.push({
                pathname: '/SearchResults',
                params: { query: newQuery },
              });
            }}
          />
        </View>
      ),
    });
  }, [navigation, query]);

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
        {SearchFilterFood.length > 0 ? (
          <FlatList
            data={SearchFilterFood}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <OneRecipe item={item} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {selectedTags.length > 0 
                ? `Không tìm thấy món ăn nào trong thể loại "${selectedTags.join(', ')}"`
                : query 
                  ? `Không tìm thấy món ăn nào phù hợp với "${query}"`
                  : 'Không tìm thấy món ăn nào phù hợp với bộ lọc'
              }
              {selectedTags.length > 0 && (
                <Text style={styles.noResultsSubText}>
                  {'\n'}Thử xóa bớt bộ lọc để xem thêm kết quả
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

// Thêm styles mới
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  fillContain: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Thay đổi để tags không bị stretch
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 5,
    minHeight: 40, // Đặt height tối thiểu
  },
  tagContain: {
    flex: 1,
    marginRight: 10,
  },
  buttonContain: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start', // Align buttons ở top
    marginTop: 5, // Thêm margin top để align với tags
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
    flex: 1, // Đảm bảo FlatList chiếm hết không gian còn lại
  },
  text: {
    fontSize: 16,
    color: '#74341C',
    fontWeight: 'bold',
    paddingVertical: 10, 
    paddingHorizontal: 5,
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
  backButton: {},
  searchHeader: {
    flex: 1,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: -15,
    marginRight: -10,
    marginVertical: 0,
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
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
});

export default SearchResults;