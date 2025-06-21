import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose, userName }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');

  const reportReasons = [
    'Spam hoặc quảng cáo',
    'Ngôn từ thù địch hoặc quấy rối',
    'Nội dung không phù hợp',
    'Thông tin sai lệch',
    'Vi phạm bản quyền',
    'Nội dung bạo lực',
    'Lừa đảo hoặc gian lận'
  ];

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    } else {
      setSelectedReasons(prev => [...prev, reason]);
    }
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0 && !customReason.trim()) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một lý do báo cáo.');
      return;
    }

    Alert.alert(
      'Báo cáo đã gửi',
      'Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedReasons([]);
            setCustomReason('');
            onClose();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    setSelectedReasons([]);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Báo cáo bình luận</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Báo cáo bình luận của <Text style={styles.userName}>{userName}</Text>
            </Text>
            <Text style={styles.description}>
              Vui lòng chọn lý do báo cáo và cung cấp thêm thông tin chi tiết.
            </Text>

            {/* Reasons */}
            <Text style={styles.sectionTitle}>
              Lý do báo cáo <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.reasonsList}>
              {reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reasonItem}
                  onPress={() => toggleReason(reason)}
                >
                  <View style={styles.checkbox}>
                    {selectedReasons.includes(reason) && (
                      <Ionicons name="checkmark" size={16} color="#FF5D00" />
                    )}
                  </View>
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom reason */}
            <Text style={styles.sectionTitle}>Chi tiết bổ sung (tùy chọn)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Mô tả chi tiết về vấn đề bạn gặp phải..."
              value={customReason}
              onChangeText={setCustomReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />

            {/* Warning */}
            <View style={styles.warningContainer}>
              <Text style={styles.warningLabel}>Lưu ý:</Text>
              <Text style={styles.warningText}>
                Báo cáo sai lệch có thể dẫn đến việc tài khoản của bạn bị hạn chế.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Gửi báo cáo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    height: 600,
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    color: '#FF5D00',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  required: {
    color: '#FF5D00',
  },
  reasonsList: {
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  reasonText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 16,
  },
  warningContainer: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
    marginBottom: 50,
  },
  warningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A00',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#8B5A00',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF5D00',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ReportModal;