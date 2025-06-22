import AddStep from '@/components/AddStep';
import { Ingredients, sampleIngredients } from '@/services/types/Ingredients';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Step {
  id: string;
  content: string;
  stepImage?: string;
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  selectedIngredient?: Ingredients;
}

const SuggestRecipeScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    [{ id: '1', name: '', amount: '' }]
  );
  const [steps, setSteps] = useState<Step[]>(
    [{ id: '1', content: '', stepImage: undefined }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientSearches, setIngredientSearches] = useState<{ [key: string]: string }>({});
  const [showDropdowns, setShowDropdowns] = useState<{ [key: string]: boolean }>({});

  // ✅ Chọn ảnh từ thư viện cho main dish
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // ✅ Ingredient functions
  const addIngredient = () => {
    const newId = (ingredients.length + 1).toString();
    setIngredients([...ingredients, { id: newId, name: '', amount: '' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(item => item.id !== id));
    }
  };

  // ✅ Filter ingredients based on search
  const getFilteredIngredients = (searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) return [];
    
    return sampleIngredients.filter(ingredient =>
      ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 results for better UX
  };

  // ✅ Tìm ingredient giống nhất
  const findBestMatch = (searchTerm: string): Ingredients | null => {
    if (!searchTerm.trim()) return null;
    
    const filtered = sampleIngredients.filter(ingredient =>
      ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length === 0) return null;
    
    // Tìm exact match trước
    const exactMatch = filtered.find(ingredient => 
      ingredient.ingredientName.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Tìm match bắt đầu bằng search term
    const startsWith = filtered.find(ingredient =>
      ingredient.ingredientName.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    if (startsWith) return startsWith;
    
    // Return first match
    return filtered[0];
  };

  // ✅ Close all dropdowns
  const closeAllDropdowns = () => {
    setShowDropdowns({});
  };

  // ✅ Update ingredient function
  const updateIngredient = (id: string, field: 'name' | 'amount', value: string) => {
    if (field === 'name') {
      // Update search term
      setIngredientSearches(prev => ({ ...prev, [id]: value }));
      
      // Clear selected ingredient if user types manually
      setIngredients(ingredients.map(item => 
        item.id === id ? { ...item, [field]: value, selectedIngredient: undefined } : item
      ));
      
      // Show dropdown nếu có text
      if (value.trim()) {
        setShowDropdowns(prev => ({ ...prev, [id]: true }));
      } else {
        setShowDropdowns(prev => ({ ...prev, [id]: false }));
      }
    } else {
      setIngredients(ingredients.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    }
  };

  // ✅ Handle khi user blur input (rời khỏi input)
  const handleIngredientBlur = (ingredientId: string) => {
    const searchTerm = ingredientSearches[ingredientId] || '';
    
    if (searchTerm.trim()) {
      const bestMatch = findBestMatch(searchTerm);
      
      if (bestMatch) {
        // Tự động chọn ingredient giống nhất
        selectIngredient(ingredientId, bestMatch);
      }
    }
    
    // Đóng dropdown sau delay nhỏ để user có thể click dropdown item
    setTimeout(() => {
      setShowDropdowns(prev => ({ ...prev, [ingredientId]: false }));
    }, 150);
  };

  // ✅ Select ingredient từ dropdown
  const selectIngredient = (ingredientId: string, selectedIngredient: Ingredients) => {
    setIngredients(ingredients.map(item => 
      item.id === ingredientId 
        ? { ...item, name: selectedIngredient.ingredientName, selectedIngredient } 
        : item
    ));
    
    // Update search và hide dropdown
    setIngredientSearches(prev => ({ ...prev, [ingredientId]: selectedIngredient.ingredientName }));
    setShowDropdowns(prev => ({ ...prev, [ingredientId]: false }));
  };

  // ✅ Get unit display for ingredient
  const getIngredientUnit = (ingredient: Ingredient) => {
    if (ingredient.selectedIngredient) {
      return ingredient.selectedIngredient.measurementUnit;
    }
    return ''; // Empty string thay vì 'đơn vị'
  };

  // ✅ Step functions
  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, content: '', stepImage: undefined }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id));
    }
  };

  const updateStep = (id: string, content: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, content } : step
    ));
  };

  const updateStepImage = (id: string, stepImage: string | undefined) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, stepImage } : step
    ));
  };

  const moveStepUp = (stepId: string) => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex > 0) {
      const newSteps = [...steps];
      const temp = newSteps[currentIndex];
      newSteps[currentIndex] = newSteps[currentIndex - 1];
      newSteps[currentIndex - 1] = temp;
      setSteps(newSteps);
    }
  };

  const moveStepDown = (stepId: string) => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      const newSteps = [...steps];
      const temp = newSteps[currentIndex];
      newSteps[currentIndex] = newSteps[currentIndex + 1];
      newSteps[currentIndex + 1] = temp;
      setSteps(newSteps);
    }
  };

  const moveStepToPosition = (stepId: string, newPosition: number) => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex !== -1 && newPosition >= 0 && newPosition < steps.length) {
      const newSteps = [...steps];
      const stepToMove = newSteps.splice(currentIndex, 1)[0];
      newSteps.splice(newPosition, 0, stepToMove);
      setSteps(newSteps);
    }
  };

  // ✅ Validate form
  const validateForm = () => {
    if (!selectedImage) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh món ăn!');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề món ăn!');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả món ăn!');
      return false;
    }
    if (!cookingTime.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập thời gian nấu!');
      return false;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
    if (validIngredients.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 nguyên liệu!');
      return false;
    }

    const validSteps = steps.filter(step => step.content.trim());
    if (validSteps.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 bước làm!');
      return false;
    }

    return true;
  };

  // ✅ Lưu công thức
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        cookingTime: cookingTime.trim(),
        image: selectedImage,
        ingredients: ingredients.filter(ing => ing.name.trim() && ing.amount.trim()),
        steps: steps.filter(step => step.content.trim()).map(step => ({
          content: step.content.trim(),
          stepImage: step.stepImage || null,
        })),
        createdAt: new Date().toISOString(),
      };

      console.log('📝 Recipe data to save:', recipeData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Thành công', 
        'Công thức đã được đề xuất thành công!',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Save recipe error:', error);
      Alert.alert('Lỗi', 'Không thể lưu công thức. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto close dropdowns khi scroll
    const handleScroll = () => {
      closeAllDropdowns();
    };
    
    return () => {
      // Cleanup nếu cần
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* ✅ Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF5D00" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Đề xuất món ăn</Text>
        
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeAllDropdowns}
          onMomentumScrollBegin={closeAllDropdowns}
        >
          {/* ✅ Ảnh món ăn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ảnh món ăn *</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>Chọn ảnh món ăn</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ✅ Tiêu đề món ăn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiêu đề món ăn *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tên món ăn..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* ✅ Mô tả món ăn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả món ăn *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Mô tả về món ăn, nguồn gốc, đặc điểm..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* ✅ Thời gian nấu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thời gian nấu *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="VD: 30 phút, 1 giờ 15 phút..."
              value={cookingTime}
              onChangeText={setCookingTime}
              maxLength={50}
            />
          </View>

          {/* ✅ Nguyên liệu với auto-select và unit display */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nguyên liệu *</Text>
              <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FF5D00" />
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
            
            {ingredients.map((ingredient, index) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <View style={styles.ingredientNumber}>
                  <Text style={styles.ingredientNumberText}>{index + 1}</Text>
                </View>
                
                {/* ✅ Ingredient Name Input với auto-select */}
                <View style={[styles.ingredientInputContainer, styles.ingredientName]}>
                  <TextInput
                    style={styles.ingredientInput}
                    placeholder="Tên nguyên liệu"
                    value={ingredientSearches[ingredient.id] || ingredient.name}
                    onChangeText={(text) => updateIngredient(ingredient.id, 'name', text)}
                    onFocus={() => {
                      if ((ingredientSearches[ingredient.id] || ingredient.name).trim()) {
                        setShowDropdowns(prev => ({ ...prev, [ingredient.id]: true }));
                      }
                    }}
                    onBlur={() => handleIngredientBlur(ingredient.id)}
                  />
                  
                  {/* ✅ Dropdown with search results */}
                  {showDropdowns[ingredient.id] && (ingredientSearches[ingredient.id] || ingredient.name) && (
                    <View style={styles.dropdown}>
                      {getFilteredIngredients(ingredientSearches[ingredient.id] || ingredient.name).map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownItem}
                          onPress={() => selectIngredient(ingredient.id, item)}
                        >
                          <Text style={styles.dropdownItemName}>{item.ingredientName}</Text>
                          <Text style={styles.dropdownItemUnit}>{item.measurementUnit}</Text>
                        </TouchableOpacity>
                      ))}
                      {getFilteredIngredients(ingredientSearches[ingredient.id] || ingredient.name).length === 0 && (
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownNoResult}>Không tìm thấy nguyên liệu</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                
                {/* ✅ Amount Input với unit display */}
                <View style={[styles.ingredientInputContainer, styles.ingredientAmount]}>
                  <TextInput
                    style={[
                      styles.ingredientInput, 
                      ingredient.selectedIngredient && styles.amountInputWithUnit
                    ]}
                    placeholder="Số lượng"
                    value={ingredient.amount}
                    onChangeText={(text) => updateIngredient(ingredient.id, 'amount', text)}
                    keyboardType="numeric"
                    onFocus={closeAllDropdowns}
                  />
                  {/* ✅ Unit display bên phải */}
                  {ingredient.selectedIngredient && (
                    <Text style={styles.unitDisplay}>
                      {getIngredientUnit(ingredient)}
                    </Text>
                  )}
                </View>
                
                {ingredients.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeIngredient(ingredient.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash" size={18} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* ✅ Bước làm với component riêng */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bước làm *</Text>
              <TouchableOpacity onPress={addStep} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FF5D00" />
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
            
            <AddStep
              steps={steps}
              onUpdateStep={updateStep}
              onUpdateStepImage={updateStepImage}
              onMoveStepUp={moveStepUp}
              onMoveStepDown={moveStepDown}
              onMoveStepToPosition={moveStepToPosition}
              onRemoveStep={removeStep}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SuggestRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF5D00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
    color: '#FF5D00',
    fontSize: 14,
    fontWeight: '500',
  },
  // Image styles
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  // Input styles
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // Ingredient styles
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  ingredientNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5D00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientName: {
    flex: 1.7,
  },
  ingredientAmount: {
    flex: 1.3, // Tăng từ 1 lên 1.33 (tăng 1/3)
    maxHeight: 200,
  },
  removeButton: {
    padding: 6,
  },
  // Step styles
  stepContainer: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    position: 'relative',
  },
  stepContent: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10,
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  stepActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepButton: {
    backgroundColor: '#FF5D00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  removeStepButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  removeStepButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // ✅ Enhanced Ingredient Styles
  ingredientInputContainer: {
    position: 'relative',
  },
  ingredientInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  amountInputWithUnit: {
    paddingRight: 50, // Space for unit display
  },
  unitDisplay: {
    position: 'absolute',
    right: 10,
    top: 11,
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    backgroundColor: '#fff',
  },

  // ✅ Updated Dropdown Styles
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 2,
    maxHeight: 250,
    zIndex: 1000,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownItemUnit: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dropdownNoResult: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});