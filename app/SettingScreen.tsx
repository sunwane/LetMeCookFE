import LogoutModal from "@/components/LogoutModal";
import "@/config/globalTextConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logoutAPI } from "../services/types/auth";

const SettingScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEditAccount = () => {
    router.push("/EditAccountScreen");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);

      // ✅ Get token from AsyncStorage
      const authToken = await AsyncStorage.getItem("authToken");

      if (authToken) {
        console.log("🚪 Logging out with token...");

        // ✅ Call logout API
        await logoutAPI({ token: authToken });
        console.log("✅ Logout API success");
      } else {
        console.log("⚠️ No token found, skipping API call");
      }

      // ✅ Clear all stored data
      await AsyncStorage.multiRemove([
        "authToken",
        "userEmail",
        "userPassword",
        "refreshToken",
      ]);

      console.log("✅ Cleared AsyncStorage");

      // ✅ Navigate to login
      router.replace("/");
    } catch (error) {
      console.error("❌ Logout failed:", error);

      // ✅ Even if API fails, still clear local data and redirect
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.settingsContainer}>
          {/* Edit Account Button */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleEditAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={24} color="#FF5D00" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Chỉnh sửa tài khoản</Text>
                <Text style={styles.settingSubtitle}>
                  Thay đổi email và mật khẩu
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={isLoggingOut ? "#ccc" : "#FF5D00"}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.settingTitle,
                    styles.logoutText,
                    isLoggingOut && styles.logoutTextDisabled,
                  ]}
                >
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </Text>
                <Text
                  style={[
                    styles.settingSubtitle,
                    isLoggingOut && styles.logoutTextDisabled,
                  ]}
                >
                  Thoát khỏi tài khoản hiện tại
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isLoggingOut ? "#ccc" : "#999"}
            />
          </TouchableOpacity>
        </View>
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

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsContainer: {
    gap: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  logoutItem: {
    marginTop: 10,
    backgroundColor: "#fff5f5",
    borderColor: "#ffe5e5",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 93, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  logoutIconContainer: {
    backgroundColor: "rgba(255, 93, 0, 0.1)",
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  logoutText: {
    color: "#FF5D00",
  },
  logoutTextDisabled: {
    color: "#ccc",
  },
});
