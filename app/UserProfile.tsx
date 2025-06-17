import AccountBanner from '@/components/AccountBanner';
import AccountNav from '@/components/ui/navigation/AccountNav';
import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { sampleAccounts } from '@/services/types/AccountItem';
import { sampleComments } from '@/services/types/CommentItem';
import { sampleFavorites } from '@/services/types/FavoritesRecipe';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { StyleSheet, View } from 'react-native';

const UserProfile = () => {
  const params = useLocalSearchParams();
  const userId = parseInt(params.userId as string);
  
  // Tìm account dựa vào userId
  const account = sampleAccounts.find(acc => acc.id === userId) || sampleAccounts[0];
  
  // Filter comments và favorites của user này
  const userComments = sampleComments.filter(comment => comment.account.id === userId);
  const userFavorites = sampleFavorites.filter(favorite => favorite.account.id === userId);

  return (
    <View style={styles.container}>
      <AccountBanner 
        account={account}
        comments={userComments}
      />
      <View style={styles.navContainer}>
        <AccountNav 
          comments={userComments}
          favorites={userFavorites}
          account={[account]}
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
})

export default UserProfile