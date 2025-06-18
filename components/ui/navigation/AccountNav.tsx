import ActivitiesTab from '@/app/ActivitiesTab';
import FavoritesTab from '@/app/FavoritesTab';
import ProfileTab from '@/app/ProfileTab';
import '@/config/globalTextConfig'; // Import để áp dụng cấu hình toàn cục cho Text và TextInput
import { AccountItem } from '@/services/types/AccountItem';
import { CommentItem } from '@/services/types/CommentItem';
import { FavoritesRecipe } from '@/services/types/FavoritesRecipe';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface AccountNavProps {
  comments: CommentItem[];
  favorites: FavoritesRecipe[];
  account: AccountItem[];
  isCurrentUser?: boolean; // Thêm prop
}

const TABS = [
  { id: 'activities', label: 'Hoạt động nổi bật' },
  { id: 'favorites', label: 'Công thức yêu thích' },
  { id: 'profile', label: 'Thông tin cá nhân' },
]

const AccountNav = ({ comments, favorites, account, isCurrentUser = false }: AccountNavProps) => {
  const [activeTab, setActiveTab] = useState('activities')

  const renderContent = () => {
    const currentUserId = account[0]?.id;
    
    switch (activeTab) {
      case 'profile':
        return <ProfileTab account={account[0]} isCurrentUser={isCurrentUser} />;
      case 'activities':
        return <ActivitiesTab comments={comments} currentUserId={currentUserId} />
      case 'favorites':
        return <FavoritesTab favorites={favorites} currentUserId={currentUserId} />
      default:
        return <ProfileTab account={account[0]} isCurrentUser={isCurrentUser} />;
    }
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1, // Make content container take remaining space
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomColor: '#cecece',
    borderBottomWidth: 1,
    shadowColor: '#333',
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'white',
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7A2917',
  },
  tabText: {
    fontSize: 13,
    color: '#666666',
  },
  activeTabText: {
    color: '#7A2917',
    fontWeight: '600',
  },
})

export default AccountNav