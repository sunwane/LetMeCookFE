import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  defaultValue?: string;
  containerStyle?: any;
  onSearch?: (query: string) => void;
  searchMode?: 'FindRecipe' | 'FindCategory'; // Thêm prop để xác định chế độ
  onFilterChange?: (query: string) => void; // Callback cho filter trong FilterDialog
  placeholder?: string; // Custom placeholder
}

const SearchBar = ({ 
  defaultValue = '', 
  containerStyle, 
  onSearch, 
  searchMode = 'FindRecipe',
  onFilterChange,
  placeholder
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  // Đồng bộ searchQuery với defaultValue khi defaultValue thay đổi
  useEffect(() => {
    setSearchQuery(defaultValue);
  }, [defaultValue]);

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    
    // Nếu là chế độ FindCategory và có callback, gọi ngay khi text thay đổi
    if (searchMode === 'FindCategory' && onFilterChange) {
      onFilterChange(text);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else if (searchMode === 'FindRecipe') {
        // Chế độ tìm kiếm món ăn - chuyển sang SearchResults
        router.push({
          pathname: '/SearchResults',
          params: { query: searchQuery }
        });
      }
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return searchMode === 'FindRecipe' ? 'Bạn muốn nấu gì?' : 'Tìm kiếm thể loại...';
  };

  return (
    <View style={[styles.header, containerStyle]}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={getPlaceholder()}
          placeholderTextColor="rgba(145, 64, 35, 0.5)"
          value={searchQuery}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={searchMode === 'FindCategory'} // Auto focus cho search trong filter
        />
        <Image 
          source={require('@/assets/images/icons/icon_search.png')}
          style={styles.searchIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingBottom: 20,
  },
  headerContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#f6f6f6',
    paddingHorizontal: 9,
    shadowColor: '#ff5d00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: 15
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#914023',
    fontSize: 14,
    fontWeight: '400',
    outlineWidth: 0, 
  }
});

export default SearchBar;