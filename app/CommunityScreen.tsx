import OneCmtPost from '@/components/OneCmtPost';
import { CommentItem, getAllComments } from '@/services/types/CommentItem';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const { width: ScreenWidth } = Dimensions.get('screen');

const PAGE_SIZE = 10;

const CommunityScreen = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (pageToLoad = 0) => {
    if (loading || (pageToLoad >= totalPages)) return;
    setLoading(true);
    try {
      const response = await getAllComments(pageToLoad, PAGE_SIZE);
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
      console.error('Error fetching comments:', error);
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContain}>
        <Text style={styles.headerTitle}>Cùng xem chia sẻ của những "đồng bếp" khác</Text>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OneCmtPost item={item} />}
        contentContainerStyle={styles.postContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5',
  },
  headerContain: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    paddingHorizontal: ScreenWidth / 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF5D00',
    textAlign: 'center'
  },
  postContainer: {
    marginTop: 10,
    paddingBottom: 20,
  }
});

export default CommunityScreen;