"use client";

import OneNoti from "@/components/oneNoti";
import {
  disconnectWebSocket,
  dismissNotification,
  getNotifications,
  getUnreadNotificationsCount,
  initializeWebSocket,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "@/services/types/NotificationItem";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getUserInfoFromToken = async (): Promise<{
  id: string;
  username: string;
  email: string;
  roles: string[];
} | null> => {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    console.log("No auth token found");
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT Payload:", payload);

    // Xử lý trường scope để trích xuất roles
    const roles = payload.scope
      ? payload.scope
          .split(" ")
          .filter((role: string) => role.startsWith("ROLE_"))
          .map((role: string) => role.replace("ROLE_", ""))
      : payload.roles || payload.authorities || [];

    console.log("Extracted roles:", roles);

    return {
      id: payload.id || payload.sub,
      username: payload.username || payload.sub,
      email: payload.sub || payload.email,
      roles: roles,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    username: string;
    email: string;
    roles: string[];
  } | null>(null);

  // Helper function to check if notification is for current user
  const isNotificationForCurrentUser = (
    notification: NotificationItem
  ): boolean => {
    if (!userInfo) return true; // Public notifications

    console.log("Checking notification for current user:", {
      recipientUsername: notification.recipientUsername,
      recipientId: notification.recipientId,
      userEmail: userInfo.email,
      username: userInfo.username,
      userId: userInfo.id,
    });

    // Check recipientId first (most reliable) - available in WebSocket
    if (notification.recipientId) {
      return notification.recipientId === userInfo.id;
    }

    // For REST API notifications without recipientId, check username/email
    if (notification.recipientUsername) {
      return (
        notification.recipientUsername === userInfo.username ||
        notification.recipientUsername === userInfo.email ||
        notification.recipientUsername === userInfo.id
      );
    }

    return true; // Public notifications
  };

  const fetchNotifications = async () => {
    if (!userInfo) {
      console.log("UserInfo not loaded yet, skipping fetchNotifications");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getNotifications(0, 20);
      console.log("=== REST API DEBUG ===");
      console.log("Fetched notifications count:", result.content.length);
      console.log("Current user info:", userInfo);
      console.log("Fetched notifications:", result.content);
      console.log("=== END DEBUG ===");

      setNotifications(result.content);
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Không thể tải thông báo. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  // Load user info first, then fetch notifications
  useEffect(() => {
    const loadUserInfo = async () => {
      const info = await getUserInfoFromToken();
      if (info) {
        setUserInfo(info);
        console.log("User info loaded:", info);
      } else {
        console.error("Failed to retrieve user info from token");
        setError("Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // Fetch notifications after userInfo is loaded
  useEffect(() => {
    if (userInfo) {
      fetchNotifications();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) return; // Chờ userInfo có giá trị

    initializeWebSocket((newNotification) => {
      console.log("Received notification:", newNotification);

      const processedNotification = {
        ...newNotification,
        createdAt: newNotification.createdAt
          ? new Date(newNotification.createdAt).toISOString()
          : new Date().toISOString(), // Fallback nếu không có createAt
      };

      setNotifications((prev) => {
        const updatedNotifications = [processedNotification, ...prev];
        console.log("Updated notifications:", updatedNotifications);
        return updatedNotifications;
      });

      if (!processedNotification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [userInfo]);

  const filteredNotifications = notifications.filter((n) => {
    const isAdmin = userInfo?.roles.includes("ADMIN");
    const isForCurrentUser = isNotificationForCurrentUser(n);

    console.log("Filtering notification:", {
      id: n.id,
      title: n.title,
      type: n.type,
      recipientId: n.recipientId,
      currentUserId: userInfo?.id,
      isAdmin,
      isForCurrentUser,
      message: n.message,
    });

    if (!isAdmin) {
      // ✅ Luôn cho phép nếu là notify của chính user
      if (isForCurrentUser) {
        return true;
      }

      // Skip admin-only notifications
      if (n.onlyForAdmin) {
        console.log("Skipping admin-only notification for non-admin user");
        return false;
      }

      // Skip notifications explicitly sent to admin
      if (n.recipientUsername === "admin") {
        console.log("Skipping admin-specific notification for non-admin user");
        return false;
      }

      // Skip pending approval notifications không phải của user
      if (
        (n.message.includes("đang chờ duyệt") ||
          n.message.includes("pending approval") ||
          n.title.includes("Recipe đang chờ duyệt") ||
          n.title.includes("Công thức mới đang chờ duyệt")) &&
        !isForCurrentUser
      ) {
        console.log("Skipping pending approval notification for other users");
        return false;
      }

      // ✅ Cho phép RECIPE_APPROVED và RECIPE_REJECTED nếu là của user
      if (
        (n.type === "recipe_approved" || n.type === "recipe_rejected") &&
        !isForCurrentUser
      ) {
        console.log(
          "Skipping recipe approval/rejection notification for other users"
        );
        return false;
      }
    }

    // Mặc định hiển thị
    console.log("Showing notification");
    return true;
  });

  console.log("Total notifications:", notifications.length);
  console.log("Filtered notifications:", filteredNotifications.length);

  // Apply unread filter if needed
  const finalFilteredNotifications = showUnreadOnly
    ? filteredNotifications.filter((n) => !n.isRead)
    : filteredNotifications;

  const handleNotificationPress = async (notification: NotificationItem) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      }

      if (notification.actionUrl) {
        if (
          typeof notification.actionUrl === "string" &&
          notification.actionUrl.startsWith("/")
        ) {
          router.push(notification.actionUrl as any);
        } else {
          console.warn("Invalid actionUrl:", notification.actionUrl);
          Alert.alert("Lỗi", "Đường dẫn không hợp lệ.");
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Lỗi", "Không thể đánh dấu thông báo là đã đọc.");
    }
  };

  const handleDismissNotification = async (notificationId: string) => {
    try {
      console.log(
        `Attempting to dismiss notification with ID: ${notificationId}`
      );
      const success = await dismissNotification(notificationId);
      if (success) {
        console.log(
          `Dismissed notification with ID: ${notificationId} successfully`
        );
        await fetchNotifications(); // Reload data from server
      } else {
        console.error(
          `Failed to dismiss notification with ID: ${notificationId}`
        );
        Alert.alert(
          "Lỗi",
          "Không thể ẩn thông báo. Vui lòng kiểm tra kết nối hoặc thử lại."
        );
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
      Alert.alert(
        "Lỗi",
        "Không thể ẩn thông báo. Vui lòng kiểm tra kết nối hoặc thử lại."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    Alert.alert(
      "Đánh dấu tất cả đã đọc",
      "Bạn có chắc muốn đánh dấu tất cả thông báo là đã đọc?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await markAllNotificationsAsRead();
              await fetchNotifications();
            } catch (error) {
              console.error("Error marking all notifications as read:", error);
              Alert.alert(
                "Lỗi",
                "Không thể đánh dấu tất cả thông báo là đã đọc."
              );
            }
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.customHeader}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF5D00" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            showUnreadOnly && styles.filterButtonActive,
          ]}
          onPress={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          <Text
            style={[
              styles.filterButtonText,
              showUnreadOnly && styles.filterButtonTextActive,
            ]}
          >
            {showUnreadOnly ? "Hiện tất cả" : "Chưa đọc"}
          </Text>
        </TouchableOpacity>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Đánh dấu tất cả đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <OneNoti
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
              onDismiss={handleDismissNotification}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>Chưa có thông báo</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerBadge: {
    position: "absolute",
    top: -8,
    right: -20,
    backgroundColor: "#FF5D00",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  placeholder: {
    width: 34,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterButtonActive: {
    backgroundColor: "#FF5D00",
    borderColor: "#FF5D00",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllButtonText: {
    fontSize: 14,
    color: "#FF5D00",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF5D00",
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
