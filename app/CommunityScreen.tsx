import OneCmtPost from '@/components/OneCmtPost';
import { CommentItem, getAllComments } from '@/services/types/CommentItem';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: ScreenWidth } = Dimensions.get('screen');

const CommunityScreen = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);

useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await getAllComments();
      // Đảm bảo response.content là mảng, nếu không thì set []
      console.log("lấy comment", response);
      if (response?.result?.content && Array.isArray(response.result.content)) {
        setComments(response.result.content);
      } else {
        setComments([]);
      }
    } catch (error) {
      setComments([]);
      console.error('Error fetching comments:', error);
    }
  };
  fetchComments();
}, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContain}>
        <Text style={styles.headerTitle}>Cùng xem chia sẻ của những "đồng bếp" khác</Text>
      </View>

      <View style={styles.postContainer}>
        {comments.map((item) => (
          <OneCmtPost key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
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
  }
});

export default CommunityScreen


// nếu các bạn muốn header đứng lại và kéo phần post
// const CommunityScreen = () => {
//   return (
//     <ScrollView 
//       contentContainerStyle={styles.container}
//       showsVerticalScrollIndicator={false} // Ẩn thanh scroll
//     >
//       <View style={styles.headerContain}>
//         <Text style={styles.headerTitle}>Cùng xem chia sẻ của những "đồng bếp" khác</Text>
//       </View>
//       <View style={styles.postContainer}>
//         <FlatList
//             data={sampleComments}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => <OneCmtPost item={item} />}
//             contentContainerStyle={styles.listContent}
//           />
//       </View>
//     </ScrollView>
//   )
// }

// export default CommunityScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFAF5',
//   },
//   headerContain: {
//     backgroundColor: '#fff',
//     paddingTop: 70,
//     paddingBottom: 20,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#cecece',
//     paddingHorizontal: ScreenWidth / 6,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 700,
//     color: '#FF5D00',
//     textAlign: 'center'
//   },
//   postContainer: {
//     flex: 1, // Thêm flex: 1 để container có thể mở rộng
//   },
//   listContent: {
//     marginTop: 10,
//   }
// });