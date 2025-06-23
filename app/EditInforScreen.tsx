import FormInput from '@/components/FormInput'
import SectionTitle from '@/components/SectionTitle'
import { AccountItem } from '@/services/types/AccountItem'
import { UserInfoUpdateRequest, updateUserInfoAPI } from '@/services/types/UserInfo' // ✅ ADD import
import { useLocalSearchParams, useRouter } from 'expo-router' // ✅ ADD useRouter
import React, { useState } from 'react'
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
  const router = useRouter(); // ✅ ADD router
  const account: AccountItem = JSON.parse(params.account as string);
  const userInfoId = params.userInfoId as string; // ✅ ADD userInfoId

  // ✅ FIX: Updated formData structure
  const [formData, setFormData] = useState({
    userName: account.userName,
    sex: account.sex,
    age: account.age?.toString() || '25', 
    height: account.height?.toString() || '',
    weight: account.weight?.toString() || '',
    dietTypes: account.dietTypes || [], 
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIX: Map diet options correctly - swap label and value
  const dietOptions = [
    { label: 'Ăn chay', value: 'VEGETARIAN' },
    { label: 'Ăn kiêng Keto', value: 'KETO' },
    { label: 'Ăn kiêng Địa Trung Hải', value: 'MEDITERRANEAN' },
    { label: 'Ăn uống bình thường', value: 'NORMAL' },
    { label: 'Ăn kiêng ít carb', value: 'LOW_CARB' },
    { label: 'Ăn kiêng', value: 'DIET' },

  ];

  // ✅ ADD: Handle input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ ADD: Form validation
  const validateForm = (): boolean => {
    if (!formData.sex) {
      setError('Vui lòng chọn giới tính');
      return false;
    }
    if (!formData.height || parseInt(formData.height) <= 0) {
      setError('Vui lòng nhập chiều cao hợp lệ');
      return false;
    }
    if (!formData.weight || parseInt(formData.weight) <= 0) {
      setError('Vui lòng nhập cân nặng hợp lệ');
      return false;
    }
    if (!formData.age || parseInt(formData.age) <= 0) {
      setError('Vui lòng nhập tuổi hợp lệ');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const updateData: UserInfoUpdateRequest = {
        sex: formData.sex || undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        dietTypes: formData.dietTypes?.length > 0 ? formData.dietTypes : undefined,
      };

      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      console.log('🔥 Updating:', cleanedData);
      
      const result = await updateUserInfoAPI(userInfoId, cleanedData);
      console.log('✅ Updated successfully:', result);

      setSuccessMessage('✅ Cập nhật thông tin thành công!');
      
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (error) {
      console.error('❌ Update failed:', error);
      setError('❌ Cập nhật thông tin thất bại. Vui lòng thử lại');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // EditInforScreen.tsx - render
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
          {/* <FormInput 
            label='Tên hiển thị' 
            defaultValue={formData.userName}
            onChangeText={(value) => handleInputChange('userName', value)}
            editable={!isLoading}
          /> */}
          <FormInput 
            label='Giới tính' 
            defaultValue={formData.sex} 
            type='select'
            options={['Nam', 'Nữ']}
            onChangeText={(value) => handleInputChange('sex', value)}
            editable={!isLoading}
          />
          <FormInput 
            label='Tuổi' 
            defaultValue={formData.age} 
            type='number'
            placeholder='Nhập tuổi'
            onChangeText={(value) => handleInputChange('age', value)}
            editable={!isLoading}
          />
          <FormInput 
            label='Chiều cao' 
            defaultValue={formData.height} 
            type='number'
            placeholder='cm'
            onChangeText={(value) => handleInputChange('height', value)}
            editable={!isLoading}
          />
          <FormInput 
            label='Cân nặng' 
            defaultValue={formData.weight} 
            type='number'
            onChangeText={(value) => handleInputChange('weight', value)}
            editable={!isLoading}
          />
        </View>

        <SectionTitle title='Chế độ ăn uống & sức khỏe'/>
        <View style={styles.list}>
          <FormInput 
            label='Chế độ ăn' 
            defaultValue={formData.dietTypes?.[0] || ''} 
            type='select' 
            options={dietOptions.map(opt => opt.label)} // ✅ Show Vietnamese labels
            onChangeText={(selectedLabel) => {
              // ✅ Convert Vietnamese label back to enum value
              const selectedOption = dietOptions.find(opt => opt.label === selectedLabel);
              const enumValue = selectedOption?.value || 'NORMAL';
              handleInputChange('dietTypes', [enumValue]);
            }}
            editable={!isLoading}
          />
        </View>

        {/* ✅ Error and Success Messages */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.buttonName}>
            {isLoading ? 'Đang lưu...' : 'Lưu thông tin'}
          </Text>
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  },
  bottomPadding: {
    height: 20,
  },
  errorText: {
    color: '#FF5722',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  }
})