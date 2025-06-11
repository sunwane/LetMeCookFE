import { AccountItem } from "@/services/types/AccountItem";
import { CommentItem } from "@/services/types/CommentItem";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width: ScreenWidth } = Dimensions.get("screen")

interface AccountBannerProps {
  account: AccountItem;
  comments: CommentItem[];
}
const AccountBanner = ({ account, comments }: AccountBannerProps) => {  
  // Tính toán số hoạt động (comments)
  const activityCount = comments.filter(comment => comment.account.id === account.id).length

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/AccountBackground.png")} style={styles.background} resizeMode="cover" />

      <View style={styles.whiteOverlay} />

      <View style={styles.contentContainer}>
        <Image source={{ uri: account.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{account.userName}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Công thức</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activityCount}</Text>
            <Text style={styles.statLabel}>Hoạt động</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 280,
    backgroundColor: "#f5f5f5",
  },
  background: {
    width: ScreenWidth,
    height: 280,
    position: "absolute",
    top: 0,
    left: 0,
  },
  whiteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(234, 234, 234, 0.85)",
  },
  contentContainer: {
    paddingTop: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#ddd",
  },
})

export default AccountBanner