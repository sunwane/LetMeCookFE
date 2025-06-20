import FormInput from '@/components/FormInput';
import { sampleAccounts } from '@/services/types/AccountItem';
import { 
  requestPasswordResetAPI, 
  resetPasswordAPI, 
  ResetPasswordRequest 
} from '@/services/types/AccountItem';
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
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: currentUser.email || 'user@gmail.com',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle form data change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  // ✅ Send verification code for password reset
  const handleSendVerificationCode = async () => {
    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return;
    }

    setIsSendingCode(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔥 Sending reset code to:', formData.email);
      const result = await requestPasswordResetAPI(formData.email);
      console.log('✅ Reset code sent:', result);

      setCodeSent(true);
      setSuccessMessage('✅ Mã xác nhận đã được gửi đến email của bạn');
      setError('');
    } catch (error) {
      console.error('❌ Send reset code error:', error);
      setError('❌ Gửi mã xác nhận thất bại. Vui lòng kiểm tra email');
      setSuccessMessage('');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Validate form
  const validateForm = () => {
    // Kiểm tra email
    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }

    // Kiểm tra mã xác nhận
    if (!formData.verificationCode.trim()) {
      setError('Vui lòng nhập mã xác nhận');
      return false;
    }

    // Kiểm tra mật khẩu mới
    if (!formData.newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }

    if (formData.newPassword.length < 7) {
      setError('Mật khẩu mới phải có ít nhất 7 ký tự');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  // ✅ Handle save with existing reset password API
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const resetPasswordData: ResetPasswordRequest = {
        email: formData.email.trim(),
        code: formData.verificationCode.trim(),
        newPassword: formData.newPassword,
      };

      console.log('🔥 Resetting password:', {
        email: resetPasswordData.email,
        code: resetPasswordData.code,
      });
      
      const result = await resetPasswordAPI(resetPasswordData);
      console.log('✅ Password reset successfully:', result);

      setSuccessMessage('✅ Đổi mật khẩu thành công!');
      setError('');

      // Reset form after successful change
      setFormData(prev => ({
        ...prev,
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setCodeSent(false);

      // Show success alert
      Alert.alert(
        'Thành công',
        'Mật khẩu đã được đổi thành công!',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('❌ Reset password error:', error);
      setError('❌ Đổi mật khẩu thất bại. Vui lòng kiểm tra mã xác nhận');
      setSuccessMessage('');
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
        <View style={styles.list}>
          <FormInput 
            label='Email' 
            defaultValue={formData.email}
            type='email'
            onChangeText={(value) => handleInputChange('email', value)}
            editable={!isLoading && !isSendingCode}
          />
          
          <FormInput 
            label='Mã xác nhận' 
            defaultValue={formData.verificationCode}
            type='code'
            placeholder='Nhập mã'
            onChangeText={(value) => handleInputChange('verificationCode', value)}
            onSendCode={handleSendVerificationCode} // ✅ Pass function để gửi mã
          />

          <FormInput 
            label='Mật khẩu mới' 
            defaultValue={formData.newPassword}
            type='password'
            placeholder='Nhập mật khẩu mới'
            onChangeText={(value) => handleInputChange('newPassword', value)}
            editable={!isLoading}
          />
          <FormInput 
            label='Xác nhận mật khẩu mới' 
            defaultValue={formData.confirmPassword}
            type='password'
            placeholder='Nhập lại mật khẩu mới'
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
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
            {isLoading ? 'Đang đổi mật khẩu...' : 'Lưu thông tin'}
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
  },
  bottomPadding: {
    height: 20,
  }
});