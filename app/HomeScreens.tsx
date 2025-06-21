import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { foodData } from "@/services/types/RecipeItem";
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

export default function HomeScreens() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.background}>
      {/* SearchBar wrapper - không dùng KeyboardAvoidingView */}
      <View style={[
        styles.searchBarWrapper,
        isKeyboardVisible && {
          // Chỉ điều chỉnh một chút khi keyboard hiện
          paddingTop: Math.max(40, 60 - keyboardHeight * 0.05),
        }
      ]}>
        <SearchBar 
          containerStyle={[
            styles.searchBarContainer,
            isKeyboardVisible && styles.searchBarWithKeyboard
          ]}
        />
      </View>
      
      <ScrollView 
        style={styles.maincontainer}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && {
            // Giảm padding bottom để tránh TabBar bị đẩy lên
            paddingBottom: Math.max(25, 25 - keyboardHeight * 0.1),
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HotRecommended foods={foodData} />
        <RcmCategoryGroup />
        <N2xRecipeGroup 
          title="Món ăn nổi bật"
          foods={foodData}
        />
        <N2xRecipeGroup 
          title="Món ngọt hấp dẫn"
          foods={foodData}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBarWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 70,
    paddingBottom: 20,
    zIndex: 100, // Đảm bảo SearchBar ở trên
  },
  searchBarContainer: {
    marginHorizontal: 5,
  },
  searchBarWithKeyboard: {
    // Có thể thêm style đặc biệt khi keyboard hiện
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  maincontainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  scrollContent: {
    gap: 25,
    paddingHorizontal: 10,
    paddingBottom: 100, // Thêm padding để tránh content bị che bởi TabBar
  }
});