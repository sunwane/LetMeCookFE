import { AccountItem } from "@/services/types/AccountItem";
import { CommentItem, countCommentByAccountId } from "@/services/types/CommentItem";
import { getRecipeCountByUserAPI, getUserInfoAPI, uploadAvatarAPI } from "@/services/types/UserInfo";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAvatarSource } from '../services/types/UserInfo';

const { width: ScreenWidth } = Dimensions.get("screen")

interface AccountBannerProps {
  comments: CommentItem[];
}

const AccountBanner = ({ comments }: AccountBannerProps) => {  
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AccountItem | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [activityCount, setActivityCount] = useState<number>(0);
  
  // ✅ Chọn và upload avatar mới
  const handleAvatarPress = async () => {
    try {
      // 📱 Yêu cầu quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để thay đổi avatar!');
        return;
      }

      // 🖼️ Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio cho avatar
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImageUri = result.assets[0].uri;
        
        // 💾 Cập nhật avatar ngay lập tức (optimistic update)
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            avatar: selectedImageUri
          });
        }

        // 🚀 Upload avatar lên server
        await uploadAvatar(selectedImageUri);
      }
    } catch (error) {
      console.error("❌ Error selecting avatar:", error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại!');
    }
  };

  // 🚀 Upload avatar lên server
  const uploadAvatar = async (imageUri: string) => {
    try {
      setIsUploadingAvatar(true);
      
      console.log("🔄 Uploading avatar...");
      
      // ✅ Call actual API
      const updatedUserInfo = await uploadAvatarAPI(imageUri);
      
      // ✅ Update current user with new avatar from server response
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          avatar: updatedUserInfo.avatar
        });
      }
      
      console.log("✅ Avatar uploaded successfully:", updatedUserInfo);
      Alert.alert('Thành công', 'Cập nhật avatar thành công!');
      
    } catch (error) {
      console.error("❌ Avatar upload failed:", error);
      Alert.alert('Lỗi', 'Không thể cập nhật avatar. Vui lòng thử lại!');
      
      // 🔄 Revert lại avatar cũ nếu upload thất bại
      try {
        const userInfo = await getUserInfoAPI();
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            avatar: userInfo.avatar
          });
        }
      } catch (revertError) {
        console.error("❌ Failed to revert avatar:", revertError);
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ✅ Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoadingUser(true);
        console.log("👤 Fetching current user info...");
        
        const userInfo = await getUserInfoAPI();
        const userEmail = await AsyncStorage.getItem('userEmail') || 'user@example.com';
              let userName = userEmail.split('@')[0]; // Fallback
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const base64Payload = token.split('.')[1];
            const payloadString = b64DecodeUnicode(base64Payload);
            const payload = JSON.parse(payloadString);
            userName = payload.username || userName;
          }
        } catch (tokenError) {
          console.warn("⚠️ Failed to get username from token:", tokenError);
        }
      const accountItem: AccountItem = {
          id: userInfo.id, 
          email: userEmail,
          userName: userName,
          avatar: userInfo.avatar, 
          status: 'ACTIVE',
          sex: userInfo.sex || 'Nam',
          age: userInfo.age || 25,
          height: userInfo.height || 170,
          weight: userInfo.weight || 60,
          diet: userInfo.dietTypes?.[0] || 'NORMAL',
          userBirthday: new Date(Date.now() - (userInfo.age || 25) * 365.25 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt,
        };
        
        setCurrentUser(accountItem);
        
      } catch (error) {
        console.error("❌ Failed to fetch current user:", error);
        const fallbackUser: AccountItem = {
          id: 'fallback-user',
          email: await AsyncStorage.getItem('userEmail') || 'user@example.com',
          userName: (await AsyncStorage.getItem('userEmail') || 'user@example.com').split('@')[0] || 'Current User',
          avatar: undefined,
          status: 'ACTIVE',
          sex: 'Nam',
          age: 25,
          height: 170,
          weight: 60,
          diet: 'NORMAL',
          userBirthday: '01/01/2000',
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
  if (!currentUser) {
    setRecipeCount(0); // Nếu không có user, set luôn về 0
    return;
  }

  const fetchRecipeCount = async () => {
    try {
      setIsLoadingRecipes(true);  
      const count = await getRecipeCountByUserAPI();
      setRecipeCount(count);
    } catch (error) {
      setRecipeCount(0);
      // Không cần console.error ở đây để tránh log lỗi không cần thiết
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  fetchRecipeCount();
}, [currentUser]);

  // ✅ Fetch số hoạt động (bình luận) khi đã có currentUser
  useEffect(() => {
    const fetchActivityCount = async () => {
      if (!currentUser) return;
      try {
        const response = await countCommentByAccountId();
        const count = response.result ?? 0; // Lấy số lượng từ trường result
        console.log("Fetched activity count:", count);
        setActivityCount(count);
      } catch (error) {
        setActivityCount(0);
        console.error("❌ Failed to fetch activity count:", error);
      }
    };

    if (currentUser) {
      fetchActivityCount();
    }
  }, [currentUser]);

  // Tính toán số hoạt động (comments)
  // ✅ Safe comment filtering
  
  // const activityCount = currentUser && currentUser.id
  //   ? comments.filter(comment => {
  //       // ✅ Handle different id types (string vs number)
  //       const commentUserId = comment.account.id?.toString();
  //       const currentUserId = currentUser.id?.toString();
  //       return commentUserId === currentUserId;
  //     }).length 
  //   : 0;

  // Debug logs
  useEffect(() => {
    const debugToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // console.log("🔍 Token payload:", payload);
          // console.log("📧 Token subject (email):", payload.sub);
          console.log("📧 Stored email:", await AsyncStorage.getItem('userEmail'));
        }
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    };
    
    debugToken();
  }, []);

  if (isLoadingUser || !currentUser) {
    return (
      <View style={styles.container}>
        <Image source={require("@/assets/images/AccountBackground.png")} style={styles.background} resizeMode="cover" />
        <View style={styles.whiteOverlay} />
        <View style={styles.contentContainer}>
          <Image 
            source={{uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}}
            style={styles.avatar}
          />
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
        
        {/* ✅ Avatar có thể tap để thay đổi với camera overlay */}
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarPress}
          activeOpacity={0.8}
          disabled={isUploadingAvatar}
        >
          <Image 
            source={getAvatarSource(currentUser.avatar)}
            style={[styles.avatar, isUploadingAvatar && styles.avatarUploading]} 
          />
          
          {/* 📷 Camera overlay mờ */}
          <View style={styles.avatarOverlay}>
            <Ionicons 
              name={isUploadingAvatar ? "cloud-upload" : "camera"} 
              size={24} 
              color="rgba(255, 255, 255, 0.9)" 
            />
          </View>
          
          {/* 🔄 Loading text khi đang upload */}
          {isUploadingAvatar && (
            <View style={styles.uploadingIndicator}>
              <Text style={styles.uploadingText}>Đang tải...</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.userName}>{currentUser?.userName || 'Unknown User'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {isLoadingRecipes ? "..." : recipeCount}
            </Text>
            <Text style={styles.statLabel}>Công thức</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {activityCount}
            </Text>
            <Text style={styles.statLabel}>Hoạt động</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
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
    paddingVertical: 10,
  },
  // ✅ Avatar container và overlay styles
  avatarContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarUploading: {
    opacity: 0.7,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Lớp mờ đen nhẹ
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingIndicator: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 12,
    color: '#FF5D00',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
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