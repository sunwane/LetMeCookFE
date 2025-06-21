import OneNoti from '@/components/oneNoti';
import '@/config/globalTextConfig';
import {
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationItem,
  sampleNotifications
} from '@/services/types/NotificationItem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = getUnreadNotificationsCount();

  const handleNotificationPress = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      setNotifications([...sampleNotifications]); // Trigger re-render
    }
    
    // TODO: Navigate to appropriate screen based on actionUrl
    console.log('Navigate to:', notification.actionUrl);
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      'Đánh dấu tất cả đã đọc',
      'Bạn có chắc muốn đánh dấu tất cả thông báo là đã đọc?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          onPress: () => {
            markAllNotificationsAsRead();
            setNotifications([...sampleNotifications]);
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Custom Header */}
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

      {/* Filter and Actions */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            showUnreadOnly && styles.filterButtonActive
          ]}
          onPress={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          <Text style={[
            styles.filterButtonText,
            showUnreadOnly && styles.filterButtonTextActive
          ]}>
            {showUnreadOnly ? 'Hiện tất cả' : 'Chưa đọc'}
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
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>
              {showUnreadOnly ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}
            </Text>
            <Text style={styles.emptyMessage}>
              {showUnreadOnly 
                ? 'Tất cả thông báo đã được đọc'
                : 'Các thông báo về hoạt động của bạn sẽ xuất hiện ở đây'
              }
            </Text>
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
    backgroundColor: '#fff',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerBadge: {
    position: 'absolute',
    top: -8,
    right: -20,
    backgroundColor: '#FF5D00',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34, // Same width as back button
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#FF5D00',
    borderColor: '#FF5D00',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllButtonText: {
    fontSize: 14,
    color: '#FF5D00',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});