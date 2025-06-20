import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ServingAdjusterProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
  containerStyle?: any;
}

const ServingAdjuster = ({
  initialValue = 4,
  onValueChange,
  containerStyle
}: ServingAdjusterProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue.toString());
  const inputRef = useRef<TextInput>(null);

  // Hàm tăng giá trị
  const increaseValue = () => {
    const newValue = Math.min(value + 1, 20);
    if (newValue !== value) {
      setValue(newValue);
      setInputValue(newValue.toString());
      onValueChange?.(newValue);
    }
  };

  // Hàm giảm giá trị
  const decreaseValue = () => {
    const newValue = Math.max(value - 1, 1);
    if (newValue !== value) {
      setValue(newValue);
      setInputValue(newValue.toString());
      onValueChange?.(newValue);
    }
  };

  // Bắt đầu chỉnh sửa
  const startEditing = () => {
    setIsEditing(true);
    setInputValue(value.toString());
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelection(0, inputValue.length);
    }, 100);
  };

  // Kết thúc chỉnh sửa
  const finishEditing = () => {
    setIsEditing(false);
    const numericValue = parseInt(inputValue) || 1;
    const clampedValue = Math.max(1, Math.min(numericValue, 20));
    setValue(clampedValue);
    setInputValue(clampedValue.toString());
    onValueChange?.(clampedValue);
  };

  // Xử lý thay đổi input
  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setInputValue(numericText);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>Khẩu phần</Text>
      <View style={styles.adjusterContainer}>
        <TouchableOpacity 
          style={[
            styles.adjustButton, 
            value <= 1 && styles.adjustButtonDisabled
          ]}
          onPress={decreaseValue}
          disabled={value <= 1}
        >
          <Text style={[
            styles.adjustButtonText,
            value <= 1 && styles.adjustButtonTextDisabled
          ]}>-</Text>
        </TouchableOpacity>
        
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.valueInput}
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={finishEditing}
            onSubmitEditing={finishEditing}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
          />
        ) : (
          <TouchableOpacity onPress={startEditing} style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {value} người
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.adjustButton,
            value >= 20 && styles.adjustButtonDisabled
          ]}
          onPress={increaseValue}
          disabled={value >= 20}
        >
          <Text style={[
            styles.adjustButtonText,
            value >= 20 && styles.adjustButtonTextDisabled
          ]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF0E7',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#74341C',
    fontWeight: '600',
  },
  adjusterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF5D00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adjustButtonTextDisabled: {
    color: '#999',
  },
  valueContainer: {
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: 4,
  },
  valueText: {
    fontSize: 14,
    color: '#74341C',
    fontWeight: '600',
    textAlign: 'center',
  },
  valueInput: {
    minWidth: 70,
    height: 32,
    borderWidth: 1,
    borderColor: '#FF5D00',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#74341C',
    fontWeight: '600',
    backgroundColor: '#fff',
  },
});

export default ServingAdjuster;