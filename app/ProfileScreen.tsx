import AccountBanner from "@/components/AccountBanner";
import LogoutModal from "@/components/LogoutModal";
import AccountNav from "@/components/ui/navigation/AccountNav";
import "@/config/globalTextConfig";
import { sampleAccounts } from "@/services/types/AccountItem";
import { sampleComments } from "@/services/types/CommentItem";
import { sampleFavorites } from "@/services/types/FavoritesRecipe";
import {
  initializeWebSocket,
  NotificationItem,
} from "@/services/types/NotificationItem";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logoutAPI } from "../services/types/auth";

const ProfileScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Socket setup
  useEffect(() => {
    const unsubscribe = initializeWebSocket(
      (newNotification: NotificationItem) => {
        console.log(
          "📡 [ProfileScreen] Received WS notification:",
          newNotification
        );
        if (!newNotification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
        setNotifications((prev) => [newNotification, ...prev]);
      }
    );

    return () => {};
  }, []);

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      const authToken = await AsyncStorage.getItem("authToken");

      if (authToken) {
        await logoutAPI({ token: authToken });
      }

      await AsyncStorage.multiRemove([
        "authToken",
        "userEmail",
        "userPassword",
        "refreshToken",
      ]);

      router.replace("/");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      await AsyncStorage.multiRemove([
        "authToken",
        "userEmail",
        "userPassword",
        "refreshToken",
      ]);

      Alert.alert(
        "Đăng xuất",
        "Có lỗi xảy ra nhưng bạn đã được đăng xuất khỏi thiết bị này.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Refreshing profile data...");
      // Future refresh logic
    } catch (error) {
      console.error("❌ Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleNotification = () => {
    setUnreadCount(0); // ✅ Reset badge khi bấm
    router.push("/NotificationScreen");
  };

  const handleSettings = () => {
    router.push("/SettingScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header buttons */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotification}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color="#FF5D00" />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={20} color="#FF5D00" />
        </TouchableOpacity>
      </View>

      <AccountBanner comments={sampleComments} />
      <View style={styles.navContainer}>
                <AccountNav
          comments={sampleComments}
          favorites={sampleFavorites}
          account={sampleAccounts}
        />
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isLoading={isLoggingOut}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navContainer: {
    flex: 1,
  },
  topButtonsContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    zIndex: 1000,
    gap: 10,
  },
  notificationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 93, 0, 0.1)",
    position: "relative",
  },
  settingsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 93, 0, 0.1)",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF5D00",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
