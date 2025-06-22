import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
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
    [{ id: '1', content: '' }]
  );
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Chọn ảnh từ thư viện
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

  // ✅ Thêm nguyên liệu mới
  const addIngredient = () => {
    const newId = (ingredients.length + 1).toString();
    setIngredients([...ingredients, { id: newId, name: '', amount: '' }]);
  };

  // ✅ Xóa nguyên liệu
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(item => item.id !== id));
    }
  };

  // ✅ Cập nhật nguyên liệu
  const updateIngredient = (id: string, field: 'name' | 'amount', value: string) => {
    setIngredients(ingredients.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // ✅ Thêm bước làm mới
  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, content: '' }]);
  };

  // ✅ Xóa bước làm
  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id));
    }
  };

  // ✅ Cập nhật bước làm
  const updateStep = (id: string, content: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, content } : step
    ));
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
      // TODO: Implement API call để lưu công thức
      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        cookingTime: cookingTime.trim(),
        image: selectedImage,
        ingredients: ingredients.filter(ing => ing.name.trim() && ing.amount.trim()),
        steps: steps.filter(step => step.content.trim()),
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

          {/* ✅ Nguyên liệu */}
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
                <TextInput
                  style={[styles.textInput, styles.ingredientName]}
                  placeholder="Tên nguyên liệu"
                  value={ingredient.name}
                  onChangeText={(text) => updateIngredient(ingredient.id, 'name', text)}
                />
                <TextInput
                  style={[styles.textInput, styles.ingredientAmount]}
                  placeholder="Khối lượng"
                  value={ingredient.amount}
                  onChangeText={(text) => updateIngredient(ingredient.id, 'amount', text)}
                />
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

          {/* ✅ Bước làm */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bước làm *</Text>
              <TouchableOpacity onPress={addStep} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FF5D00" />
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
            
            {steps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>Bước {index + 1}</Text>
                  {steps.length > 1 && (
                    <TouchableOpacity 
                      onPress={() => removeStep(step.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.textInput, styles.stepContent]}
                  placeholder="Mô tả chi tiết bước làm..."
                  value={step.content}
                  onChangeText={(text) => updateStep(step.id, text)}
                  multiline
                  numberOfLines={3}
                />
              </View>
            ))}
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
    flex: 2,
  },
  ingredientAmount: {
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  // Step styles
  stepItem: {
    marginBottom: 15,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF5D00',
  },
  stepContent: {
    height: 60,
    textAlignVertical: 'top',
  },
});