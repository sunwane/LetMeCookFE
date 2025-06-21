import OneCmtPost from '@/components/OneCmtPost';
import '@/config/globalTextConfig';
import { CommentItem } from '@/services/types/CommentItem';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface ActivitiesTabProps {
  comments: CommentItem[];
  currentUserId?: number; // Thêm prop để biết user hiện tại
}

const ActivitiesTab = ({ comments, currentUserId }: ActivitiesTabProps) => {
  // Sử dụng trực tiếp comments được truyền vào (đã được filter ở UserProfile)
  const filteredComments = comments;

  if (filteredComments.length === 0) {
    return (
      <View style={[styles.postContainer, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>
      <FlatList
        data={filteredComments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OneCmtPost item={item} currentUserId={currentUserId} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default ActivitiesTab

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});