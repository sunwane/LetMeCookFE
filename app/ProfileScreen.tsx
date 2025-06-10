import AccountBanner from '@/components/AccountBanner'
import AccountNav from '@/navigation/AccountNav'
import { sampleAccounts } from '@/services/types/AccountItem'
import { sampleComments } from '@/services/types/CommentItem'
import { sampleFavorites } from '@/services/types/FavoritesRecipe'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flex: 1, 
  }
})

export default ProfileScreen