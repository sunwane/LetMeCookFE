import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import {
  getNewRecipesInMonth,
  getTop5Recipes,
  getTrendingRecipes,
  RecipeItem,
} from "@/services/types/RecipeItem";
import { useRecipeStore } from "@/services/types/recipeStore";
import {
  getTop6subcategories,
  SubCategoryItem,
} from "@/services/types/SubCategoryItem";
import { Ionicons } from "@expo/vector-icons"; // ✅ Thêm import Ionicons
import { router } from "expo-router"; // ✅ Thêm import router
import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreens() {
  const { addOrUpdateRecipes } = useRecipeStore.getState();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [allRecipes, setAllRecipes] = useState<RecipeItem[]>([]);

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

  const [refreshing, setRefreshing] = useState(false);

  const recipesInStore = useRecipeStore((state) => state.recipes);
  const top5RecipesRealtime = useMemo(() => {
    return top5Recipes.map(
      (r) => recipesInStore.find((rr) => rr.id === r.id) ?? r
    );
  }, [top5Recipes, recipesInStore]);

  const trendingRecipesRealtime = useMemo(() => {
    return trendingRecipes.map(
      (r) => recipesInStore.find((rr) => rr.id === r.id) ?? r
    );
  }, [trendingRecipes, recipesInStore]);

  const newRecipesRealtime = useMemo(() => {
    return newRecipes.map(
      (r) => recipesInStore.find((rr) => rr.id === r.id) ?? r
    );
  }, [newRecipes, recipesInStore]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
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

  // Hàm reload tất cả dữ liệu
  const handleReload = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchTop5Recipes(),
        fetchTop6SubCategories(),
        fetchTrendingRecipes(),
        fetchNewRecipes(),
      ]);
    } catch (error) {
      console.error("HomeScreens - Error on reload:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch top 5 recipes khi component mount
  const fetchTop5Recipes = async () => {
    setIsLoadingTop5(true);
    try {
      const response = await getTop5Recipes();
      console.log("HomeScreens - Top5Recipes response:", response);

      if (response?.result && Array.isArray(response.result)) {
        setTop5Recipes(response.result);
      } else {
        setTop5Recipes([]);
      }
    } catch (error) {
      console.error("HomeScreens - Error fetching top 5 recipes:", error);
      setTop5Recipes([]);
    } finally {
      setIsLoadingTop5(false);
    }
  };

  // Fetch Top 6 SubCategories
  const fetchTop6SubCategories = async () => {
    setIsLoadingSubCategories(true);
    try {
      const response = await getTop6subcategories();
      console.log("HomeScreens - Top6SubCategories response:", response);

      if (response?.result && Array.isArray(response.result)) {
        setSubCategories(response.result);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error(
        "HomeScreens - Error fetching top 6 subcategories:",
        error
      );
      setSubCategories([]);
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  // Fetch Trending Recipes
  const fetchTrendingRecipes = async () => {
    setIsLoadingTrending(true);
    try {
      const response = await getTrendingRecipes();
      console.log("HomeScreens - TrendingRecipes response:", response);

      if (response?.result && Array.isArray(response.result)) {
        setTrendingRecipes(response.result);
        addOrUpdateRecipes(response.result);
        // Cập nhật state recipes trong store
      } else {
        setTrendingRecipes([]);
      }
    } catch (error) {
      console.error("HomeScreens - Error fetching trending recipes:", error);
      setTrendingRecipes([]);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  // Fetch New Recipes In Month
  const fetchNewRecipes = async () => {
    setIsLoadingNewRecipes(true);
    try {
      const response = await getNewRecipesInMonth();
      console.log("HomeScreens - NewRecipesInMonth response:", response);

      if (response?.result && Array.isArray(response.result)) {
        setNewRecipes(response.result);
        addOrUpdateRecipes(response.result);
      } else {
        setNewRecipes([]);
      }
    } catch (error) {
      console.error("HomeScreens - Error fetching new recipes:", error);
      setNewRecipes([]);
    } finally {
      setIsLoadingNewRecipes(false);
    }
  };

  useEffect(() => {
    fetchTop5Recipes();
    fetchTop6SubCategories();
    fetchTrendingRecipes();
    fetchNewRecipes();
  }, []);

  // ✅ Handle suggest recipe - Navigate to SuggestRecipeScreen
  const handleSuggestRecipe = () => {
    console.log("🍳 Navigating to SuggestRecipeScreen...");
    router.push("/SuggestRecipeScreen"); // ✅ Sử dụng router để điều hướng
  };

  return (
    <View style={styles.background}>
      {/* SearchBar wrapper */}
      <View
        style={[
          styles.searchBarWrapper,
          isKeyboardVisible && {
            paddingTop: Math.max(40, 60 - keyboardHeight * 0.05),
          },
        ]}
      >
        <SearchBar
          containerStyle={[
            styles.searchBarContainer,
            isKeyboardVisible && styles.searchBarWithKeyboard,
          ]}
        />
      </View>

      <ScrollView
        style={styles.maincontainer}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && {
            paddingBottom: Math.max(25, 25 - keyboardHeight * 0.1),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleReload} />
        }
      >
        <HotRecommended foods={top5Recipes} />

        <RcmCategoryGroup
          subCategories={subCategories}
          isLoading={isLoadingSubCategories}
        />

        {/* Sử dụng Trending Recipes từ API */}
        <N2xRecipeGroup
          title="Món ăn nổi bật gần đây"
          foods={trendingRecipesRealtime}
        />

        {/* Sử dụng New Recipes In Month từ API */}
        <N2xRecipeGroup
          title="Công thức mới được đăng tải gần đây"
          foods={newRecipesRealtime}
        />
      </ScrollView>

      {/* ✅ Floating Action Button - Đề xuất món */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          isKeyboardVisible && {
            bottom: 90 + keyboardHeight * 0.1, // Điều chỉnh vị trí khi keyboard hiện
          },
        ]}
        onPress={handleSuggestRecipe} // ✅ Gọi function navigate
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  searchBarWrapper: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 100,
  },
  searchBarContainer: {
    marginHorizontal: 5,
  },
  searchBarWithKeyboard: {
    shadowColor: "#000",
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
    position: "absolute",
    bottom: 20, // Trên TabBar (70px height + 20px margin)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF5D00",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Android shadow
    shadowColor: "#FF5D00", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000, // Đảm bảo nằm trên tất cả
  },
});
