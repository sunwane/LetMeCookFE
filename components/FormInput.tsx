import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormInputProps {
  label: string;
  defaultValue: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'sex';
  options?: string[];
}

const FormInput = ({ label, defaultValue, type = 'text', options = [] }: FormInputProps) => {
  const [value, setValue] = useState(defaultValue);
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

  const renderInput = () => {
    switch (type) {
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
          <View style={styles.input}>
            <Picker
              selectedValue={value}
              onValueChange={setValue}
              style={{ margin: -8 }}
            >
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );

      default:
        return (
          <TextInput
            style={styles.input}
            defaultValue={defaultValue}
            onChangeText={setValue}
          />
        );
    }
  };

  return (
    <View style={styles.contain}>
      <Text style={styles.title}>{label}</Text>
      {renderInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    marginVertical: 8,
  },
  title: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  numberInput: {
    flex: 1,
    paddingRight: 40, // Space for unit
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
})

export default FormInput