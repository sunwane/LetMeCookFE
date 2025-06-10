import OneCmtPost from '@/components/OneCmtPost';
import { CommentItem } from '@/services/types/CommentItem';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface ActivitiesTabProps {
  comments: CommentItem[];
}

const ActivitiesTab = ({ comments }: ActivitiesTabProps) => {
  // Lọc comments của account có id=1 (BếpTrưởngTậpSự)
  const filteredComments = comments.filter(comment => comment.account.id === 1)

  return (
    <View style={styles.postContainer}>
      <FlatList
        data={filteredComments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OneCmtPost item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default ActivitiesTab

const styles = StyleSheet.create({
  postContainer: {
    flex: 1, // Thêm flex: 1 để container có thể mở rộng
  },
  listContent: {
    paddingVertical: 10,
  }
});