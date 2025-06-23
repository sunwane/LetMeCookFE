import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Step {
  id: string;
  content: string;
  stepImage?: string;
  waitingTime?: string; // ✅ NEW: Add waiting time
}

interface AddStepProps {
  steps: Step[];
  onUpdateStep: (id: string, content: string) => void;
  onUpdateStepImage: (id: string, stepImage: string | undefined) => void;
  onUpdateStepWaitingTime: (id: string, waitingTime: string) => void; // ✅ NEW: Add waiting time handler
  onMoveStepUp: (stepId: string) => void;
  onMoveStepDown: (stepId: string) => void;
  onMoveStepToPosition: (stepId: string, position: number) => void;
  onRemoveStep: (stepId: string) => void;
}

const AddStep: React.FC<AddStepProps> = ({
  steps,
  onUpdateStep,
  onUpdateStepImage,
  onUpdateStepWaitingTime, // ✅ NEW: Add waiting time handler
  onMoveStepUp,
  onMoveStepDown,
  onMoveStepToPosition,
  onRemoveStep,
}) => {

  // ✅ Chọn ảnh cho từng bước nấu
  const pickStepImage = async (stepId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // ✅ Không crop ảnh
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      onUpdateStepImage(stepId, result.assets[0].uri);
    }
  };

  // ✅ Xóa ảnh bước nấu
  const removeStepImage = (stepId: string) => {
    onUpdateStepImage(stepId, undefined);
  };

  return (
    <>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepItem}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>Bước {index + 1}</Text>
            
            {/* ✅ Step Controls - Thứ tự và xóa */}
            <View style={styles.stepControls}>
              {/* Move Up Button */}
              <TouchableOpacity 
                onPress={() => onMoveStepUp(step.id)}
                style={[
                  styles.stepControlButton,
                  index === 0 && styles.stepControlButtonDisabled
                ]}
                disabled={index === 0}
              >
                <Text style={[
                  styles.stepControlText,
                  index === 0 && styles.stepControlTextDisabled
                ]}>
                  ↑
                </Text>
              </TouchableOpacity>
              
              {/* Move Down Button */}
              <TouchableOpacity 
                onPress={() => onMoveStepDown(step.id)}
                style={[
                  styles.stepControlButton,
                  index === steps.length - 1 && styles.stepControlButtonDisabled
                ]}
                disabled={index === steps.length - 1}
              >
                <Text style={[
                  styles.stepControlText,
                  index === steps.length - 1 && styles.stepControlTextDisabled
                ]}>
                  ↓
                </Text>
              </TouchableOpacity>
              
              {/* Delete Button */}
              {steps.length > 1 && (
                <TouchableOpacity 
                  onPress={() => onRemoveStep(step.id)}
                  style={[styles.stepControlButton, styles.deleteStepButton]}
                >
                  <Text style={styles.deleteStepText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* ✅ Mô tả bước làm */}
          <TextInput
            style={[styles.textInput, styles.stepContent]}
            placeholder="Mô tả chi tiết bước làm..."
            value={step.content}
            onChangeText={(text) => onUpdateStep(step.id, text)}
            multiline
            numberOfLines={3}
          />

          {/* ✅ NEW: Thời gian chờ */}
          <View style={styles.waitingTimeSection}>
            <Text style={styles.waitingTimeLabel}>Thời gian chờ (tùy chọn)</Text>
            <TextInput
              style={[styles.textInput, styles.waitingTimeInput]}
              placeholder="VD: 5 phút, 30 giây, 2 giờ..."
              value={step.waitingTime || ''}
              onChangeText={(text) => onUpdateStepWaitingTime(step.id, text)}
              maxLength={50}
            />
            <Text style={styles.waitingTimeHint}>
              Thời gian cần chờ sau khi hoàn thành bước này
            </Text>
          </View>

          {/* ✅ Ảnh minh họa bước làm (tùy chọn) */}
          <View style={styles.stepImageSection}>
            <Text style={styles.stepImageLabel}>Ảnh minh họa (tùy chọn)</Text>
            
            {step.stepImage ? (
              /* Hiển thị ảnh đã chọn */
              <View style={styles.stepImageContainer}>
                <Image source={{ uri: step.stepImage }} style={styles.stepImage} />
                <View style={styles.stepImageActions}>
                  <TouchableOpacity 
                    onPress={() => pickStepImage(step.id)}
                    style={styles.stepImageActionButton}
                  >
                    <Text style={styles.stepImageActionText}>📷 Đổi ảnh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => removeStepImage(step.id)}
                    style={[styles.stepImageActionButton, styles.removeImageButton]}
                  >
                    <Text style={[styles.stepImageActionText, styles.removeImageText]}>🗑 Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Placeholder để thêm ảnh */
              <TouchableOpacity 
                style={styles.stepImagePlaceholder}
                onPress={() => pickStepImage(step.id)}
              >
                <Text style={styles.stepImagePlaceholderIcon}>🖼</Text>
                <Text style={styles.stepImagePlaceholderText}>Thêm ảnh minh họa</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* ✅ Quick Position Controls (Optional) */}
          {steps.length > 3 && (
            <View style={styles.quickPositionControls}>
              <Text style={styles.quickPositionLabel}>Di chuyển đến:</Text>
              <View style={styles.quickPositionButtons}>
                {index !== 0 && (
                  <TouchableOpacity 
                    onPress={() => onMoveStepToPosition(step.id, 0)}
                    style={styles.quickPositionButton}
                  >
                    <Text style={styles.quickPositionButtonText}>Đầu</Text>
                  </TouchableOpacity>
                )}
                {index !== steps.length - 1 && (
                  <TouchableOpacity 
                    onPress={() => onMoveStepToPosition(step.id, steps.length - 1)}
                    style={styles.quickPositionButton}
                  >
                    <Text style={styles.quickPositionButtonText}>Cuối</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      ))}
    </>
  );
};

export default AddStep;

const styles = StyleSheet.create({
  // Step styles
  stepItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5D00',
  },
  
  // Input styles
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  stepContent: {
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 15,
  },

  // ✅ NEW: Waiting Time Styles
  waitingTimeSection: {
    marginBottom: 15,
  },
  waitingTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  waitingTimeInput: {
    marginBottom: 4,
  },
  waitingTimeHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  
  // Step Image Styles
  stepImageSection: {
    marginTop: 10,
  },
  stepImageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  stepImageContainer: {
    position: 'relative',
  },
  stepImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  stepImageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  stepImageActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF5D00',
    backgroundColor: '#fff',
  },
  removeImageButton: {
    borderColor: '#ff4444',
  },
  stepImageActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF5D00',
  },
  removeImageText: {
    color: '#ff4444',
  },
  stepImagePlaceholder: {
    height: 80,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  stepImagePlaceholderIcon: {
    fontSize: 24,
  },
  stepImagePlaceholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  
  // ✅ UPDATED: Step controls without icons
  stepControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepControlButtonDisabled: {
    backgroundColor: '#f8f8f8',
    borderColor: '#f0f0f0',
  },
  stepControlText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  stepControlTextDisabled: {
    color: '#ccc',
  },
  deleteStepButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca',
  },
  deleteStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4444',
  },

  // Quick position controls
  quickPositionControls: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickPositionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  quickPositionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPositionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5D00',
    borderRadius: 16,
  },
  quickPositionButtonText: {
    fontSize: 12,
    color: '#FF5D00',
    fontWeight: '500',
  },
});