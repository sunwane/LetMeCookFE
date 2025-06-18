import FormInput from '@/components/FormInput';
import SectionTitle from '@/components/SectionTitle';
import { sampleAccounts } from '@/services/types/AccountItem';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const EditAccountScreen = () => {
  const navigation = useNavigation();
  
  // Lấy thông tin user hiện tại (có thể từ context hoặc params)
  const currentUser = sampleAccounts[0]; // Giả sử user đầu tiên là user hiện tại
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: currentUser.email || 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle form data change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    // Kiểm tra email
    if (!formData.email.includes('@')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    // Nếu muốn đổi mật khẩu
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại để xác thực');
        return false;
      }

      if (formData.newPassword.length < 6) {
        Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
        return false;
      }
    }

    return true;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Thành công',
        'Thông tin đăng nhập đã được cập nhật',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset password fields after successful save
              setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }));
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

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
        <SectionTitle title='Thông tin đăng nhập'/>
        <View style={styles.list}>
          <FormInput 
            label='Email' 
            defaultValue={formData.email}
            type='email'
            onChangeText={(value) => handleInputChange('email', value)}
          />
        </View>

        <SectionTitle title='Đổi mật khẩu'/>
        <View style={styles.list}>
          <FormInput 
            label='Mật khẩu hiện tại' 
            defaultValue={formData.currentPassword}
            type='password'
            placeholder='Nhập mật khẩu hiện tại'
            onChangeText={(value) => handleInputChange('currentPassword', value)}
          />
          <FormInput 
            label='Mật khẩu mới' 
            defaultValue={formData.newPassword}
            type='password'
            placeholder='Nhập mật khẩu mới'
            onChangeText={(value) => handleInputChange('newPassword', value)}
          />
          <FormInput 
            label='Xác nhận mật khẩu mới' 
            defaultValue={formData.confirmPassword}
            type='password'
            placeholder='Nhập lại mật khẩu mới'
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
          />
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            💡 Chỉ cần nhập mật khẩu hiện tại nếu bạn muốn đổi mật khẩu
          </Text>
        </View>

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
  );
};

export default EditAccountScreen;

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
  noteContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5D00',
    marginBottom: 20,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20 // Thêm padding dưới cùng để tránh nút bị che khi scroll
  }
});