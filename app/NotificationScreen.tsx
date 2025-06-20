import '@/config/globalTextConfig';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const NotificationScreen = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'like',
      title: 'Lượt thích mới',
      message: 'Người dùng ABC đã thích công thức "Phở Bò" của bạn',
      time: '2 giờ trước',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      title: 'Bình luận mới',
      message: 'Người dùng XYZ đã bình luận về công thức "Bánh Mì" của bạn',
      time: '1 ngày trước',
      read: true,
    },
    {
      id: 3,
      type: 'follow',
      title: 'Người theo dõi mới',
      message: 'Người dùng DEF đã bắt đầu theo dõi bạn',
      time: '3 ngày trước',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return 'heart';
      case 'comment':
        return 'chatbubble';
      case 'follow':
        return 'person-add';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return '#FF6B6B';
      case 'comment':
        return '#4ECDC4';
      case 'follow':
        return '#45B7D1';
      default:
        return '#FF5D00';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <View 
              key={notification.id} 
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: `${getNotificationColor(notification.type)}15` }
              ]}>
                <Ionicons 
                  name={getNotificationIcon(notification.type)} 
                  size={24} 
                  color={getNotificationColor(notification.type)} 
                />
              </View>
              
              <View style={styles.notificationContent}>
                <Text style={[
                  styles.notificationTitle,
                  !notification.read && styles.unreadText
                ]}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {notification.time}
                </Text>
              </View>
              
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>Chưa có thông báo</Text>
            <Text style={styles.emptyMessage}>
              Các thông báo về hoạt động của bạn sẽ xuất hiện ở đây
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
  content: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
    borderColor: '#e5e7ff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5D00',
    position: 'absolute',
    top: 18,
    right: 15,
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