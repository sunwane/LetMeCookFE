import FilterSection from '@/components/FilterSection';
import SearchBar from '@/components/searchbar';
import '@/config/globalTextConfig';
import { Category, getAllCategories } from '@/services/types/Category';
import { getAllSubCategories, SubCategoryItem } from '@/services/types/SubCategoryItem';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

  // State for API data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  // Fetch data when dialog becomes visible
  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Gọi cả 2 API song song để tăng tốc độ
          const [categoriesResponse, subCategoriesResponse] = await Promise.all([
            getAllCategories(),
            getAllSubCategories()
          ]);

          if (categoriesResponse?.result) {
            setCategories(categoriesResponse.result);
          }
          if (subCategoriesResponse?.result) {
            setSubCategories(subCategoriesResponse.result);
          }
        } catch (err) {
          console.error("Failed to fetch filter data:", err);
          setError("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [visible]);

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
      return categories.map(category => ({
        category,
        subCategories: subCategories.filter(sub => sub.categoryId === category.id)
      }));
    }

    const filteredData = categories
      .map(category => {
        const matchingSubCategories = subCategories.filter(sub => 
          sub.categoryId === category.id &&
          sub.subCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const categoryMatches = category.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

        return {
          category,
          subCategories: categoryMatches 
            ? subCategories.filter(sub => sub.categoryId === category.id)
            : matchingSubCategories
        };
      })
      .filter(({ category, subCategories }) => {
        const categoryMatches = category.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
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
      return screenHeight - headerHeight - footerHeight;
    }
    
    return (screenHeight * 2/3) - headerHeight - footerHeight;
  };

  const getFooterStyle = () => {
    if (isKeyboardVisible) {
      return {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
      };
    }
    
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
          isKeyboardVisible && { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
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
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FF5D00" style={{ marginTop: 50 }} />
                ) : error ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>{error}</Text>
                  </View>
                ) : groupedSubCategories.length > 0 ? (
                  groupedSubCategories.map(({ category, subCategories }) => (
                    <FilterSection key={category.id} title={category.categoryName}>
                      {subCategories.length > 0 ? (
                        subCategories.map((subCategory) => (
                          <TouchableOpacity 
                            key={subCategory.id} 
                            style={[
                              styles.filterItem,
                              selectedTags.includes(subCategory.subCategoryName) && styles.selectedFilterItem
                            ]}
                            onPress={() => toggleTag(subCategory.subCategoryName)}
                          >
                            <Text style={[
                              styles.filterItemText,
                              selectedTags.includes(subCategory.subCategoryName) && styles.selectedFilterItemText
                            ]}>
                              {subCategory.subCategoryName}
                            </Text>
                            {selectedTags.includes(subCategory.subCategoryName) && (
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
                  const uncategorizedSubs = subCategories.filter(sub => 
                    !sub.categoryId &&
                    (searchQuery === '' || sub.subCategoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                  );
                  return uncategorizedSubs.length > 0 ? (
                    <FilterSection title="Khác">
                      {uncategorizedSubs.map((subCategory) => (
                        <TouchableOpacity 
                          key={subCategory.id} 
                          style={[
                            styles.filterItem,
                            selectedTags.includes(subCategory.subCategoryName) && styles.selectedFilterItem
                          ]}
                          onPress={() => toggleTag(subCategory.subCategoryName)}
                        >
                          <Text style={[
                            styles.filterItemText,
                            selectedTags.includes(subCategory.subCategoryName) && styles.selectedFilterItemText
                          ]}>
                            {subCategory.subCategoryName}
                          </Text>
                          {selectedTags.includes(subCategory.subCategoryName) && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </FilterSection>
                  ) : null;
                })()}
                
                {isKeyboardVisible && <View style={{ height: 100 }} />}
              </ScrollView>
              
              {/* Footer */}
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
    paddingTop: 50,
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