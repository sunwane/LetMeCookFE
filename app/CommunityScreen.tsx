import OneCmtPost from '@/components/OneCmtPost'
import { sampleComments } from '@/services/types/CommentItem'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'

const {width: ScreenWidth} = Dimensions.get('screen')

const CommunityScreen = () => {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContain}>
        <Text style={styles.headerTitle}>Cùng xem chia sẻ của những "đồng bếp" khác</Text>
      </View>
      
      <View style={styles.postContainer}>
        {sampleComments.map((item) => (
          <OneCmtPost key={item.id.toString()} item={item} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5',
  },
  headerContain: {
    backgroundColor: '#fff',
    paddingTop: 70,
    paddingBottom: 20,
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
})

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