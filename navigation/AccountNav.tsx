import ActivitiesTab from '@/app/ActivitiesTab'
import FavoritesTab from '@/app/FavoritesTab'
import ProfileTab from '@/app/ProfileTab'
import { CommentItem } from '@/services/types/CommentItem'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface AccountNavProps {
  comments: CommentItem[];
}

const TABS = [
  { id: 'activities', label: 'Hoạt động nổi bật' },
  { id: 'favorites', label: 'Công thức yêu thích' },
  { id: 'profile', label: 'Thông tin cá nhân' },
]

const AccountNav = ({ comments }: AccountNavProps) => {
  const [activeTab, setActiveTab] = useState('activities')

  const renderContent = () => {
    switch (activeTab) {
      case 'activities':
        return <ActivitiesTab comments={comments} />
      case 'favorites':
        return <FavoritesTab />
      case 'profile':
        return <ProfileTab />
      default:
        return <ActivitiesTab comments={comments} />
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
      <ScrollView style={styles.container}>
        {renderContent()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#7A2917',
    fontWeight: '600',
  },
})

export default AccountNav