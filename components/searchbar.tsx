import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn nấu gì?"
          placeholderTextColor="rgba(145, 64, 35, 0.5)" // Màu chữ placeholder
        />
        <Image 
          source={require('@/assets/images/icons/icon_search.png')} // Điều chỉnh đường dẫn tới icon của bạn
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
    //chèn 2 element cùng row để hiển thị icon và input cùng hàng
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#f7f7f7',
    paddingHorizontal: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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