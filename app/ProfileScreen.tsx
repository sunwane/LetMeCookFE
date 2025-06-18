import AccountBanner from '@/components/AccountBanner';
import LogoutModal from '@/components/LogoutModal';
import AccountNav from '@/components/ui/navigation/AccountNav';
import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { sampleAccounts } from '@/services/types/AccountItem';
import { sampleComments } from '@/services/types/CommentItem';
import { sampleFavorites } from '@/services/types/FavoritesRecipe';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Giả sử user hiện tại là sampleAccounts[0] (có thể lấy từ context/state)
  const currentUser = sampleAccounts[0];
  
  // Lọc comments và favorites của user hiện tại
  const currentUserComments = sampleComments.filter(comment => 
    comment.account.id === currentUser.id
  );
  
  const currentUserFavorites = sampleFavorites.filter(favorite => 
    favorite.account.id === currentUser.id
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Xử lý logic đăng xuất ở đây
    console.log('Đăng xuất thành công');
    setShowLogoutModal(false);
    // router.replace('/login') hoặc logic đăng xuất khác
  };

  // Thêm handler cho nút sửa thông tin
  const handleEditAccount = () => {
    router.push('/EditAccountScreen');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Container chứa hai nút ở góc trên */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditAccount}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={20} color="#FF5D00" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF5D00" />
        </TouchableOpacity>
      </View>
      
      <AccountBanner 
        account={currentUser}
        comments={currentUserComments}
      />
      <View style={styles.navContainer}>
        <AccountNav 
          comments={currentUserComments}
          favorites={currentUserFavorites}
          account={[currentUser]}
          isCurrentUser={true}
        />
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
};

// Cập nhật styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flex: 1, 
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 20, // Điều chỉnh theo status bar
    right: 20,
    flexDirection: 'row',
    zIndex: 1000,
    gap: 10,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
})

export default ProfileScreen;