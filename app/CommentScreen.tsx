import AddCommentModal from '@/components/AddCommentModal';
import OneCmt from '@/components/OneCmt';
import { CommentItem, getCommentsByRecipeId } from '@/services/types/CommentItem';
import { RecipeItem } from '@/services/types/RecipeItem';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

  // ✅ State cho comments
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Lấy comment từ API khi có recipe
  useEffect(() => {
    const fetchComments = async () => {
      if (!recipe?.id) return;
      setLoading(true);
      try {
        const res = await getCommentsByRecipeId(recipe.id.toString(), page, 10); // truyền page và size
        setComments(prev =>
          page === 0 ? (res.content || []) : [...prev, ...(res.content || [])]
        );
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        if (page === 0) setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [recipe?.id, modalVisible, page]); // modalVisible để reload khi thêm bình luận

  const sortedComments = comments.sort((a, b) => b.likes - a.likes);

  const handleAddComment = (comment: string) => {
    // Sau khi thêm bình luận thành công, modalVisible sẽ thay đổi và useEffect sẽ tự reload comments
    // Có thể show toast hoặc thông báo thành công ở đây nếu muốn
  };

  const renderComment = ({ item }: { item: CommentItem }) => (
    <OneCmt
      comment={item}
      onDeleted={(id) => setComments(prev => prev.filter(c => c.id !== id))} // ✅ loại bỏ khỏi danh sách
      showReportButton={true}
    />
  );

  const handleLoadMore = () => {
    if (!loading && page + 1 < totalPages) {
      setPage(prev => prev + 1);
    }
  };

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
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.commentsList}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        refreshing={loading}
        onRefresh={() => {
          if (recipe?.id) {
            setPage(0);
          }
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
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
        recipeId={recipe.id.toString()}
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