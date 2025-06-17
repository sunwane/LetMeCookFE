import FilterDialog from '@/components/FilterDialog';
import OneRecipe from '@/components/OneRecipe';
import SearchBar from '@/components/searchbar';
import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { foodData } from '@/services/types/RecipeItem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState } from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);

  const SearchFilterFood = foodData.filter(food => food.foodName == query)

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
      <View style={styles.fillContain}>
        <View style={[styles.tagContain, styles.fillContain]}>

        </View>
        <View style={[styles.buttonContain, styles.fillContain]}>
          <TouchableOpacity 
            style={[styles.circle, styles.orange]}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name='add' size={20} color={'#FFFFFF'}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circle, styles.red]}>
            <Ionicons name='close' size={20} color={'#FFFFFF'}/>
          </TouchableOpacity>
        </View>
      </View>
      {/* {query &&
      <Text style={styles.text}>
        Kết quả tìm kiếm cho: {query}
      </Text>
      } */}
      <View>
        <FlatList
          data={SearchFilterFood}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <OneRecipe item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <FilterDialog 
        visible={showFilter}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  fillContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Đẩy nội dung ra 2 đầu
    marginHorizontal: 10,
  },
  tagContain: {
    flex: 1,
    marginRight: 10, // Tạo khoảng cách với buttons
  },
  buttonContain: {
    flexDirection: 'row',
    gap: 8,
    // Xóa flex: 1 để không chiếm hết không gian còn lại
  },
  circle: {
    borderRadius: 15,
    padding: 4,
    width: 30, // Đặt kích thước cố định
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orange: {
    backgroundColor: '#FF5D00'
  },
  red: {
    backgroundColor: '#EB3223'
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
    marginTop: -55,
    marginVertical: 0,
  },
});

export default SearchResults;