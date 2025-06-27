import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createReport,
  ReportRequest,
  ReportType,
} from "../services/types/Report";

// Define report reasons
const reportReasons = [
  "Spam hoặc quảng cáo",
  "Ngôn từ thù địch hoặc quấy rối",
  "Nội dung không phù hợp",
  "Thông tin sai lệch",
  "Vi phạm bản quyền",
  "Nội dung bạo lực",
  "Lừa đảo hoặc gian lận",
  "Khác",
];

// Props interface definition
interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  reportType: ReportType;
  reportedItemId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  userName,
  reportType,
  reportedItemId,
}) => {
  // Kiểm tra props ngay đầu component
  // Trong ReportModal.tsx
  useEffect(() => {
    // Chỉ kiểm tra khi modal đang hiển thị
    if (visible) {
      if (!reportType) {
        console.error("ReportModal: Missing reportType prop");
      }
      if (!reportedItemId) {
        console.error("ReportModal: Missing reportedItemId prop");
      }
    }
  }, [reportType, reportedItemId, visible]); // Thêm visible vào dependencies

  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<any>(null);

  // Thêm hàm toggleReason để xử lý việc chọn/bỏ chọn lý do báo cáo
  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        // Nếu lý do đã được chọn thì bỏ chọn
        return prev.filter((item) => item !== reason);
      } else {
        // Nếu lý do chưa được chọn thì thêm vào
        return [...prev, reason];
      }
    });
  };

  // Hàm chọn hình từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh để tiếp tục."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Chuẩn bị dữ liệu cho FormData
      const imageUri = result.assets[0].uri;
      const imageName = imageUri.split("/").pop() || "evidence.jpg";

      // Tạo dữ liệu ảnh cho FormData
      const imageData = {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName,
      };

      setEvidenceImage(imageData);
    }
  };

  // Hàm xóa ảnh đã chọn
  const removeImage = () => {
    setEvidenceImage(null);
  };

  // Trong handleReport, cập nhật để gửi ảnh
  const handleReport = async () => {
    if (selectedReasons.length === 0 && !customReason.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một lý do báo cáo");
      return;
    }

    // Kiểm tra lại reportType và reportedItemId trước khi gửi
    if (!reportType || !reportedItemId) {
      Alert.alert(
        "Thiếu thông tin báo cáo",
        "Không thể xác định đối tượng báo cáo. Vui lòng thử lại hoặc liên hệ hỗ trợ."
      );
      return;
    }

    Alert.alert(
      "Xác nhận báo cáo",
      `Bạn có chắc chắn muốn báo cáo ${userName}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Báo cáo",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              // Tạo dữ liệu báo cáo với đầy đủ các trường bắt buộc
              const reportData: ReportRequest = {
                reportType: reportType,
                reportedItemId: reportedItemId,
                reason:
                  selectedReasons.length > 0
                    ? selectedReasons.join(", ")
                    : customReason,
                description: customReason.trim() || undefined,
              };

              // Log dữ liệu trước khi gửi để debug
              console.log("Dữ liệu báo cáo:", reportData);

              // Gọi API để gửi báo cáo
              await createReport(reportData, evidenceImage);

              // Reset form và đóng modal
              setSelectedReasons([]);
              setCustomReason("");
              setEvidenceImage(null);

              Alert.alert("Thành công", "Báo cáo đã được gửi thành công");
              onClose();
            } catch (error) {
              console.error("Lỗi gửi báo cáo:", error);

              // Hiển thị thông báo lỗi chi tiết
              let errorMessage = "Không thể gửi báo cáo. ";
              if (error instanceof Error) {
                errorMessage += error.message;
              }

              Alert.alert("Lỗi", errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Nếu đang loading, hiển thị indicator
  if (isLoading) {
    return (
      <Modal visible={visible} transparent={true}>
        <View
          style={[
            styles.overlay,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Đang gửi báo cáo...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Báo cáo {userName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content}>
            {/* Lý do báo cáo */}
            <Text style={styles.sectionTitle}>Chọn lý do báo cáo:</Text>
            <View style={styles.reasonsContainer}>
              {reportReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    selectedReasons.includes(reason) && styles.selectedReason,
                  ]}
                  onPress={() => toggleReason(reason)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReasons.includes(reason) &&
                        styles.selectedReasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                  {selectedReasons.includes(reason) && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {/* Ô nhập lý do khác */}
            <Text style={styles.sectionTitle}>Chi tiết khác (nếu có):</Text>
            <TextInput
              style={styles.customReasonInput}
              placeholder="Mô tả chi tiết vấn đề..."
              multiline
              numberOfLines={4}
              value={customReason}
              onChangeText={setCustomReason}
            />

            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Ảnh bằng chứng (không bắt buộc)
              </Text>

              {evidenceImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: evidenceImage.uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={24} color="#0066cc" />
                  <Text style={styles.uploadButtonText}>
                    Chọn ảnh bằng chứng
                  </Text>
                </TouchableOpacity>
              )}
            </View> */}
            {/* Thông tin debug - Chỉ hiển thị khi cần debug
            <View style={styles.debugInfoContainer}>
              <Text style={styles.debugInfoText}>
                Loại báo cáo: {reportType || "Chưa xác định"}
              </Text>
              <Text style={styles.debugInfoText}>
                ID đối tượng: {reportedItemId || "Chưa xác định"}
              </Text>
            </View> */}
            {/* Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleReport}
            >
              <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  debugInfoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  debugInfoText: {
    color: "#666",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedReason: {
    backgroundColor: "#0066cc",
  },
  reasonText: {
    color: "#333",
    marginRight: 4,
  },
  selectedReasonText: {
    color: "#fff",
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },
  section: {
    marginTop: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#0066cc",
    borderRadius: 8,
    marginVertical: 10,
  },
  uploadButtonText: {
    marginLeft: 8,
    color: "#0066cc",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: "relative",
    marginVertical: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
});

export default ReportModal;
