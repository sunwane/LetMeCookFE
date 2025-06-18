import AccountBanner from '@/components/AccountBanner';
import AccountNav from '@/components/ui/navigation/AccountNav';
import '@/config/globalTextConfig';
import { sampleAccounts } from '@/services/types/AccountItem';
import { sampleComments } from '@/services/types/CommentItem';
import { sampleFavorites } from '@/services/types/FavoritesRecipe';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const UserProfile = () => {
  const { userId } = useLocalSearchParams();
  
  // Chuyển userId thành number nếu cần
  const userIdNumber = userId ? parseInt(userId as string) : null;
  
  // Tìm user theo ID
  const userAccount = sampleAccounts.find(acc => 
    acc.id === userIdNumber || acc.id.toString() === userId
  ) || sampleAccounts[0];
  
  // Lấy comments của user này
  const userComments = sampleComments.filter(comment => 
    comment.account.id === userIdNumber || 
    comment.account.id.toString() === userId
  );

  // Lấy favorites của user này
  const userFavorites = sampleFavorites.filter(favorite => 
    favorite.account.id === userIdNumber || 
    favorite.account.id.toString() === userId
  );

  return (
    <View style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5D00" />
      </TouchableOpacity>
      
      <AccountBanner 
        account={userAccount}
        comments={userComments}
      />
      
      <View style={styles.navContainer}>
        <AccountNav 
          comments={userComments}
          favorites={userFavorites} // Truyền favorites đã lọc
          account={[userAccount]}
          isCurrentUser={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navContainer: {
    flex: 1, 
  },
  backButton: {
    position: 'absolute',
    top: 50, // Điều chỉnh theo status bar
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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

export default UserProfile