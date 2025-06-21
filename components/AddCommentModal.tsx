import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  recipeName
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
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
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Viết bình luận</Text>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!comment.trim()}
                style={[
                  styles.submitButton,
                  comment.trim() ? styles.submitButtonActive : styles.submitButtonDisabled
                ]}
              >
                <Text style={[
                  styles.submitText,
                  comment.trim() ? styles.submitTextActive : styles.submitTextDisabled
                ]}>
                  Đăng
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
                style={styles.textInput}
                placeholder="Chia sẻ cảm nghĩ của bạn về món ăn này..."
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={500}
                textAlignVertical="top"
                autoFocus
              />
              <Text style={styles.characterCount}>
                {comment.length}/500
              </Text>
            </View>
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
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
});

export default AddCommentModal;