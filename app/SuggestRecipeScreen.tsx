import AddStep from '@/components/AddStep';
import { getAllIngredients, Ingredients } from '@/services/types/Ingredients';
import { createRecipeIngredient, RecipeIngredientsCreationRequest } from '@/services/types/RecipeIngredients';
import { createRecipe, RecipeCreationRequest } from '@/services/types/RecipeItem';
import { createRecipeStep, RecipeStepsCreationRequest } from '@/services/types/RecipeStep';
import { getAllSubCategories, SubCategoryItem } from '@/services/types/SubCategoryItem';
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

// ✅ UPDATED: Step interface với waiting time
interface Step {
  id: string;
  content: string;
  stepImage?: string;
  waitingTime?: string; // ✅ NEW: Add waiting time
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

  // ✅ NEW: State để quản lý subcategories
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryItem | null>(null);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');

  // ✅ NEW: State để quản lý ingredients từ API
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

  // Thêm state
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // ✅ Chọn ảnh từ thư viện cho main dish - UPDATED: Không cắt ảnh
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // ✅ UPDATED: Không cho phép cắt ảnh
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

  // ✅ Filter ingredients based on search từ API data
  const getFilteredIngredients = (searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) return [];
    
    return allIngredients.filter(ingredient =>
      ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 results for better UX
  };

  // ✅ Tìm ingredient giống nhất từ API data
  const findBestMatch = (searchTerm: string): Ingredients | null => {
    if (!searchTerm.trim()) return null;
    
    const filtered = allIngredients.filter(ingredient =>
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
    setSteps([...steps, { id: newId, content: '', stepImage: undefined, waitingTime: undefined }]); // ✅ Add waitingTime
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

  // ✅ NEW: Update step waiting time
  const updateStepWaitingTime = (stepId: string, waitingTime: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { ...step, waitingTime }
          : step
      )
    );
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
    if (!selectedSubCategory) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục món ăn!');
      return false;
    }

    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.amount.trim() && ing.selectedIngredient
    );
    if (validIngredients.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 nguyên liệu hợp lệ!');
      return false;
    }

    const validSteps = steps.filter(step => step.content.trim());
    if (validSteps.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 bước làm!');
      return false;
    }

    return true;
  };

  // ✅ Lưu công thức và chuyển về HomeScreen
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // ✅ Step 1: Create Recipe
      console.log('🔄 Step 1: Creating recipe...');
      
      // Convert image URI to proper format for React Native
      const imageFile = await uriToFile(selectedImage!, `recipe-${Date.now()}.jpg`);
      
      const recipeData: RecipeCreationRequest = {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty,
        cookingTime: cookingTime.trim(),
      };

      const recipeResponse = await createRecipe(
        selectedSubCategory!.id, 
        recipeData, 
        imageFile as any // Type assertion for React Native
      );

      if (!recipeResponse?.result?.id) {
        throw new Error('Không thể tạo công thức. Vui lòng thử lại!');
      }

      const recipeId = recipeResponse.result.id;
      console.log('✅ Recipe created with ID:', recipeId);

      // ✅ Step 2: Create Recipe Ingredients
      console.log('🔄 Step 2: Creating ingredients...');
      
      const validIngredients = ingredients.filter(ing => 
        ing.name.trim() && ing.amount.trim() && ing.selectedIngredient
      );

      for (const ingredient of validIngredients) {
        const ingredientData: RecipeIngredientsCreationRequest = {
          recipeId: recipeId,
          ingredientId: ingredient.selectedIngredient!.id,
          quantity: parseFloat(ingredient.amount) || 0,
        };

        try {
          const result = await createRecipeIngredient(ingredientData);
          console.log(`✅ Ingredient created:`, result);
        } catch (error) {
          console.error(`❌ Failed to create ingredient ${ingredient.name}:`, error);
          throw error;
        }
      }

      console.log('✅ All ingredients created successfully');

      // ✅ Step 3: Create Recipe Steps
      console.log('🔄 Step 3: Creating steps...');
      
      const validSteps = steps.filter(step => step.content.trim());

      for (let index = 0; index < validSteps.length; index++) {
        const step = validSteps[index];
        
        try {
          let stepImageFile: any = undefined;
          
          // Convert step image to proper format if exists
          if (step.stepImage) {
            stepImageFile = await uriToFile(step.stepImage, `step-${index + 1}-${Date.now()}.jpg`);
          }

          const stepData: RecipeStepsCreationRequest = {
            step: index + 1,
            description: step.content.trim(),
            waitingTime: step.waitingTime?.trim() || undefined, // ✅ UPDATED: Include waiting time
          };

          const result = await createRecipeStep(recipeId, stepData, stepImageFile);
          console.log(`✅ Step ${index + 1} created successfully`);
        } catch (error) {
          console.error(`❌ Failed to create step ${index + 1}:`, error);
          throw error;
        }
      }

      console.log('✅ All steps created successfully');

      // ✅ SUCCESS: Reset form và chuyển về HomeScreen
      resetForm();
      router.back();
      
    } catch (error) {
      console.error('❌ Save recipe error:', error);
      
      let errorMessage = 'Không thể lưu công thức. Vui lòng thử lại!';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED: Helper function để convert URI to File cho React Native
  const uriToFile = async (uri: string, filename: string) => {
    // Tạo FormData compatible object cho React Native
    return {
      uri: uri,
      type: 'image/jpeg', // hoặc 'image/png'
      name: filename,
    };
  };

  // ✅ Helper function: Reset form
  const resetForm = () => {
    setSelectedImage(null);
    setTitle('');
    setDescription('');
    setCookingTime('');
    setSelectedSubCategory(null);
    setDifficulty('EASY');
    setIngredients([{ id: '1', name: '', amount: '' }]);
    setSteps([{ id: '1', content: '', stepImage: undefined, waitingTime: undefined }]); // ✅ Add waitingTime
    setIngredientSearches({});
    setShowDropdowns({});
  };

  // ✅ SubCategory selection functions
  const selectSubCategory = (subCategory: SubCategoryItem) => {
    setSelectedSubCategory(subCategory);
    setShowSubCategoryDropdown(false);
  };

  // Hàm toggle dropdown
  const handleToggleSubCategoryDropdown = () => {
    setShowSubCategoryDropdown((prev) => {
      const next = !prev;
      setScrollEnabled(!next);
      return next;
    });
  };

  useEffect(() => {
    // Auto close dropdowns khi scroll
    const handleScroll = () => {
      closeAllDropdowns();
    };
    
    // ✅ Fetch ingredients khi component mount
    const fetchIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const response = await getAllIngredients();
        console.log('SuggestRecipeScreen - Ingredients response:', response);
        
        if (response?.result && Array.isArray(response.result)) {
          setAllIngredients(response.result);
        } else {
          // Fallback to sample data if API fails
          console.log('Using sample ingredients as fallback');
          setAllIngredients([]);
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        // Fallback to sample data
        setAllIngredients([]);
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    // ✅ Fetch subcategories khi component mount
    const fetchSubCategories = async () => {
      try {
        const response = await getAllSubCategories();
        if (response?.result && Array.isArray(response.result)) {
          setSubCategories(response.result);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchIngredients();
    fetchSubCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* ✅ Custom Header - Removed all icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
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

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeAllDropdowns}
          onMomentumScrollBegin={closeAllDropdowns}
          scrollEnabled={scrollEnabled} // Thêm dòng này
        >
          {/* ✅ Ảnh món ăn - Removed camera icon */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ảnh món ăn *</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
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

          {/* ✅ Danh mục món ăn - Removed chevron icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danh mục món ăn *</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={handleToggleSubCategoryDropdown}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedSubCategory && styles.placeholderText
              ]}>
                {selectedSubCategory?.subCategoryName || 'Chọn danh mục món ăn'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {showSubCategoryDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showSubCategoryDropdown && (
              <View style={styles.dropdown}>
                <ScrollView style={{ maxHeight: 250 }}>
                  {subCategories.map((subCategory) => (
                    <TouchableOpacity
                      key={subCategory.id}
                      style={styles.dropdownItem}
                      onPress={() => selectSubCategory(subCategory)}
                    >
                      <Text style={styles.dropdownItemName}>{subCategory.subCategoryName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* ✅ Độ khó */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Độ khó *</Text>
            <View style={styles.difficultyContainer}>
              {[
                { key: 'EASY', label: 'Dễ', color: '#4CAF50' },
                { key: 'MEDIUM', label: 'Trung bình', color: '#FF9800' },
                { key: 'HARD', label: 'Khó', color: '#F44336' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.difficultyButton,
                    difficulty === item.key && { backgroundColor: item.color }
                  ]}
                  onPress={() => setDifficulty(item.key as 'EASY' | 'MEDIUM' | 'HARD')}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    difficulty === item.key && { color: '#fff' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ✅ Nguyên liệu - Removed add icon */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Nguyên liệu * 
                {isLoadingIngredients && (
                  <Text style={styles.loadingText}> (Đang tải...)</Text>
                )}
              </Text>
              <TouchableOpacity 
                onPress={addIngredient} 
                style={[styles.addButton, isLoadingIngredients && styles.addButtonDisabled]}
                disabled={isLoadingIngredients}
              >
                <Text style={[styles.addButtonText, isLoadingIngredients && styles.addButtonTextDisabled]}>
                  + Thêm
                </Text>
              </TouchableOpacity>
            </View>
            
            {ingredients.map((ingredient, index) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <View style={styles.ingredientNumber}>
                  <Text style={styles.ingredientNumberText}>{index + 1}</Text>
                </View>
                
                {/* ✅ Ingredient Name Input */}
                <View style={[styles.ingredientInputContainer, styles.ingredientName]}>
                  <TextInput
                    style={[
                      styles.ingredientInput,
                      isLoadingIngredients && styles.ingredientInputDisabled
                    ]}
                    placeholder={isLoadingIngredients ? "Đang tải nguyên liệu..." : "Tên nguyên liệu"}
                    value={ingredientSearches[ingredient.id] || ingredient.name}
                    onChangeText={(text) => updateIngredient(ingredient.id, 'name', text)}
                    onFocus={() => {
                      if ((ingredientSearches[ingredient.id] || ingredient.name).trim() && !isLoadingIngredients) {
                        setShowDropdowns(prev => ({ ...prev, [ingredient.id]: true }));
                      }
                    }}
                    onBlur={() => handleIngredientBlur(ingredient.id)}
                    editable={!isLoadingIngredients}
                  />
                  
                  {/* ✅ Dropdown */}
                  {showDropdowns[ingredient.id] && 
                   (ingredientSearches[ingredient.id] || ingredient.name) && 
                   !isLoadingIngredients && (
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
                          <Text style={styles.dropdownNoResult}>
                            {allIngredients.length === 0 
                              ? "Chưa có dữ liệu nguyên liệu" 
                              : "Không tìm thấy nguyên liệu"
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                
                {/* ✅ Amount Input */}
                <View style={[styles.ingredientInputContainer, styles.ingredientAmount]}>
                  <TextInput
                    style={[
                      styles.ingredientInput, 
                      ingredient.selectedIngredient && styles.amountInputWithUnit,
                      isLoadingIngredients && styles.ingredientInputDisabled
                    ]}
                    placeholder="Số lượng"
                    value={ingredient.amount}
                    onChangeText={(text) => updateIngredient(ingredient.id, 'amount', text)}
                    keyboardType="numeric"
                    onFocus={closeAllDropdowns}
                    editable={!isLoadingIngredients}
                  />
                  {/* ✅ Unit display bên phải */}
                  {ingredient.selectedIngredient && (
                    <Text style={styles.unitDisplay}>
                      {getIngredientUnit(ingredient)}
                    </Text>
                  )}
                </View>
                
                {/* ✅ Remove Button - Removed trash icon */}
                {ingredients.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeIngredient(ingredient.id)}
                    style={[styles.removeButton, isLoadingIngredients && styles.removeButtonDisabled]}
                    disabled={isLoadingIngredients}
                  >
                    <Text style={[
                      styles.removeButtonText, 
                      isLoadingIngredients && { color: '#ccc' }
                    ]}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* ✅ No ingredients message */}
            {allIngredients.length === 0 && !isLoadingIngredients && (
              <View style={styles.noIngredientsContainer}>
                <Text style={styles.noIngredientsText}>
                  Không thể tải dữ liệu nguyên liệu. Vui lòng thử lại sau.
                </Text>
              </View>
            )}
          </View>

          {/* ✅ Bước làm - Removed add icon */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bước làm *</Text>
              <TouchableOpacity onPress={addStep} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Thêm</Text>
              </TouchableOpacity>
            </View>
            
            <AddStep
              steps={steps}
              onUpdateStep={updateStep}
              onUpdateStepImage={updateStepImage}
              onUpdateStepWaitingTime={updateStepWaitingTime} // ✅ NEW: Add waiting time handler
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
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF5D00',
    fontWeight: '600',
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
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
    padding: 8,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  // SubCategory styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#666',
  },
  placeholderText: {
    color: '#999',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  difficultyButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // Loading styles
  loadingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonTextDisabled: {
    color: '#ccc',
  },
  ingredientInputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  noIngredientsContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    marginTop: 10,
  },
  noIngredientsText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
});