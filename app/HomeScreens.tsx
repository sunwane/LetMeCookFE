import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { foodData } from "@/services/types/RecipeItem";
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreens() {
  return (
    <View style={styles.background}>
      <SearchBar />
      <ScrollView 
        style={styles.maincontainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HotRecommended foods={foodData} />
        <RcmCategoryGroup />
        <N2xRecipeGroup 
          title="Món ăn nổi bật"
          foods={foodData}
        />
        <N2xRecipeGroup 
          title="Món ngọt hấp dẫn"
          foods={foodData}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    background: {
        flex: 1, // Thay đổi height: screenHeight thành flex: 1
        backgroundColor: '#f9f9f9',},
    maincontainer: {
        flex: 1,
        marginHorizontal: 2,
    },
    scrollContent: {
        gap: 25,
        paddingHorizontal: 10,
    }
});