import OneCmtPost from '@/components/OneCmtPost'
import { AccountItem } from '@/services/types/AccountItem'
import { CommentItem } from '@/services/types/CommentItem'
import { FoodItem } from '@/services/types/FoodItem'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

interface ActivitiesTabProps {
  comments: CommentItem[];
}

const ActivitiesTab = ({ comments }: ActivitiesTabProps) => {
  return (
    <View style={styles.postContainer}>
      <FlatList
        data={comments}
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
    marginTop: 10,
  },
  listContent: {
  }
})

//file riêng
export const sampleAccounts: AccountItem[] = [
  {
    id: 1,
    userName: "BếpTrưởngTậpSự",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    sex: "Nữ",
    age: 25,
    height: 165,
    weight: 55,
    diet: "Eat clean",
    healthStatus: "Healthy"
  },
  {
    id: 2,
    userName: "ĐầuBếpNhíNhố",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    sex: "Nam",
    age: 30,
    height: 175,
    weight: 70,
    diet: "Balanced",
    healthStatus: "Good"
  }
];

const sampleFoods: FoodItem[] = [
  {
    id: '1',
    foodName: 'Bánh Mì Ram Ram',
    imageUrl: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    likes: 100
  },
  {
    id: '2',
    foodName: 'Phở Bò',
    imageUrl: 'https://bizweb.dktcdn.net/100/479/802/files/ham-luong-calo-trong-pho-bo-1024x712-jpeg.jpg?v=1722918596207',
    difficulty: 'Trung bình',
    cookingTime: '2h30m',
    likes: 150
  },
];

export const sampleComments: CommentItem[] = [
  {
    id: 1,
    content: "Mình đã thử làm món này, rất ngon và dễ làm! Các bạn nên thử nhé 😊",
    like: "15",
    account: sampleAccounts[0],
    food: sampleFoods[0]
  },
  {
    id: 2,
    content: "Công thức rất chi tiết, làm theo không khó. Cảm ơn đã chia sẻ 👍",
    like: "8",
    account: sampleAccounts[1],
    food: sampleFoods[1]
  }
];