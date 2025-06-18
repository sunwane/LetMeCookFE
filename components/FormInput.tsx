import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormInputProps {
  label: string;
  defaultValue?: string;
  type?: 'text' | 'number' | 'date' | 'sex' | 'select' | 'email' | 'password';
  options?: string[];
  placeholder?: string;
  onChangeText?: (value: string) => void; // Thêm prop này
}

const FormInput = ({ 
  label, 
  defaultValue = '', 
  type = 'text', 
  options, 
  placeholder,
  onChangeText 
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

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
  };

  // Render input based on type
  const renderInput = () => {
    switch (type) {
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
              defaultValue={defaultValue}
              keyboardType="numeric"
              onChangeText={setValue}
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
                value === 'Nam' && styles.selectedSexButton
              ]}
              onPress={() => setValue('Nam')}
            >
              <Text style={[
                styles.sexButtonText,
                value === 'Nam' && styles.selectedSexButtonText
              ]}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.sexButton,
                value === 'Nữ' && styles.selectedSexButton
              ]}
              onPress={() => setValue('Nữ')}
            >
              <Text style={[
                styles.sexButtonText,
                value === 'Nữ' && styles.selectedSexButtonText
              ]}>Nữ</Text>
            </TouchableOpacity>
          </View>
        );

      case 'select':
        return (
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={value}
              onValueChange={setValue}
              style={Platform.OS === 'web' ? styles.webPicker : styles.mobilePicker}
              itemStyle={styles.pickerItem} // Thêm itemStyle cho iOS
            >
              {options?.map((option) => (
                <Picker.Item 
                  key={option} 
                  label={option} 
                  value={option}
                  style={styles.pickerItemText} // Style cho từng item
                />
              ))}
            </Picker>
            {Platform.OS === 'web' && (
              <View style={styles.dropdownIconContainer}>
                <Text style={styles.dropdownIcon}>▼</Text>
              </View>
            )}
          </View>
        );

      default:
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleValueChange}
            placeholder={placeholder}
          />
        );
    }
  };

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
  emailInput: {
    flex: 1,
    paddingRight: 50, // Chừa chỗ cho icon
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50, // Chừa chỗ cho icon
  },
  iconContainer: {
    position: 'absolute',
    right: 18,
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
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none', //để nó yên
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'none',
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