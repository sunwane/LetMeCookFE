import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  onPress: () => void;
  disabled?: boolean; 
 style?: ViewStyle | (ViewStyle | false | undefined)[];
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false, 
  style,
  textStyle,
  ...rest 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton, 
        style,
      ]}
      onPress={onPress}
      disabled={disabled} 
      activeOpacity={disabled ? 1 : 0.8} 
      {...rest} 
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 50,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default CustomButton;
