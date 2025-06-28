import {
  createFavoriteRecipe,
  deleteFavoriteRecipe,
  FavoritesRecipe,
  getAllFavouriteRecipe,
} from "@/services/types/FavoritesRecipe";
import { getAllIngredients, Ingredients } from "@/services/types/Ingredients";
import {
  getAllRecipeIngredientsByRecipeId,
  RecipeIngredientsResponse,
} from "@/services/types/RecipeIngredients";
import { RecipeItem } from "@/services/types/RecipeItem";
import { useRecipeStore } from "@/services/types/recipeStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("screen");

interface OneRecipeProps {
  item: RecipeItem | FavoritesRecipe;
  isFavorite?: boolean;
}

const OneRecipe = ({ item, isFavorite = false }: OneRecipeProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false); // Đổi default thành false
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredientsResponse[]
  >([]);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const getRecipeData = (): RecipeItem => {
    if ("food" in item) {
      return (item as FavoritesRecipe).food;
    }
    return item as RecipeItem;
  };

  const recipe = getRecipeData();
  // ✅ Reactive cách lấy recipe realtime bằng selector
  const realtimeLikes = useRecipeStore(
    (state) => state.recipes.find((r) => r.id === recipe.id)?.totalLikes
  );

  // Kiểm tra bookmark status từ database
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await getAllFavouriteRecipe();
        if (response?.result && Array.isArray(response.result)) {
          // Kiểm tra xem recipe.id có trong danh sách favorite không
          const isInFavorites = response.result.some(
            (favorite) => favorite.recipeId === recipe.id
          );
          setIsBookmarked(isInFavorites);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        // Nếu có lỗi, sử dụng giá trị mặc định từ props
        setIsBookmarked(isFavorite);
      }
    };

    if (recipe.id) {
      checkBookmarkStatus();
    }
  }, [recipe.id, isFavorite]);

  const toggleBookmark = async (e: any, recipeId: string) => {
    e.stopPropagation();

    if (isBookmarkLoading) return; // Prevent multiple calls

    setIsBookmarkLoading(true);

    try {
      if (isBookmarked) {
        // Xử lý khi bỏ bookmark
        await deleteFavoriteRecipe(recipe.id);
        setIsBookmarked(false);
      } else {
        // Xử lý khi thêm bookmark
        await createFavoriteRecipe(recipe.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bookmark:", error);

      // Revert lại trạng thái nếu có lỗi
      setIsBookmarked(!isBookmarked);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Fetch ingredients khi component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      if (!recipe.id) return;

      setIsLoadingIngredients(true);
      try {
        // Gọi 2 API song song
        const [recipeIngredientsResponse, allIngredientsResponse] =
          await Promise.all([
            getAllRecipeIngredientsByRecipeId(recipe.id),
            getAllIngredients(),
          ]);

        if (
          recipeIngredientsResponse?.result &&
          Array.isArray(recipeIngredientsResponse.result)
        ) {
          setRecipeIngredients(recipeIngredientsResponse.result);
        }

        if (
          allIngredientsResponse?.result &&
          Array.isArray(allIngredientsResponse.result)
        ) {
          setAllIngredients(allIngredientsResponse.result);
        }
      } catch (error) {
        console.error("OneRecipe - Error fetching ingredients:", error);
        setRecipeIngredients([]);
        setAllIngredients([]);
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    fetchIngredients();
  }, [recipe.id]);

  // Hàm navigate đến RecipeScreen
  const handleRecipePress = () => {
    router.push({
      pathname: "/RecipeScreen",
      params: {
        recipeData: JSON.stringify(recipe),
      },
    });
  };

  // Lấy danh sách tên nguyên liệu từ API response
  const getIngredientsList = () => {
    if (isLoadingIngredients) {
      return "Đang tải nguyên liệu...";
    }

    if (recipeIngredients.length === 0) {
      return "Không có nguyên liệu";
    }

    // Map RecipeIngredient với Ingredient để lấy tên
    const ingredientNames = recipeIngredients
      .slice(0, 5)
      .map((recipeIng) => {
        // Tìm ingredient tương ứng dựa trên ingredientId
        const ingredient = allIngredients.find(
          (ing) => ing.id === recipeIng.ingredientId
        );
        return ingredient ? ingredient.ingredientName : "Unknown";
      })
      .filter((name) => name !== "Unknown"); // Loại bỏ những ingredient không tìm thấy

    if (ingredientNames.length === 0) {
      return "Không tìm thấy thông tin nguyên liệu";
    }

    const displayText = ingredientNames.join(", ");

    // Nếu có nhiều hơn 3 nguyên liệu, thêm "..."
    if (recipeIngredients.length > 5) {
      return `${displayText}...`;
    }

    return displayText;
  };
  console.log("💡 Render OneRecipe:", realtimeLikes);
  useEffect(() => {
    console.log("🔄 OneRecipe totalLikes updated:", realtimeLikes);
  }, [realtimeLikes]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleRecipePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: recipe.image }}
        style={styles.recipeImage}
        onError={(e) =>
          console.log("OneRecipe - Image load error:", e.nativeEvent.error)
        }
      />
      <View style={styles.infor}>
        <View>
          <View style={[styles.row, styles.titlePlace]}>
            <Text
              style={styles.bigTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {recipe.title}
            </Text>
            <TouchableOpacity onPress={(e) => toggleBookmark(e, recipe.id)}>
              <Image
                source={
                  isBookmarked
                    ? require("@/assets/images/icons/Bookmark_Active.png")
                    : require("@/assets/images/icons/Bookmark.png")
                }
                style={styles.mark}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.desView}>
            <Text
              style={[styles.des, isLoadingIngredients && styles.loadingText]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              <Text style={styles.bold}>Nguyên liệu: </Text>
              {getIngredientsList()}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.row}>
            <View style={[styles.row, styles.nextTo]}>
              <Image
                source={require("@/assets/images/icons/stars.png")}
                style={styles.icon}
              />
              <Text style={styles.smallText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("@/assets/images/icons/Clock.png")}
                style={styles.icon}
              />
              <Text style={styles.smallText}>{recipe.cookingTime}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image
              source={require("@/assets/images/icons/Like_Active.png")}
              style={styles.icon}
            />
            <Text style={styles.smallText}>
              {realtimeLikes ?? recipe.totalLikes ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OneRecipe;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingHorizontal: 8,
    flexDirection: "row",
    gap: 10,
    flexGrow: 1,
  },
  infor: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    minWidth: 0,
  },
  titlePlace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextTo: {
    marginRight: 8,
  },
  recipeImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    flexShrink: 0,
  },
  mark: {
    width: 14,
    height: 20,
    tintColor: "#7A2917",
    flexShrink: 0,
  },
  bigTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7A2917",
    flex: 1,
    marginRight: 8,
  },
  desView: {
    marginTop: 3,
    flex: 1,
  },
  des: {
    fontSize: 11.5,
    color: "rgba(0,0,0,0.7)",
    textAlign: "justify",
    flexShrink: 1,
  },
  loadingText: {
    fontStyle: "italic",
    color: "rgba(0,0,0,0.5)",
  },
  bold: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.7)",
    fontWeight: "500",
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 2,
    tintColor: "rgba(0,0,0,0.7)",
  },
});
