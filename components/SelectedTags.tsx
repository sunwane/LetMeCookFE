import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectedTagsProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
}

const SelectedTags = ({ tags, onRemoveTag }: SelectedTagsProps) => {
  // Nếu không có tags thì không hiển thị gì
  if (tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scrollWrapper}>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceHorizontal={true}
          directionalLockEnabled={true}
        >
          {tags.map((tag, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.tag}
              onPress={() => {}} // Prevent scrollview interference
              activeOpacity={1}
            >
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity 
                onPress={() => onRemoveTag(tag)}
                style={styles.removeButton}
                activeOpacity={0.7}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} // Tăng vùng touch
              >
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  scrollWrapper: {
    height: 40,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    height: 35,
  },
  scrollContent: {
    paddingHorizontal: 5,
    alignItems: 'center',
    paddingRight: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5D00',
    paddingHorizontal: 8, // Giảm padding để tag ôm sát nội dung
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    height: 32,
    // Xóa minWidth và maxWidth để tag tự co giãn theo nội dung
    alignSelf: 'flex-start', // Đảm bảo tag không bị stretch
  },
  tagText: {
    color: 'white',
    fontSize: 13,
    marginRight: 4, // Khoảng cách giữa text và nút x
    flexShrink: 0, // Không cho text bị co lại
    textAlign: 'center',
  },
  removeButton: {
    paddingLeft: 0, // Xóa padding left
    paddingRight: 0, // Xóa padding right
    width: 16, // Giảm width
    height: 16, // Giảm height
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagRemove: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14, // Giảm font size cho cân đối
    lineHeight: 14,
    textAlign: 'center',
  },
});

export default SelectedTags;
