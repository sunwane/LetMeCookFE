import FormInput from '@/components/FormInput'
import SectionTitle from '@/components/SectionTitle'
import { AccountItem } from '@/services/types/AccountItem'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const EditInforScreen = () => {
  const params = useLocalSearchParams();
  const account: AccountItem = JSON.parse(params.account as string);

  const dietOptions = [
    'Ăn chay',
    'Ăn kiêng giảm cân',
    'Ăn kiêng Keto',
    'Ăn kiêng Địa Trung Hải',
    'Ăn uống bình thường',
    'Ăn kiêng ít carb',
  ]

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title='Thông tin cơ bản'/>
        <View style={styles.list}>
          <FormInput 
            label='Tên hiển thị' 
            defaultValue={account.userName}
          />
          <FormInput 
            label='Giới tính' 
            defaultValue={account.sex} 
            type='sex'
          />
          <FormInput 
            label='Ngày sinh' 
            defaultValue={account.userBirthday} 
            type='date'
          />
          <FormInput 
            label='Chiều cao' 
            defaultValue={account.height.toString()} 
            type='number'
          />
          <FormInput 
            label='Cân nặng' 
            defaultValue={account.weight.toString()} 
            type='number'
          />
        </View>

        <SectionTitle title='Chế độ ăn uống & sức khỏe'/>
        <View style={styles.list}>
          <FormInput 
            label='Chế độ ăn' 
            defaultValue={account.diet} 
            type='select' 
            options={dietOptions}
          />
        </View>
        <TouchableOpacity 
          style={styles.button}
        >
          <Text style={styles.buttonName}>Lưu thông tin</Text>
        </TouchableOpacity>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditInforScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  list: {
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF5D00',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  },
  bottomPadding: {
    height: 20 // Thêm padding dưới cùng để tránh nút bị che khi scroll
  }
})