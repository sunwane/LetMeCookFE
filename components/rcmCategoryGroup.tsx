import { sampleSubCategories } from '@/services/types/SubCategoryItem';
import { FlatList, StyleSheet, View } from 'react-native';
import OneSubCategory from './oneSubCategory';

const RcmCategoryGroup = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleSubCategories}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <OneSubCategory item={item} />
        )}
      />
    </View>
  )
}

export default RcmCategoryGroup

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
})