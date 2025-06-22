import HotRecommended from "@/components/hotRecommended";
import N2xRecipeGroup from "@/components/Nx2RecipeGroup";
import RcmCategoryGroup from "@/components/rcmCategoryGroup";
import SearchBar from "@/components/searchbar";
import { foodData } from "@/services/types/RecipeItem";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

  // ✅ Handler cho button đề xuất món
  const handleSuggestRecipe = () => {
    router.push('/SuggestRecipeScreen');
  };

  return (
    <View style={styles.background}>
      {/* SearchBar wrapper */}
      <View style={[
        styles.searchBarWrapper,
        isKeyboardVisible && {
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

      {/* ✅ Floating Action Button - Đề xuất món */}
      <TouchableOpacity 
        style={[
          styles.floatingButton,
          isKeyboardVisible && {
            bottom: 90 + keyboardHeight * 0.1, // Điều chỉnh vị trí khi keyboard hiện
          }
        ]}
        onPress={handleSuggestRecipe}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
    zIndex: 100,
  },
  searchBarContainer: {
    marginHorizontal: 5,
  },
  searchBarWithKeyboard: {
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
    paddingBottom: 100,
  },
  // ✅ Floating Action Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Trên TabBar (70px height + 20px margin)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5D00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#FF5D00', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000, // Đảm bảo nằm trên tất cả
  },
});