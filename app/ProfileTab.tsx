import InfoItem from '@/components/InfoItem'
import SectionTitle from '@/components/SectionTitle'
import { AccountItem } from '@/services/types/AccountItem'
import { getUserInfoAPI, UserInfoResponse } from '@/services/types/UserInfo'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';

interface ProfileTabProps {
  account?: AccountItem; // Optional fallback data
  isCurrentUser?: boolean;
}

const ProfileTab = ({ account, isCurrentUser = true }: ProfileTabProps) => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ ADD: Listen for refresh params
  const params = useLocalSearchParams();
  const refreshTrigger = params.refresh;
  const wasUpdated = params.updated;

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching fresh user info...');
      const result = await getUserInfoAPI();
      console.log('📊 Fresh data received:', result);
      setUserInfo(result);
    } catch (error) {
      console.error('❌ Error fetching user info:', error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // ✅ Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔍 ProfileTab focused - refreshing data...');
      fetchUserInfo();
    }, [])
  );

  // ✅ Refresh when params change
  useEffect(() => {
    if (refreshTrigger || wasUpdated) {
      console.log('🔄 Refresh triggered by params:', { refreshTrigger, wasUpdated });
      fetchUserInfo();
    }
  }, [refreshTrigger, wasUpdated]);

  const formatDietTypes = (dietTypes: string[]): string => {
    return dietTypes?.join(', ') || 'Không có';
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // ✅ Ưu tiên userInfo, fallback về account
  const displayData = userInfo || account;

  if (loading && !account) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5D00" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!displayData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Chưa có thông tin</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent} // ✅ ADD: Content container style
    >
      <SectionTitle title='Thông tin cơ bản'/>
      <View style={styles.list}>
        <InfoItem 
          label='Giới tính' 
          value={userInfo?.sex || account?.sex || 'Chưa cập nhật'} 
        />
        <InfoItem 
          label='Tuổi' 
          value={userInfo?.age?.toString() || account?.age?.toString() || 'Chưa cập nhật'} 
        />
        <InfoItem 
          label='Chiều cao' 
          value={userInfo?.height ? `${userInfo.height} cm` : (account?.height ? `${account.height} cm` : 'Chưa cập nhật')} 
        />
        <InfoItem 
          label='Cân nặng' 
          value={userInfo?.weight ? `${userInfo.weight} kg` : (account?.weight ? `${account.weight} kg` : 'Chưa cập nhật')} 
        />
      </View>
      
      <SectionTitle title='Chế độ ăn uống & sức khỏe'/>
      <View style={styles.list}>
        <InfoItem 
          label='Chế độ ăn' 
          value={userInfo?.dietTypes ? formatDietTypes(userInfo.dietTypes) : (account?.diet || 'Chưa cập nhật')} 
          badgeType='diet' 
        />
      </View>
      
      {/* ✅ DEBUG: Always show button first để test */}
      <TouchableOpacity 
        style={styles.edit}
        onPress={() => {
          console.log('✅ Edit button pressed');
          console.log('📝 UserInfo ID:', userInfo?.id);
          console.log('📝 Account data:', userInfo || account);
          
          router.push({
            pathname: '/EditInforScreen',
            params: { 
              account: JSON.stringify(userInfo || account),
              userInfoId: userInfo?.id 
            }
          });
        }}
      >
        <Text style={styles.buttonName}>Chỉnh sửa thông tin cá nhân</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ProfileTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  list: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  edit: {
    backgroundColor: '#FF5D00',
    paddingVertical: 12, 
    borderRadius: 10,
    marginTop: 20, 
    marginBottom: 30, 
    marginHorizontal: 10, 
  },
  buttonName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
})