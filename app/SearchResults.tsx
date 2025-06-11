import SearchBar from '@/components/searchbar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  console.log('SearchResults query:', query); // Debug
  const navigation = useNavigation();

  // Cập nhật header với SearchBar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF5D00" />
          </TouchableOpacity>
          <SearchBar 
            defaultValue={(query as string) || ''} // Truyền query từ SearchResults
            containerStyle={styles.searchHeader}
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
  }, [navigation, query]); // Cập nhật khi query thay đổi

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Kết quả tìm kiếm cho: {query ? query : 'Không có query'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingTop: 50,
    gap: 10,
  },
  backButton: {},
  searchHeader: {
    flex: 1,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: -55,
    marginVertical: 0,
  },
});

export default SearchResults;