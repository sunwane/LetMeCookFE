import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormInputProps {
  label: string;
  defaultValue?: string;
  type?: 'text' | 'number' | 'date' | 'sex' | 'select' | 'email' | 'password' | 'code';
  options?: string[];
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onSendCode?: () => void; // Thêm prop cho việc gửi mã
  editable?: boolean; // Thêm prop editable
}

const FormInput = ({ 
  label, 
  defaultValue = '', 
  type = 'text', 
  options, 
  placeholder,
  onChangeText,
  onSendCode,
  editable = true,
  ...props 
}: FormInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Khởi tạo date từ defaultValue nếu là kiểu date
  const [date, setDate] = useState(() => {
    if (type === 'date' && defaultValue) {
      const parts = defaultValue.split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
    return new Date();
  });

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
      setValue(currentDate.toLocaleDateString('vi-VN'));
    } else {
      setShowDatePicker(false);
    }
  };

  // FormInput.tsx - Fix các handlers
  const handleValueChange = (newValue: string) => {
    console.log('📝 FormInput handleValueChange:', {
      label,
      oldValue: value,
      newValue,
      hasCallback: !!onChangeText
    });
    
    setValue(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
  };

  // Render input based on type
  const renderInput = () => {
    switch (type) {
      case 'code':
        return (
          <View style={styles.codeContainer}>
            <View style={styles.codeInputContainer}>
              <Ionicons name="shield-outline" size={20} color="#666" style={styles.codeIcon} />
              <TextInput
                style={styles.codeInput}
                value={value}
                onChangeText={handleValueChange}
                placeholder={placeholder || 'Nhập mã xác thực'}
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                editable={editable} // Thêm editable
              />
            </View>
            <TouchableOpacity
              style={styles.sendCodeButton}
              onPress={onSendCode}
              activeOpacity={0.8}
            >
              <Text style={styles.sendCodeText}>Gửi mã</Text>
            </TouchableOpacity>
          </View>
        );

      case 'email':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.emailInput]}
              value={value}
              onChangeText={handleValueChange}
              placeholder={placeholder || 'Nhập email'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={editable} // Thêm editable
            />
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
            </View>
          </View>
        );

      case 'password':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={value}
              onChangeText={handleValueChange}
              placeholder={placeholder || 'Nhập mật khẩu'}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={editable} // Thêm editable
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        );

      case 'number':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={value} // ✅ FIX: Dùng value thay vì defaultValue
              keyboardType="numeric"
              onChangeText={handleValueChange} // ✅ FIX: Dùng handleValueChange
              editable={editable} // Thêm editable
            />
            <Text style={styles.unit}>
              {label.toLowerCase().includes('cao') ? 'cm' : 'kg'}
            </Text>
          </View>
        );

      case 'date':
        return (
          <View>
            <TouchableOpacity 
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{value}</Text>
              <Image 
                source={require('@/assets/images/icons/Schedule.png')}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                // Custom theme cho iOS
                themeVariant="light"
                accentColor="#FF5D00"
              />
            )}
          </View>
        );

        case 'sex':
        return (
          <View style={styles.sexContainer}>
            <TouchableOpacity 
              style={[
                styles.sexButton,
                value === 'MALE' && styles.selectedSexButton // ✅ FIX: Đổi từ 'Nam' thành 'MALE'
              ]}
              onPress={() => handleValueChange('MALE')} // ✅ FIX: Dùng handleValueChange
            >
              <Text style={[
                styles.sexButtonText,
                value === 'MALE' && styles.selectedSexButtonText
              ]}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.sexButton,
                value === 'FEMALE' && styles.selectedSexButton // ✅ FIX: Đổi từ 'Nữ' thành 'FEMALE'
              ]}
              onPress={() => handleValueChange('FEMALE')} // ✅ FIX: Dùng handleValueChange
            >
              <Text style={[
                styles.sexButtonText,
                value === 'FEMALE' && styles.selectedSexButtonText
              ]}>Nữ</Text>
            </TouchableOpacity>
          </View>
        );

      case 'select':
        return (
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={value}
              onValueChange={handleValueChange} // ✅ FIX: Dùng handleValueChange
              style={Platform.OS === 'web' ? styles.webPicker : styles.mobilePicker}
              itemStyle={styles.pickerItem}
              enabled={editable}
            >
              {options?.map((option) => (
                <Picker.Item 
                  key={option} 
                  label={option} 
                  value={option}
                  style={styles.pickerItemText}
                />
              ))}
            </Picker>
          </View>
        );

      default:
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleValueChange} // ✅ FIX: Dùng handleValueChange
            placeholder={placeholder}
            editable={editable} // Thêm editable
          />
        );
    }
  };

  // ✅ ADD: Update local state when defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {renderInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontWeight: '600',
    color: '#666',
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderColor: '#cecece',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: '500',
    marginHorizontal: -2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  
  // Code input styles - giống với input khác
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  codeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#cecece',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: -2,
  },
  codeIcon: {
    marginLeft: 15,
    marginRight: 5,
    color: '#666',
  },
  codeInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 18,
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  sendCodeButton: {
    backgroundColor: '#FF5D00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCodeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  emailInput: {
    flex: 1,
    paddingRight: 50, // Để chỗ cho icon bên phải
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50, // Để chỗ cho icon bên phải  
  },
  iconContainer: {
    position: 'absolute',
    right: 18, // Icon ở bên phải
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sexContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  sexButton: {
    flex: 1,
    borderColor: '#cecece',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  selectedSexButton: {
    backgroundColor: '#FFF1E6',
    borderColor: '#FF5D00',
  },
  sexButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
  },
  selectedSexButtonText: {
    color: '#FF5D00',
    fontWeight: '600',
  },
  numberInput: {
    flex: 1,
    paddingRight: 40,
  },
  unit: {
    position: 'absolute',
    right: 18,
    color: '#666',
    fontSize: 17,
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  dateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  selectContainer: {
    borderColor: '#cecece',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'relative',
    marginHorizontal: -2,
  },
  webPicker: {
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    paddingRight: 50,
    fontSize: 17,
    fontWeight: '500',
    backgroundColor: 'transparent',
    color: '#333',
  },
  mobilePicker: {
    margin: -2,
    color: '#333',
  },
  pickerItem: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  pickerItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  dropdownIconContainer: {
    position: 'absolute',
    right: 18,
    top: '50%',
    transform: [{ translateY: -6 }],
    pointerEvents: 'none',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
})

export default FormInput