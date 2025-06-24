import { CommentItem, deleteComment, getAccountIdFromToken, getAllAccountLikeComment, likeComment, unlikeComment, updateComment } from '@/services/types/CommentItem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAvatarSource } from '../services/types/UserInfo';
import ReportModal from './ReportModal';

interface OneCmtProps {
  comment: CommentItem;
  showReportButton?: boolean;
  onDeleted?: (id: string) => void; // ✅ thêm prop callback
}

const OneCmt: React.FC<OneCmtProps> = ({ comment, showReportButton = true, onDeleted }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State cho sửa bình luận
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [myAccountId, setMyAccountId] = useState<string | null>(null);

  // Khi mount, kiểm tra trạng thái like của comment này
 React.useEffect(() => {
  const checkLikeStatus = async () => {
    try {
      const response = await getAllAccountLikeComment();
      
      if (response?.result && Array.isArray(response.result)) {
        const isInLikes = response.result.some(like =>
          like.commentId?.toString() === comment.id.toString()
        );
        setIsLiked(isInLikes);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
      setIsLiked(false);
    }
  };

  if (comment?.id) {
    checkLikeStatus();
  }
}, [comment?.id]);

  React.useEffect(() => {
    const fetchAccountId = async () => {
      const id = await getAccountIdFromToken();
      setMyAccountId( id);
    };
    fetchAccountId();
  }, []);

  const toggleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeComment(comment.id.toString());
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likeComment(comment.id.toString());
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể thực hiện thao tác!');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleReport = () => {
    setReportModalVisible(true);
  };

  // Tạo ngày giờ mock (có thể thay bằng timestamp thực từ API)
  const getTimeAgo = () => {
    const times = ['2 giờ trước', '1 ngày trước', '3 ngày trước', '1 tuần trước'];
    return times[Number(comment.id) % times.length];
  };

  // Hàm lưu bình luận đã sửa (gọi API thực tế)
  const handleSaveEdit = async () => {
    try {
      await updateComment(
        comment.id.toString(),
        comment.recipeId.toString(),
        { commentText: editedText }
      );
      setIsEditing(false);
      // Nếu muốn cập nhật lên cha, có thể truyền callback qua props
    } catch (error) {
      alert('Cập nhật bình luận thất bại!');
    }
  };

  // Hàm xóa bình luận với custom dialog xác nhận
  const handleDelete = async () => { 
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteComment(comment.id.toString());
      if (onDeleted) onDeleted(comment.id);
    } catch (error) {
      Alert.alert('Lỗi', 'Xóa bình luận thất bại!');
    }
  };

  // Hàm hủy sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.commentText);
  };

  return (
    <>
      <View style={styles.commentContainer}>
        {/* Header: Avatar + Name + Time */}
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Image 
              source={getAvatarSource(comment.userAvatar)}
              style={styles.avatar} 
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{comment.username}</Text>
              <Text style={styles.timeAgo}>{getTimeAgo()}</Text>
            </View>
          </View>
          
          {/* Report, Edit, Delete Buttons */}
          <View style={styles.actionButtons}>
            {showReportButton && (
              <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
                <Ionicons name="flag-outline" size={16} color="#999" />
              </TouchableOpacity>
            )}
            {/* Chỉ render nếu là chủ comment */}
            {comment.accountId === myAccountId && (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={16} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Comment Content hoặc Edit Mode */}
        {isEditing ? (
          <View>
            <TextInput
              style={[styles.commentContent, { borderWidth: 1, borderColor: '#FF5D00', borderRadius: 6, padding: 6 }]}
              value={editedText}
              onChangeText={setEditedText}
              multiline
              autoFocus
            />
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <TouchableOpacity onPress={handleSaveEdit} style={[styles.editButton, { backgroundColor: '#FF5D00', borderRadius: 6 }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold', paddingHorizontal: 8 }}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit} style={[styles.deleteButton, { backgroundColor: '#f0f0f0', borderRadius: 6 }]}>
                <Text style={{ color: '#333', fontWeight: 'bold', paddingHorizontal: 8 }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : 
          <Text style={styles.commentContent}>{editedText}</Text>
        }

        {/* Footer: Like Button + Count */}
        <View style={styles.commentFooter}>
          <TouchableOpacity onPress={toggleLike} style={styles.likeButton} disabled={isLikeLoading}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={isLiked ? "#FF5D00" : "#999"} 
            />
            <Text style={[
              styles.likeText,
              isLiked && styles.likeTextActive
            ]}>
              {likeCount} thích
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        userName={comment.username}
      />

      {/* Custom Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF3B30" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Xác nhận xóa bình luận?</Text>
            <Text style={styles.modalMessage}>Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OneCmt;

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  reportButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  likeText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  likeTextActive: {
    color: '#FF5D00',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButton: {
    padding: 4,
    marginLeft: 2,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 4,
  },
  deleteConfirmButton: {
    backgroundColor: '#FF3B30',
    marginLeft: 4,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});