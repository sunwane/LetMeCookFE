import AccountBanner from '@/components/AccountBanner';
import LogoutModal from '@/components/LogoutModal';
import AccountNav from '@/components/ui/navigation/AccountNav';
import '@/config/globalTextConfig';
import { sampleAccounts } from '@/services/types/AccountItem';
import { sampleComments } from '@/services/types/CommentItem';
import { sampleFavorites } from '@/services/types/FavoritesRecipe';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { logoutAPI } from '../services/types/auth';

const ProfileScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // ✅ Get token from AsyncStorage
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (authToken) {
        console.log('🚪 Logging out with token...');
        
        // ✅ Call logout API
        await logoutAPI({ token: authToken });
        console.log('✅ Logout API success');
      } else {
        console.log('⚠️ No token found, skipping API call');
      }
      
      // ✅ Clear all stored data
      await AsyncStorage.multiRemove([
        'authToken',
        'userEmail', 
        'userPassword',
        'refreshToken'
      ]);
      
      console.log('✅ Cleared AsyncStorage');
      
      // ✅ Navigate to login
      router.replace('/');
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      
      // ✅ Even if API fails, still clear local data and redirect
      await AsyncStorage.multiRemove([
        'authToken',
        'userEmail',
        'userPassword', 
        'refreshToken'
      ]);
      
      Alert.alert(
        'Đăng xuất',
        'Có lỗi xảy ra nhưng bạn đã được đăng xuất khỏi thiết bị này.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
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
      // ✅ This will trigger AccountBanner to refetch recipe count
      console.log('🔄 Refreshing profile data...');
      // You can add any additional refresh logic here
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handle navigation to notification screen
  const handleNotification = () => {
    router.push('/NotificationScreen');
  };

  // Handle navigation to setting screen
  const handleSettings = () => {
    router.push('/SettingScreen');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Container chứa hai nút ở góc trên */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={handleNotification}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color="#FF5D00" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettings}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={20} color="#FF5D00" />
        </TouchableOpacity>
      </View>
      
      <AccountBanner 
        comments={sampleComments}
      />
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
        isLoading={isLoggingOut} // ✅ Pass loading state to modal
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flex: 1, 
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    zIndex: 1000,
    gap: 10,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 93, 0, 0.1)',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 93, 0, 0.1)',
  },
});

export default ProfileScreen;