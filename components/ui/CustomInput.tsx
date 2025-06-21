import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CustomInputProps extends Omit<TextInputProps, "style"> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void; // ✅ ADD: onFocus prop
  onBlur?: () => void; // ✅ ADD: onBlur prop
  focused?: boolean; // ✅ ADD: focused prop
  iconName?: keyof typeof FontAwesome.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  style?: ViewStyle;
  editable?: boolean;
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  onFocus, // ✅ ADD: Destructure onFocus
  onBlur, // ✅ ADD: Destructure onBlur
  focused = false, // ✅ ADD: Destructure focused
  iconName,
  secureTextEntry = false,
  keyboardType = "default",
  returnKeyType = "done",
  style,
  editable = true,
  ...rest // ✅ Pass through other TextInput props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        (isFocused || focused) && styles.focusedContainer, // ✅ ADD: Focused styling
        style,
      ]}
    >
      {iconName && (
        <FontAwesome
          name={iconName}
          size={16}
          color={isFocused || focused ? "#FF6B35" : "#666"} // ✅ ADD: Dynamic color
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus} // ✅ ADD: Pass onFocus
        onBlur={onBlur} // ✅ ADD: Pass onBlur
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        editable={editable}
        {...rest} // ✅ Spread other props
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  focusedContainer: {
    borderColor: "#FF6B35",
    shadowColor: "#FF6B35",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
