import FilterSection from '@/components/FilterSection';
import SearchBar from '@/components/searchbar';
import '@/config/globalTextConfig';
import { sampleCategories } from '@/services/types/Category';
import { sampleSubCategories } from '@/services/types/SubCategoryItem';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
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
  onApply: (tags: string[]) => void; // Thêm prop onApply
  initialSelectedTags?: string[]; // Thêm prop để nhận tags hiện tại
}

const { height: screenHeight } = Dimensions.get('window');

const FilterDialog = ({ visible, onClose, onApply, initialSelectedTags = [] }: FilterDialogProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [searchQuery, setSearchQuery] = useState(''); // Thêm state cho search

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  // Hàm filter categories và subcategories dựa trên search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      // Nếu không có search query, hiển thị tất cả
      return sampleCategories.map(category => ({
        category,
        subCategories: sampleSubCategories.filter(sub => sub.category?.id === category.id)
      }));
    }

    // Filter categories và subcategories dựa trên search query
    const filteredData = sampleCategories
      .map(category => {
        // Tìm subcategories match với search query
        const matchingSubCategories = sampleSubCategories.filter(sub => 
          sub.category?.id === category.id &&
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Kiểm tra xem category name có match không
        const categoryMatches = category.name.toLowerCase().includes(searchQuery.toLowerCase());

        return {
          category,
          subCategories: categoryMatches 
            ? sampleSubCategories.filter(sub => sub.category?.id === category.id) // Hiển thị tất cả sub nếu category match
            : matchingSubCategories // Chỉ hiển thị sub match nếu category không match
        };
      })
      .filter(({ category, subCategories }) => {
        // Chỉ giữ lại category nếu:
        // 1. Tên category match với search query, hoặc
        // 2. Có ít nhất 1 subcategory match
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
    onApply(selectedTags); // Truyền selectedTags về SearchResults
  };

  // Hàm close mà không apply
  const handleClose = () => {
    setSelectedTags(initialSelectedTags); // Reset về tags ban đầu
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              {/* SearchBar với chế độ FindCategory */}
              <SearchBar 
                searchMode="FindCategory"
                onFilterChange={handleSearchChange}
                placeholder="Tìm kiếm thể loại..."
                containerStyle={{
                  backgroundColor: '#fff',
                  paddingBottom: 0,
                  paddingTop: 0,
                  paddingHorizontal: -10,
                  marginHorizontal: -10,
                  marginBottom: 15,
                }}
              />
              
              {/* SelectedTags với horizontal scroll */}
              {selectedTags.length > 0 && (
                <View style={styles.selectedTagsWrapper}>
                  <SelectedTags 
                    tags={selectedTags} 
                    onRemoveTag={removeTag}
                  />
                </View>
              )}
              
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Render filtered categories và subcategories */}
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
                
                {/* Subcategories không có category (nếu có) */}
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
              </ScrollView>
              
              <View style={styles.footer}>
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

// Thêm styles mới
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    height: screenHeight * 2/3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
  selectedTagsWrapper: {
    marginBottom: 10,
  },
  selectedTagsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
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