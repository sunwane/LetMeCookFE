import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import components
import AppHeader from "@/components/ui/AppHeader";
import BackgroundDecorations from "@/components/ui/BackgroundDecorations";
import ContinueButton from "@/components/ui/ContinueButton";
import ProgressBar from "@/components/ui/ProgressBar";

const AvatarSelection = () => {
  const params = useLocalSearchParams();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập',
          'Cần quyền truy cập thư viện ảnh để chọn avatar',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  // Handle image selection from gallery
  const pickImageFromGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setIsLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedAvatar(imageUri);
        console.log('✅ Avatar selected:', imageUri);
      }
    } catch (error) {
      console.error('❌ Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle camera capture
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập',
          'Cần quyền truy cập camera để chụp ảnh',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedAvatar(imageUri);
        console.log('✅ Photo taken:', imageUri);
      }
    } catch (error) {
      console.error('❌ Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show options for image selection
  const showImageOptions = () => {
    Alert.alert(
      'Chọn ảnh đại diện',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thư viện ảnh', onPress: pickImageFromGallery },
        { text: 'Chụp ảnh', onPress: takePhoto },
      ],
      { cancelable: true }
    );
  };

  // Remove selected avatar
  const removeAvatar = () => {
    setSelectedAvatar(null);
  };

  // Handle continue (skip or proceed)
  const handleContinue = () => {
    router.push({
      pathname: "/DietSelection",
      params: {
        sex: params.sex,
        height: params.height,
        age: params.age,
        weight: params.weight,
        avatar: selectedAvatar || '', // Pass avatar URI or empty string
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Progress Bar */}
      <ProgressBar progress={87.5} />

      <View style={styles.content}>
        {/* Header Section */}
        <AppHeader />

        {/* Avatar Icon */}
        <View style={styles.avatarIconContainer}>
          <Ionicons name="person-circle-outline" size={48} color="#666" />
        </View>

        {/* Question */}
        <Text style={styles.question}>Thêm ảnh đại diện của bạn</Text>
        <Text style={styles.subtitle}>Tùy chọn - có thể bỏ qua bước này</Text>

        {/* Avatar Display & Selection */}
        <View style={styles.avatarContainer}>
          {selectedAvatar ? (
            <View style={styles.selectedAvatarContainer}>
              <Image source={{ uri: selectedAvatar }} style={styles.avatarImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={removeAvatar}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={24} color="#FF5722" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.avatarPlaceholder}
              onPress={showImageOptions}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="camera" 
                size={40} 
                color={isLoading ? "#ccc" : "#666"} 
              />
              <Text style={[styles.placeholderText, isLoading && styles.loadingText]}>
                {isLoading ? 'Đang tải...' : 'Chọn ảnh'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={showImageOptions}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={20} color="#FF5D00" />
            <Text style={styles.selectButtonText}>
              {selectedAvatar ? 'Đổi ảnh' : 'Chọn ảnh'}
            </Text>
          </TouchableOpacity>

          {selectedAvatar && (
            <TouchableOpacity 
              style={styles.removeActionButton}
              onPress={removeAvatar}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="#FF5722" />
              <Text style={styles.removeActionButtonText}>Xóa ảnh</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description Text */}
        <Text style={styles.description}>
          Ảnh đại diện giúp cá nhân hóa hồ sơ của bạn trong cộng đồng nấu ăn. 
          Bạn có thể bỏ qua bước này và thêm ảnh sau.
        </Text>

        {/* Continue Button */}
        <ContinueButton 
          onPress={handleContinue} 
          disabled={isLoading}
          title={selectedAvatar ? "Tiếp tục" : "Bỏ qua"}
        />
      </View>
    </View>
  );
};

export default AvatarSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    paddingTop: 30,
  },

  avatarIconContainer: {
    marginBottom: 15,
  },

  question: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  selectedAvatarContainer: {
    position: 'relative',
  },

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF5D00',
  },

  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },

  placeholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },

  loadingText: {
    color: '#ccc',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },

  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF5D00',
    gap: 8,
  },

  selectButtonText: {
    color: '#FF5D00',
    fontSize: 14,
    fontWeight: '600',
  },

  removeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF5722',
    gap: 8,
  },

  removeActionButtonText: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: '600',
  },

  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 15,
    opacity: 0.8,
    maxWidth: "95%",
  },
});