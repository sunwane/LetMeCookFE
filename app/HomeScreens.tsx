import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { getTop5Recipes, RecipeItem } from "@/services/types/RecipeItem";
import { getTop6subcategories, SubCategoryItem } from "@/services/types/SubCategoryItem";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // ✅ Thêm import router
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

  // ✅ UPDATED: Fetch Top 6 SubCategories thay vì getAllSubCategories
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

  // ✅ Handle suggest recipe - Navigate to SuggestRecipeScreen
  const handleSuggestRecipe = () => {
    console.log('🍳 Navigating to SuggestRecipeScreen...');
    router.push('/SuggestRecipeScreen');
  };

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
        
        {/* ✅ UPDATED: Sử dụng Top 6 SubCategories từ API */}
        <RcmCategoryGroup 
          subCategories={subCategories}
          isLoading={isLoadingSubCategories}
        />
        
        <N2xRecipeGroup 
          title="Món ăn nổi bật"
          foods={top5Recipes}
        />
        <N2xRecipeGroup 
          title="Món ngọt hấp dẫn"
          foods={top5Recipes}
        />
      </ScrollView>

      {/* ✅ Floating Action Button - Đề xuất món */}
      <TouchableOpacity 
        style={[
          styles.floatingButton,
          isKeyboardVisible && {
            bottom: 90 + keyboardHeight * 0.1, // Điều chỉnh vị trí khi keyboard hiện
          }
        ]}
        onPress={handleSuggestRecipe} // ✅ Gọi function navigate
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
    zIndex: 100,
  },
  searchBarContainer: {
    marginHorizontal: 5,
  },
  searchBarWithKeyboard: {
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
    paddingBottom: 100,
  },
  // ✅ Floating Action Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Trên TabBar (70px height + 20px margin)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5D00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#FF5D00', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000, // Đảm bảo nằm trên tất cả
  },
});