import AccountBanner from '@/components/AccountBanner';
import LogoutModal from '@/components/LogoutModal';
import AccountNav from '@/components/ui/navigation/AccountNav';
import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { sampleAccounts } from '@/services/types/AccountItem';
import { sampleComments } from '@/services/types/CommentItem';
import { sampleFavorites } from '@/services/types/FavoritesRecipe';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Xử lý logic đăng xuất ở đây
    console.log('Đăng xuất thành công');
    setShowLogoutModal(false);
    // router.replace('/login') hoặc logic đăng xuất khác
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF5D00" />
      </TouchableOpacity>
      
      <AccountBanner 
        account={sampleAccounts[0]}
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
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flex: 1, 
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  },
})

export default ProfileScreen