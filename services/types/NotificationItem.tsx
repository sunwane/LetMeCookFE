import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRecipeStore } from "./recipeStore";
// Enums và Interfaces
export enum NotificationType {
  LIKE = "like",
  COMMENT = "comment",
  FOLLOW = "follow",
  RECIPE_APPROVED = "recipe_approved",
  RECIPE_REJECTED = "recipe_rejected",
  NEW_RECIPE = "new_recipe",
  SYSTEM = "system",
  REPORT = "report",
  PUBLIC = "public",
}

export interface NotificationSender {
  id: string;
  userName: string;
  avatar: string;
}

export interface NotificationItem {
  onlyForAdmin: boolean | undefined;
  onlyForUser: boolean | undefined;
  recipientUsername: any;
  recipientId?: string;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  dismissed: boolean;
  createdAt: string;
  sender?: NotificationSender;
  recipe?: any;
  actionUrl?: string;
  recipientEmail?: string;
}

// STOMP Client và WebSocket
let stompClient: Client | null = null;
let privateSubscription: any = null;
let publicSubscription: any = null;
let recipeLikesSubscription: any = null;

// Hàm chuẩn hóa thời gian với hỗ trợ date và time riêng lẻ
const normalizeDateTime = (
  dateStr: string | undefined | null,
  timeStr: string | undefined | null
): string => {
  const now = new Date(); // Hiện tại: 2025-06-27T14:25:00+07:00
  const defaultDate = now.toISOString().split("T")[0]; // "2025-06-27"
  const defaultTimeZone = "+07:00";

  if (!timeStr || typeof timeStr !== "string") {
    console.warn(
      "Invalid or missing time string, using current time:",
      now.toISOString()
    );
    return now.toISOString();
  }

  try {
    // Sử dụng date từ server nếu có, nếu không dùng ngày hiện tại
    const effectiveDate =
      dateStr &&
      typeof dateStr === "string" &&
      dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
        ? dateStr
        : defaultDate;

    // Phân tích time (ví dụ: "14:15:10.2554986") và giới hạn mili giây
    const [hours, minutes, seconds] = timeStr.split(":");
    const [sec, ms] = seconds.split(".");
    const milliseconds = ms ? `.${ms.substring(0, 3)}` : ".000"; // Giới hạn 3 chữ số mili giây
    const normalizedTime = `${hours}:${minutes}:${sec}${milliseconds}${defaultTimeZone}`;

    // Tạo chuỗi ISO 8601 đầy đủ
    const fullDateTime = `${effectiveDate}T${normalizedTime}`;
    const date = new Date(fullDateTime);

    if (isNaN(date.getTime())) {
      console.warn(
        `Invalid date/time format "${fullDateTime}", falling back to current time:`,
        now.toISOString()
      );
      return now.toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.error(
      "Error parsing date/time:",
      error,
      "Falling back to current time:",
      now.toISOString()
    );
    return now.toISOString();
  }
};

// Hàm kiểm tra ngày hợp lệ
const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

// Lấy token xác thực
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    console.log("Retrieved auth token from AsyncStorage:", token);
    return token;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

// Cập nhật token mới và khởi động lại WebSocket
export const updateAuthToken = async (newToken: string): Promise<void> => {
  try {
    console.log("Attempting to update auth token with:", newToken);
    await AsyncStorage.setItem("authToken", newToken);
    console.log("Auth token updated successfully in AsyncStorage");

    if (stompClient?.connected) {
      await disconnectWebSocket();
    }
  } catch (error) {
    console.error("Failed to update auth token:", error);
  }
};

// Xử lý response từ API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}: ${errorText}`);
    throw new Error(errorText || `API Error: ${response.status}`);
  }
  return response.json();
};

// Chuyển đổi loại thông báo từ server sang enum
const mapServerTypeToEnum = (
  serverType: string | undefined
): NotificationType => {
  if (!serverType) return NotificationType.SYSTEM;
  const typeMap: { [key: string]: NotificationType } = {
    LIKE: NotificationType.LIKE,
    COMMENT: NotificationType.COMMENT,
    FOLLOW: NotificationType.FOLLOW,
    RECIPE_APPROVED: NotificationType.RECIPE_APPROVED,
    RECIPE_REJECTED: NotificationType.RECIPE_REJECTED,
    NEW_RECIPE: NotificationType.NEW_RECIPE,
    SYSTEM: NotificationType.SYSTEM,
    REPORT: NotificationType.REPORT,
    PUBLIC: NotificationType.PUBLIC,
  };
  return typeMap[serverType.toUpperCase()] || NotificationType.SYSTEM;
};

// Xây dựng URL WebSocket
const getWebSocketUrl = (baseUrl: string): string => {
  let wsUrl = baseUrl;
  if (!wsUrl.startsWith("http://") && !wsUrl.startsWith("https://")) {
    wsUrl = `http://${wsUrl}`;
  }
  if (wsUrl.startsWith("https://")) {
    return wsUrl.replace("https://", "wss://") + "/ws";
  }
  return wsUrl.replace("http://", "ws://") + "/ws";
};

// Khởi tạo WebSocket với STOMP
export const initializeWebSocket = async (
  onNewNotification: (notification: NotificationItem) => void
): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.error("No auth token found for WebSocket connection");
      return false;
    }
    console.log("Using auth token for WebSocket:", token);

    if (stompClient?.connected) {
      await disconnectWebSocket();
    }

    const wsUrl = API_BASE_URL.replace(/^ws/, "http") + "/ws";
    console.log("WebSocket URL:", wsUrl);

    const socket = new SockJS(wsUrl);
    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("WebSocket connection established:", frame);
      recipeLikesSubscription = stompClient?.subscribe(
        "/topic/recipe-likes",
        (message) => {
          console.log("🔥 Subscription active for /topic/recipe-likes");
          console.log("Raw message body:", message.body);
          try {
            const data = JSON.parse(message.body);
            console.log("🔥 Received like update:", data);
            const { updateRecipeLikes } = useRecipeStore.getState();
            console.log(
              `Calling updateRecipeLikes with recipeId: ${data.recipeId}, totalLikes: ${data.totalLikes}`
            );
            updateRecipeLikes(data.recipeId, data.totalLikes);
          } catch (error) {
            console.error("Error processing recipe likes update:", error);
          }
        }
      );
      console.log(
        "Subscribed to /topic/recipe-likes:",
        recipeLikesSubscription
      );

      privateSubscription = stompClient?.subscribe(
        "/user/queue/notifications",
        (message) => {
          console.log("🔥 Subscription active for /user/queue/notifications");
          console.log("Raw message body:", message.body);
          try {
            const response = JSON.parse(message.body);
            console.log("Received private notification (raw):", response);

            const notification: NotificationItem = {
              id: response.id,
              type: mapServerTypeToEnum(response.type),
              title: response.title,
              message: response.message || response.content,
              isRead: response.readStatus ?? false,
              dismissed: response.dismissed ?? false,
              createdAt: normalizeDateTime(
                response.date,
                response.time || response.createdAt || response.timestamp
              ),
              sender: response.senderUsername
                ? {
                    id: response.senderId || "",
                    userName: response.senderUsername,
                    avatar:
                      response.senderAvatar || "https://via.placeholder.com/50",
                  }
                : undefined,
              recipe: response.recipe || undefined,
              actionUrl: response.actionUrl || undefined,
              recipientUsername: response.recipientUsername,
              recipientId: response.recipientId,
              onlyForAdmin: response.onlyForAdmin || false,
              onlyForUser: response.onlyForUser,
            };

            console.log(
              "Processed private notification createdAt:",
              notification.createdAt
            );
            onNewNotification(notification);
          } catch (error) {
            console.error("Error processing private notification:", error);
          }
        }
      );
      console.log(
        "Subscribed to /user/queue/notifications:",
        privateSubscription
      );

      publicSubscription = stompClient?.subscribe(
        "/topic/notifications",
        (message) => {
          console.log("🔥 Subscription active for /topic/notifications");
          console.log("Raw message body:", message.body);
          try {
            const response = JSON.parse(message.body);
            console.log("Received public notification (raw):", response);

            const notification: NotificationItem = {
              id: response.id,
              type: mapServerTypeToEnum(response.type),
              title: response.title,
              message: response.message || response.content,
              isRead: response.readStatus ?? false,
              dismissed: response.dismissed ?? false,
              createdAt: normalizeDateTime(
                response.date,
                response.time || response.createdAt || response.timestamp
              ),
              sender: response.senderUsername
                ? {
                    id: response.senderId || "",
                    userName: response.senderUsername,
                    avatar:
                      response.senderAvatar || "https://via.placeholder.com/50",
                  }
                : undefined,
              recipe: response.recipe || undefined,
              actionUrl: response.actionUrl || undefined,
              recipientUsername: response.recipientUsername,
              recipientId: response.recipientId,
              onlyForAdmin:
                response.onlyForAdmin ||
                response.type === "NEW_RECIPE" ||
                response.type === "RECIPE_APPROVED" ||
                response.type === "RECIPE_REJECTED" ||
                response.recipientUsername === "admin" ||
                (response.message &&
                  response.message.includes("đang chờ duyệt")) ||
                (response.title && response.title.includes("đang chờ duyệt")),
              onlyForUser: response.onlyForUser,
            };

            console.log(
              "Processed public notification createdAt:",
              notification.createdAt
            );
            onNewNotification(notification);
          } catch (error) {
            console.error("Error processing public notification:", error);
          }
        }
      );
      console.log("Subscribed to /topic/notifications:", publicSubscription);
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers, frame.body);
    };

    stompClient.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
    };

    stompClient.activate();
    console.log("WebSocket activation initiated");
    return true;
  } catch (error) {
    console.error("Error initializing WebSocket:", error);
    return false;
  }
};

// Ngắt kết nối WebSocket
export const disconnectWebSocket = async (): Promise<boolean> => {
  try {
    if (privateSubscription) {
      privateSubscription.unsubscribe();
      privateSubscription = null;
    }
    if (publicSubscription) {
      publicSubscription.unsubscribe();
      publicSubscription = null;
    }
    if (stompClient?.connected) {
      await stompClient.deactivate();
      console.log("WebSocket connection closed");
    }
    stompClient = null;
    return true;
  } catch (error) {
    console.error("Error disconnecting WebSocket:", error);
    return false;
  }
};

// Lấy danh sách thông báo (REST API)
export const getNotifications = async (
  page = 0,
  size = 10,
  userInfo?: { username: string }
): Promise<{
  content: NotificationItem[];
  totalPages: number;
  totalElements: number;
}> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (userInfo?.username) {
    queryParams.append("username", userInfo.username);
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Raw API response:", JSON.stringify(data, null, 2));

  const notifications = data.result.content.map((item: any) => {
    console.log("Processing notification item:", item);

    const notification: NotificationItem = {
      id: item.id,
      type: mapServerTypeToEnum(item.type || item.notificationType),
      title: item.title,
      message: item.message || item.content,
      isRead: item.readStatus ?? item.isRead ?? false,
      dismissed: item.dismissed ?? false,
      createdAt: normalizeDateTime(
        item.date,
        item.time || item.createdAt || item.timestamp
      ),
      sender: item.senderUsername
        ? {
            id: item.senderId || "",
            userName: item.senderUsername,
            avatar: item.senderAvatar || "https://via.placeholder.com/50",
          }
        : undefined,
      recipe: item.recipe || undefined,
      actionUrl: item.actionUrl || undefined,
      recipientUsername: item.recipientUsername,
      recipientId: item.recipientId,
      onlyForAdmin:
        item.onlyForAdmin ||
        item.type === "NEW_RECIPE" ||
        item.type === "RECIPE_APPROVED" ||
        item.type === "RECIPE_REJECTED" ||
        item.recipientUsername === "admin" ||
        (item.message && item.message.includes("đang chờ duyệt")) ||
        (item.title && item.title.includes("đang chờ duyệt")),
      onlyForUser: item.onlyForUser,
    };

    console.log("Processed notification:", notification);
    return notification;
  });

  return {
    content: notifications,
    totalPages: data.result.totalPages,
    totalElements: data.result.totalElements,
  };
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  const token = await getAuthToken();
  console.log("Using token for markNotificationAsRead:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers,
    }
  );

  return response.ok;
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async (): Promise<void> => {
  const token = await getAuthToken();
  console.log("Using token for markAllNotificationsAsRead:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PUT",
    headers,
  });

  await handleResponse(response);
};

// Ẩn thông báo
export const dismissNotification = async (
  notificationId: string
): Promise<boolean> => {
  const token = await getAuthToken();
  console.log("Using token for dismissNotification:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/dismiss`,
      {
        method: "PUT",
        headers,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Dismiss failed with status: ${response.status}, Error: ${errorText}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error during dismiss request:", error);
    return false;
  }
};

// Lấy danh sách thông báo đã ẩn
export const getDismissedNotifications = async (
  page = 0,
  size = 10
): Promise<{
  content: NotificationItem[];
  totalPages: number;
  totalElements: number;
}> => {
  const token = await getAuthToken();
  console.log("Using token for getDismissedNotifications:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/dismissed?page=${page}&size=${size}`,
    {
      method: "GET",
      headers,
    }
  );

  const data = await handleResponse(response);
  const notifications = data.content.map((item: any) => ({
    id: item.id,
    type: mapServerTypeToEnum(item.type),
    title: item.title,
    message: item.message || item.content,
    isRead: item.readStatus ?? false,
    dismissed: item.dismissed ?? true,
    createdAt: normalizeDateTime(
      item.date,
      item.time || item.createdAt || item.timestamp
    ),
    sender: item.senderUsername
      ? {
          id: item.senderId || "",
          userName: item.senderUsername,
          avatar: item.senderAvatar || "https://via.placeholder.com/50",
        }
      : undefined,
    recipe: item.recipe || undefined,
    actionUrl: item.actionUrl || undefined,
  }));

  return {
    content: notifications,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
  };
};

// Bỏ ẩn thông báo
export const unhideNotification = async (
  notificationId: string
): Promise<boolean> => {
  const token = await getAuthToken();
  console.log("Using token for unhideNotification:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/unhide`,
    {
      method: "PUT",
      headers,
    }
  );

  return response.ok;
};

// Lấy thống kê thông báo
export const getNotificationStats = async (): Promise<{
  [key: string]: number;
}> => {
  const token = await getAuthToken();
  console.log("Using token for getNotificationStats:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
    method: "GET",
    headers,
  });

  return handleResponse(response);
};

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const result = await getNotifications(0, 50);
    return result.content.filter((item) => !item.isRead && !item.dismissed)
      .length;
  } catch (error) {
    console.error("Failed to get unread notifications count:", error);
    return 0;
  }
};

// Mẫu thông báo cho mục đích test
export const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    type: NotificationType.LIKE,
    title: "Có người thích bình luận của bạn",
    message: "BếpTrưởngTậpSự đã thích bình luận của bạn về món Bánh Mì Ram Ram",
    isRead: false,
    dismissed: false,
    createdAt: "2025-06-27T14:25:00Z", // Cập nhật theo thời gian hiện tại
    sender: {
      id: "1",
      userName: "BếpTrưởngTậpSự",
      avatar: "https://via.placeholder.com/50",
    },
    recipe: { id: "1", title: "Bánh Mì Ram Ram" },
    actionUrl: "/recipe/1/comments",
    recipientUsername: undefined,
    onlyForAdmin: undefined,
    onlyForUser: undefined,
  },
  {
    id: "2",
    type: NotificationType.COMMENT,
    title: "Bình luận mới",
    message: "ĐầuBếpNhíNhố đã bình luận về công thức Phở Bò của bạn",
    isRead: false,
    dismissed: false,
    createdAt: "2025-06-27T14:24:00Z", // Cập nhật theo thời gian hiện tại
    sender: {
      id: "2",
      userName: "ĐầuBếpNhíNhố",
      avatar: "https://via.placeholder.com/50",
    },
    recipe: { id: "2", title: "Phở Bò" },
    actionUrl: "/recipe/2/comments",
    recipientUsername: undefined,
    onlyForAdmin: undefined,
    onlyForUser: undefined,
  },
];

// Hàm lấy userInfo từ token
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
    console.log("JWT Payload:", payload); // In payload để kiểm tra

    // Xử lý trường scope để trích xuất roles
    const roles = payload.scope
      ? payload.scope
          .split(" ")
          .filter((role: string) => role.startsWith("ROLE_"))
          .map((role: string) => role.replace("ROLE_", ""))
      : payload.roles || payload.authorities || [];

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
