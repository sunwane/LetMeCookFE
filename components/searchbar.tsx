import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'; // Thêm useEffect
import { Image, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  defaultValue?: string;
  containerStyle?: any;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ defaultValue = '', containerStyle, onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  // Đồng bộ searchQuery với defaultValue khi defaultValue thay đổi
  useEffect(() => {
    setSearchQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push({
          pathname: '/SearchResults',
          params: { query: searchQuery }
        });
      }
    }
  };

  return (
    <View style={[styles.header, containerStyle]}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn nấu gì?"
          placeholderTextColor="rgba(145, 64, 35, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={true}
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
    marginTop: 60,
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
    width: 30,
    height: 30,
    marginLeft: 15
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    color: '#914023',
    fontSize: 16,
    fontWeight: '400',
    outlineWidth: 0, 
  }
});

export default SearchBar;