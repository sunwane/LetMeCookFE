import AddCommentModal from '@/components/AddCommentModal';
import OneCmt from '@/components/OneCmt';
import { CommentItem } from '@/services/types/CommentItem';
import { RecipeItem } from '@/services/types/RecipeItem';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const CommentScreen = () => {
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);

  const recipe: RecipeItem = params.recipeData ? JSON.parse(params.recipeData as string) : null;
  const comments: CommentItem[] = params.comments ? JSON.parse(params.comments as string) : [];

  const sortedComments = comments.sort((a, b) => parseInt(b.like) - parseInt(a.like));

  const handleAddComment = (comment: string) => {
    console.log('Adding comment:', comment);
    // TODO: Implement add comment logic
  };

  const renderComment = ({ item }: { item: CommentItem }) => (
    <OneCmt comment={item} showReportButton={true} />
  );

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin món ăn</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header món ăn */}
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.commentStats}>
          {comments.length} bình luận • Đăng ngày {recipe.createAt} 
        </Text>
      </View>

      {/* Danh sách bình luận */}
      <FlatList
        data={sortedComments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.commentsList}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có bình luận nào</Text>
            <Text style={styles.emptySubtext}>Hãy là người đầu tiên chia sẻ cảm nghĩ về món này!</Text>
          </View>
        )}
      />

      {/* Button thêm bình luận */}
      <TouchableOpacity
        style={styles.addCommentButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#FF5D00" />
        <Text style={styles.addCommentText}>Viết bình luận...</Text>
        <Ionicons name="create-outline" size={20} color="#FF5D00" />
      </TouchableOpacity>

      {/* Modal thêm bình luận */}
      <AddCommentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddComment}
        recipeName={recipe.title}
      />
    </View>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recipeHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A2917',
    marginBottom: 5,
    textAlign: 'center',
  },
  commentStats: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
  },
  commentsList: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 100, // Space for button
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF1E6',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF5D00',
  },
  addCommentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#FF5D00',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});