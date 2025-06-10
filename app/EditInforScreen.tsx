import FormInput from '@/components/FormInput'
import SectionTitle from '@/components/SectionTitle'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const EditInforScreen = () => {
  return (
    <View style={styles.formContainer}>
      <SectionTitle title='Thông tin cơ bản'/>
      <View style={styles.list}>
        <FormInput label='Tên hiển thị' defaultValue=''/>
        <FormInput label='Giới tính' defaultValue='Nam' type='sex'/>
        <FormInput label='Ngày sinh' defaultValue='20/02/2024' type='date'/>
        <FormInput label='Chiều cao' defaultValue='' type='number'/>
        <FormInput label='Cân nặng' defaultValue='' type='number'/>
      </View>
      <SectionTitle title='Chế độ ăn uống & sức khỏe'/>
      <View>

      </View>
    </View>
  )
}

export default EditInforScreen

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  list: {
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  }
})