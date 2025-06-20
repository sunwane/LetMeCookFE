import FilterSection from '@/components/FilterSection';
import SearchBar from '@/components/searchbar';
import '@/config/globalTextConfig';
import { sampleCategories } from '@/services/types/Category';
import { sampleSubCategories } from '@/services/types/SubCategoryItem';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import SelectedTags from './SelectedTags';

interface FilterDialogProps {
  visible: boolean;
  onClose: () => void;
  onApply: (tags: string[]) => void;
  initialSelectedTags?: string[];
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FilterDialog = ({ visible, onClose, onApply, initialSelectedTags = [] }: FilterDialogProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  // Keyboard listeners
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

  // Hàm filter categories và subcategories dựa trên search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      return sampleCategories.map(category => ({
        category,
        subCategories: sampleSubCategories.filter(sub => sub.category?.id === category.id)
      }));
    }

    const filteredData = sampleCategories
      .map(category => {
        const matchingSubCategories = sampleSubCategories.filter(sub => 
          sub.category?.id === category.id &&
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const categoryMatches = category.name.toLowerCase().includes(searchQuery.toLowerCase());

        return {
          category,
          subCategories: categoryMatches 
            ? sampleSubCategories.filter(sub => sub.category?.id === category.id)
            : matchingSubCategories
        };
      })
      .filter(({ category, subCategories }) => {
        const categoryMatches = category.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatches || subCategories.length > 0;
      });

    return filteredData;
  };

  // Hàm xử lý search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const groupedSubCategories = getFilteredData();

  // Hàm thêm/xóa tag
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  // Hàm xóa tag cụ thể
  const removeTag = (tagName: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagName));
  };

  // Hàm reset tất cả tags
  const resetTags = () => {
    setSelectedTags([]);
  };

  // Hàm apply filter
  const handleApply = () => {
    onApply(selectedTags);
  };

  // Hàm close mà không apply
  const handleClose = () => {
    setSelectedTags(initialSelectedTags);
    onClose();
  };

  // Tính toán layout động dựa trên keyboard
  const getContainerStyle = () => {
    if (isKeyboardVisible) {
      // Khi keyboard hiện: dialog chiếm toàn màn hình
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: screenHeight,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      };
    }
    
    // Khi keyboard ẩn: dialog bình thường
    return {
      height: screenHeight * 2/3,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    };
  };

  const getContentHeight = () => {
    const headerHeight = 120; // Estimate
    const footerHeight = 80;  // Estimate
    
    if (isKeyboardVisible) {
      // Khi keyboard hiện: content chiếm từ dưới header đến trên footer
      return screenHeight - headerHeight - footerHeight;
    }
    
    // Khi keyboard ẩn: content bình thường
    return (screenHeight * 2/3) - headerHeight - footerHeight;
  };

  const getFooterStyle = () => {
    if (isKeyboardVisible) {
      // Khi keyboard hiện: footer ở bottom của màn hình (có thể bị che bởi keyboard)
      return {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
      };
    }
    
    // Khi keyboard ẩn: footer bình thường
    return {
      backgroundColor: '#fff',
    };
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={[
          styles.overlay,
          isKeyboardVisible && { backgroundColor: 'rgba(0, 0, 0, 0.3)' } // Làm mờ overlay khi keyboard hiện
        ]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[
              styles.container,
              getContainerStyle()
            ]}>
              {/* Header cố định ở top */}
              <View style={[
                styles.headerContainer,
                isKeyboardVisible && styles.headerWithKeyboard
              ]}>
                <SearchBar 
                  searchMode="FindCategory"
                  onFilterChange={handleSearchChange}
                  placeholder="Tìm kiếm thể loại..."
                  containerStyle={styles.searchBarInDialog}
                />
                
                {selectedTags.length > 0 && (
                  <View style={styles.selectedTagsWrapper}>
                    <SelectedTags 
                      tags={selectedTags} 
                      onRemoveTag={removeTag}
                    />
                  </View>
                )}
              </View>
              
              {/* Content scrollable với chiều cao động */}
              <ScrollView 
                style={[
                  styles.content,
                  { height: getContentHeight() }
                ]} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
              >
                {groupedSubCategories.length > 0 ? (
                  groupedSubCategories.map(({ category, subCategories }) => (
                    <FilterSection key={category.id} title={category.name}>
                      {subCategories.length > 0 ? (
                        subCategories.map((subCategory) => (
                          <TouchableOpacity 
                            key={subCategory.id} 
                            style={[
                              styles.filterItem,
                              selectedTags.includes(subCategory.name) && styles.selectedFilterItem
                            ]}
                            onPress={() => toggleTag(subCategory.name)}
                          >
                            <Text style={[
                              styles.filterItemText,
                              selectedTags.includes(subCategory.name) && styles.selectedFilterItemText
                            ]}>
                              {subCategory.name}
                            </Text>
                            {selectedTags.includes(subCategory.name) && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyCategory}>
                          <Text style={styles.emptyCategoryText}>
                            Không có món ăn phù hợp
                          </Text>
                        </View>
                      )}
                    </FilterSection>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      Không tìm thấy thể loại nào phù hợp với "{searchQuery}"
                    </Text>
                  </View>
                )}
                
                {/* Subcategories không có category */}
                {(() => {
                  const uncategorizedSubs = sampleSubCategories.filter(sub => 
                    !sub.category &&
                    (searchQuery === '' || sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  );
                  return uncategorizedSubs.length > 0 ? (
                    <FilterSection title="Khác">
                      {uncategorizedSubs.map((subCategory) => (
                        <TouchableOpacity 
                          key={subCategory.id} 
                          style={[
                            styles.filterItem,
                            selectedTags.includes(subCategory.name) && styles.selectedFilterItem
                          ]}
                          onPress={() => toggleTag(subCategory.name)}
                        >
                          <Text style={[
                            styles.filterItemText,
                            selectedTags.includes(subCategory.name) && styles.selectedFilterItemText
                          ]}>
                            {subCategory.name}
                          </Text>
                          {selectedTags.includes(subCategory.name) && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </FilterSection>
                  ) : null;
                })()}
                
                {/* Thêm padding bottom để tránh content bị che bởi footer khi keyboard hiện */}
                {isKeyboardVisible && <View style={{ height: 100 }} />}
              </ScrollView>
              
              {/* Footer - vị trí thay đổi theo keyboard state */}
              <View style={[
                styles.footer,
                getFooterStyle()
              ]}>
                <TouchableOpacity style={styles.resetButton} onPress={resetTags}>
                  <Text style={styles.resetText}>Đặt lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyText}>Áp dụng ({selectedTags.length})</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    maxHeight: screenHeight,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  headerWithKeyboard: {
    paddingTop: 50, // Thêm padding top khi keyboard hiện để tránh status bar
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  searchBarInDialog: {
    marginHorizontal: 0,
    marginBottom: 10,
  },
  selectedTagsWrapper: {
    marginBottom: 10,
  },
  content: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedFilterItem: {
    backgroundColor: '#FFF5F0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF5D00',
  },
  filterItemText: {
    fontSize: 15,
    color: '#666',
  },
  selectedFilterItemText: {
    color: '#FF5D00',
    fontWeight: '500',
  },
  checkmark: {
    color: '#FF5D00',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCategory: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5D00',
    alignItems: 'center',
  },
  resetText: {
    color: '#FF5D00',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF5D00',
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default FilterDialog;