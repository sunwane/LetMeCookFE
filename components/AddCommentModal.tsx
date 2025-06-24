import { createComment } from '@/services/types/CommentItem'; // ✅ NEW: Import createComment function
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface AddCommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  recipeName: string;
  recipeId: string; // ✅ NEW: Add recipeId prop
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  recipeName,
  recipeId // ✅ NEW: Add recipeId prop
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW: Loading state

  // ✅ UPDATED: Handle submit with API call
  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // ✅ Call createComment API
      console.log(recipeId)
      const newComment = await createComment(recipeId, comment.trim());
      console.log('Comment created successfully:', newComment);
      
      // Call the onSubmit prop (for parent component to handle)
      onSubmit(comment.trim());
      
      // Reset and close
      setComment('');
      onClose();
      
      // Optional: Show success message
      // Alert.alert('Thành công', 'Bình luận đã được đăng!');
      
    } catch (error) {
      console.error('Error creating comment:', error);
      
      let errorMessage = 'Không thể đăng bình luận. Vui lòng thử lại!';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={handleClose}
                disabled={isSubmitting} // ✅ Disable when submitting
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isSubmitting ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
              
              <Text style={styles.title}>Viết bình luận</Text>
              
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!comment.trim() || isSubmitting} // ✅ Updated disabled logic
                style={[
                  styles.submitButton,
                  (comment.trim() && !isSubmitting) ? styles.submitButtonActive : styles.submitButtonDisabled
                ]}
              >
                <Text style={[
                  styles.submitText,
                  (comment.trim() && !isSubmitting) ? styles.submitTextActive : styles.submitTextDisabled
                ]}>
                  {isSubmitting ? 'Đang đăng...' : 'Đăng'} {/* ✅ Show loading text */}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recipe info */}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeLabel}>Bình luận cho món:</Text>
              <Text style={styles.recipeName}>{recipeName}</Text>
            </View>

            {/* Comment input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  isSubmitting && styles.textInputDisabled // ✅ Style when disabled
                ]}
                placeholder="Chia sẻ cảm nghĩ của bạn về món ăn này..."
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={500}
                textAlignVertical="top"
                autoFocus
                editable={!isSubmitting} // ✅ Disable input when submitting
              />
              <Text style={styles.characterCount}>
                {comment.length}/500
              </Text>
            </View>

            {/* ✅ NEW: Loading indicator (optional) */}
            {isSubmitting && (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Đang đăng bình luận...</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 340,
    paddingBottom: 40,
    position: 'relative', // ✅ For loading overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitButtonActive: {
    backgroundColor: '#FF5D00',
  },
  submitButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  submitText: {
    fontWeight: '600',
  },
  submitTextActive: {
    color: '#fff',
  },
  submitTextDisabled: {
    color: '#999',
  },
  recipeInfo: {
    padding: 20,
    paddingBottom: 15,
  },
  recipeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A2917',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  // ✅ NEW: Disabled input style
  textInputDisabled: {
    backgroundColor: '#f8f8f8',
    color: '#999',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  // ✅ NEW: Loading overlay styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default AddCommentModal;