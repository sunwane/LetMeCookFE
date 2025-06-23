import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { getNewRecipesInMonth, getTop5Recipes, getTrendingRecipes, RecipeItem } from "@/services/types/RecipeItem"; // Thêm import
import { getTop6subcategories, SubCategoryItem } from "@/services/types/SubCategoryItem";
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

export default function HomeScreens() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // State để quản lý top 5 recipes
  const [top5Recipes, setTop5Recipes] = useState<RecipeItem[]>([]);
  const [isLoadingTop5, setIsLoadingTop5] = useState(true);

  // State để quản lý Top 6 SubCategories
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(true);

  // State để quản lý Trending Recipes
  const [trendingRecipes, setTrendingRecipes] = useState<RecipeItem[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // State để quản lý New Recipes In Month
  const [newRecipes, setNewRecipes] = useState<RecipeItem[]>([]);
  const [isLoadingNewRecipes, setIsLoadingNewRecipes] = useState(true);
  
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

  // Fetch top 5 recipes khi component mount
  useEffect(() => {
    const fetchTop5Recipes = async () => {
      setIsLoadingTop5(true);
      try {
        const response = await getTop5Recipes();
        console.log('HomeScreens - Top5Recipes response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setTop5Recipes(response.result);
        } else {
          setTop5Recipes([]);
        }
      } catch (error) {
        console.error('HomeScreens - Error fetching top 5 recipes:', error);
        setTop5Recipes([]);
      } finally {
        setIsLoadingTop5(false);
      }
    };

    fetchTop5Recipes();
  }, []);

  // Fetch Top 6 SubCategories
  useEffect(() => {
    const fetchTop6SubCategories = async () => {
      setIsLoadingSubCategories(true);
      try {
        const response = await getTop6subcategories();
        console.log('HomeScreens - Top6SubCategories response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setSubCategories(response.result);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error('HomeScreens - Error fetching top 6 subcategories:', error);
        setSubCategories([]);
      } finally {
        setIsLoadingSubCategories(false);
      }
    };

    fetchTop6SubCategories();
  }, []);

  // Fetch Trending Recipes
  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      setIsLoadingTrending(true);
      try {
        const response = await getTrendingRecipes();
        console.log('HomeScreens - TrendingRecipes response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setTrendingRecipes(response.result);
        } else {
          setTrendingRecipes([]);
        }
      } catch (error) {
        console.error('HomeScreens - Error fetching trending recipes:', error);
        setTrendingRecipes([]);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrendingRecipes();
  }, []);

  // Fetch New Recipes In Month
  useEffect(() => {
    const fetchNewRecipes = async () => {
      setIsLoadingNewRecipes(true);
      try {
        const response = await getNewRecipesInMonth();
        console.log('HomeScreens - NewRecipesInMonth response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setNewRecipes(response.result);
        } else {
          setNewRecipes([]);
        }
      } catch (error) {
        console.error('HomeScreens - Error fetching new recipes:', error);
        setNewRecipes([]);
      } finally {
        setIsLoadingNewRecipes(false);
      }
    };

    fetchNewRecipes();
  }, []);

  return (
    <View style={styles.background}>
      {/* SearchBar wrapper */}
      <View style={[
        styles.searchBarWrapper,
        isKeyboardVisible && {
          paddingTop: Math.max(40, 60 - keyboardHeight * 0.05),
        }
      ]}>
        <SearchBar 
          containerStyle={[
            styles.searchBarContainer,
            isKeyboardVisible && styles.searchBarWithKeyboard
          ]}
        />
      </View>
      
      <ScrollView 
        style={styles.maincontainer}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && {
            paddingBottom: Math.max(25, 25 - keyboardHeight * 0.1),
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HotRecommended 
          foods={top5Recipes} 
        />
        
        <RcmCategoryGroup 
          subCategories={subCategories}
          isLoading={isLoadingSubCategories}
        />
        
        {/* Sử dụng Trending Recipes từ API */}
        <N2xRecipeGroup 
          title="Món ăn nổi bật gần đây"
          foods={trendingRecipes}
    
        />
        
        {/* Sử dụng New Recipes In Month từ API */}
        <N2xRecipeGroup 
          title="Công thức mới được đăng tải gần đây"
          foods={newRecipes}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBarWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 70,
    paddingBottom: 20,
    zIndex: 100, // Đảm bảo SearchBar ở trên
  },
  searchBarContainer: {
    marginHorizontal: 5,
  },
  searchBarWithKeyboard: {
    // Có thể thêm style đặc biệt khi keyboard hiện
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  maincontainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  scrollContent: {
    gap: 25,
    paddingHorizontal: 10,
    paddingBottom: 100, // Thêm padding để tránh content bị che bởi TabBar
  }
});