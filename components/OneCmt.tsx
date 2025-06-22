import { CommentItem } from '@/services/types/CommentItem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OneCmtProps {
  comment: CommentItem;
  showReportButton?: boolean;
}

const OneCmt: React.FC<OneCmtProps> = ({ comment, showReportButton = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(comment.like));
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
  };

  const handleReport = () => {
    setReportModalVisible(true);
  };

  // Tạo ngày giờ mock (có thể thay bằng timestamp thực từ API)
  const getTimeAgo = () => {
    const times = ['2 giờ trước', '1 ngày trước', '3 ngày trước', '1 tuần trước'];
    return times[comment.id % times.length];
  };

  return (
    <>
      <View style={styles.commentContainer}>
        {/* Header: Avatar + Name + Time */}
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>

            {/* đọc lại Avatar và username nha dũng */}
            <Image 
              source={{uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}} 
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              {/* <Text style={styles.userName}>{comment.account.userName}</Text> */}
              <Text style={styles.timeAgo}>{getTimeAgo()}</Text>
            </View>
          </View>
          
          {/* Report Button */}
          {showReportButton && (
            <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
              <Ionicons name="flag-outline" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Comment Content */}
        <Text style={styles.commentContent}>{comment.content}</Text>

        {/* Footer: Like Button + Count */}
        <View style={styles.commentFooter}>
          <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={isLiked ? "#FF5D00" : "#999"} 
            />
            <Text style={[
              styles.likeText,
              isLiked && styles.likeTextActive
            ]}>
              {likeCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Modal */}
      {/* <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        userName={comment.account.userName}
      /> */}
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
});