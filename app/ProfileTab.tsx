import InfoItem from '@/components/InfoItem'
import SectionTitle from '@/components/SectionTitle'
import { AccountItem } from '@/services/types/AccountItem'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ProfileTabProps {
  account: AccountItem;
  isCurrentUser?: boolean; // Thêm prop để phân biệt user hiện tại
}

const ProfileTab = ({ account, isCurrentUser = true }: ProfileTabProps) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionTitle title='Thông tin cơ bản'/>
      <View style={styles.list}>
        <InfoItem label='Giới tính' value={account.sex} />
        <InfoItem label='Tuổi' value={account.age.toString()} />
        <InfoItem label='Ngày sinh' value={account.userBirthday} />
        <InfoItem label='Chiều cao' value={`${account.height} cm`} />
        <InfoItem label='Cân nặng' value={`${account.weight} kg`} />
      </View>
      <SectionTitle title='Chế độ ăn uống & sức khỏe'/>
      <View style={styles.list}>
        <InfoItem label='Chế độ ăn' value={account.diet} badgeType='diet' />
        <InfoItem label='Tình trạng sức khỏe' value={account.healthStatus} badgeType='health' />
      </View>
      
      {/* Chỉ hiển thị nút sửa khi là user hiện tại */}
      {isCurrentUser && (
        <TouchableOpacity 
          style={styles.edit}
          onPress={() => router.push({
            pathname: '/EditInforScreen',
            params: { account: JSON.stringify(account) }
          })}
        >
          <Text style={styles.buttonName}>Chỉnh sửa thông tin cá nhân</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

export default ProfileTab

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  edit: {
    backgroundColor: '#FF5D00',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  buttonName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  }
})