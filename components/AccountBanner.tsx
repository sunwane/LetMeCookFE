import { AccountItem } from "@/services/types/AccountItem";
import { CommentItem } from "@/services/types/CommentItem";
import { getRecipeCountByUserAPI, getUserInfoAPI } from "@/services/types/UserInfo";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: ScreenWidth } = Dimensions.get("screen")

interface AccountBannerProps {
  comments: CommentItem[];
}

const AccountBanner = ({ comments }: AccountBannerProps) => {  
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AccountItem | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  
  // ✅ Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoadingUser(true);
        console.log("👤 Fetching current user info...");
        
        // ✅ Get user info from backend (contains real accountId)
        const userInfo = await getUserInfoAPI();
        
        // ✅ Create AccountItem from UserInfo
        const userEmail = await AsyncStorage.getItem('userEmail') || 'user@example.com';
        
        const accountItem: AccountItem = {
          id: userInfo.id, // ✅ Use real UUID from backend
          email: userEmail,
          userName: `User_${userInfo.id.substring(0, 8)}`, // Generate username from ID
          avatar: userInfo.avatar || 'https://via.placeholder.com/150',
          status: 'ACTIVE',
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt,
        };
        
        setCurrentUser(accountItem);
        console.log("✅ Current user fetched:", accountItem);
        
      } catch (error) {
        console.error("❌ Failed to fetch current user:", error);
        // ✅ Fallback to email-based fake data
        const fallbackUser: AccountItem = {
          id: 'fallback-user',
          email: await AsyncStorage.getItem('userEmail') || 'user@example.com',
          userName: 'Current User',
          avatar: 'https://via.placeholder.com/150',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentUser(fallbackUser);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ Fetch recipe count when user is loaded
  useEffect(() => {
    const fetchRecipeCount = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoadingRecipes(true);
        console.log("🔍 Fetching recipe count for current user...");
        
        // ✅ Don't pass accountId - let backend get from token context
        const count = await getRecipeCountByUserAPI();
        setRecipeCount(count);
        
        console.log("✅ Recipe count fetched:", count);
      } catch (error) {
        console.error("❌ Failed to fetch recipe count:", error);
        setRecipeCount(0);
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    if (currentUser) {
      fetchRecipeCount();
    }
  }, [currentUser]);

  // Tính toán số hoạt động (comments)
  const activityCount = currentUser 
    ? comments.filter(comment => comment.account.id === currentUser.id).length 
    : 0;

  if (isLoadingUser || !currentUser) {
    return (
      <View style={styles.container}>
        <Image source={require("@/assets/images/AccountBackground.png")} style={styles.background} resizeMode="cover" />
        <View style={styles.whiteOverlay} />
        <View style={styles.contentContainer}>
          <View style={[styles.avatar, { backgroundColor: '#f0f0f0' }]} />
          <Text style={styles.userName}>Loading...</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>...</Text>
              <Text style={styles.statLabel}>Công thức</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>...</Text>
              <Text style={styles.statLabel}>Hoạt động</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/AccountBackground.png")} style={styles.background} resizeMode="cover" />
      <View style={styles.whiteOverlay} />
      <View style={styles.contentContainer}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{currentUser.userName}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {isLoadingRecipes ? "..." : recipeCount}
            </Text>
            <Text style={styles.statLabel}>Công thức</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activityCount}</Text>
            <Text style={styles.statLabel}>Hoạt động</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 280,
    backgroundColor: "#f5f5f5",
  },
  background: {
    width: ScreenWidth,
    height: 280,
    position: "absolute",
    top: 0,
    left: 0,
  },
  whiteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(234, 234, 234, 0.85)",
  },
  contentContainer: {
    paddingTop: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#ddd",
  },
})

export default AccountBanner