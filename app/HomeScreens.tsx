import HotRecommended from "@/components/hotRecommended";
import SearchBar from "@/components/searchbar";
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreens() {
  return (
    <View style={styles.body}>
        <SearchBar />
        <ScrollView style={styles.maincontainer}>
            <HotRecommended />
        </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    body: {
        marginHorizontal: 10,
    },
    maincontainer: {
        flex: 1,
        marginTop: 25,
        marginHorizontal: 10,
    },
});