import OneCmtPost from '@/components/OneCmtPost';
import { CommentItem, getCommentByAccountId } from '@/services/types/CommentItem';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const PAGE_SIZE = 10;

interface ActivitiesTabProps {
  currentUserId?: number;
}

const ActivitiesTab = ({ currentUserId }: ActivitiesTabProps) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (pageToLoad = 0) => {
    if (loading || (pageToLoad >= totalPages)) return;
    setLoading(true);
    try {
      const response = await getCommentByAccountId();

      const content = response?.result?.content ?? [];
      const total = response?.result?.totalPages ?? 1;

      if (Array.isArray(content)) {
        if (pageToLoad === 0) {
          setComments(content);
        } else {
          setComments(prev => [...prev, ...content]);
        }
        setTotalPages(total);
        setPage(pageToLoad);
      }
    } catch (error) {
      if (pageToLoad === 0) setComments([]);
      console.error('Error fetching user comments:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, totalPages]);

  useEffect(() => {
    fetchComments(0);
  }, []);

  const handleLoadMore = () => {
    if (!loading && page + 1 < totalPages) {
      fetchComments(page + 1);
    }
  };

  if (comments.length === 0 && !loading) {
    return (
      <View style={[styles.postContainer, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OneCmtPost item={item} currentUserId={currentUserId} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
      />
    </View>
  );
};

export default ActivitiesTab;

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