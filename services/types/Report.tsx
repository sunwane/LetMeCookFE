import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Enums matching backend
export enum ReportType {
  REPORT_RECIPE = "REPORT_RECIPE",
  REPORT_COMMENT = "REPORT_COMMENT",
  REPORT_USER = "REPORT_USER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum ReportSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Report request interface
export interface ReportRequest {
  reportType: ReportType;
  reportedItemId: string;
  reason: string;
  description?: string;
}

// Report response interface
export interface ReportResponse {
  id: string;
  reporterAccountUsername: string;
  reporterAccountEmail: string;
  reportedAccountUsername: string;
  reportedAccountEmail: string;
  reportType: ReportType;
  reportedItemId: string;
  reason: string;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
  adminResponse?: string;
  evidenceImageUrl?: string;
  resolvedByAdminUsername?: string;
  resolvedByAdminEmail?: string;
  resolvedAt?: string;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

// Create a new report with optional evidence image

// File: Report.tsx
export const createReport = async (
  reportData: ReportRequest,
  evidenceImage?: any
): Promise<ReportResponse> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Sending request with data:", reportData);

    // Gọi endpoint JSON nếu không có ảnh
    const response = await fetch(`${API_BASE_URL}/reports/json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Server error ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    console.error("Error in createReport:", error);
    throw error;
  }
};

// Get all reports (admin only)
export const getAllReports = async (
  status?: string,
  page: number = 0,
  size: number = 10
): Promise<Page<ReportResponse>> => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  let url = `${API_BASE_URL}/reports?page=${page}&size=${size}`;
  if (status) {
    url += `&status=${status}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse(response);
  return result.result;
};

// Get a report by ID (admin only)
export const getReportById = async (
  reportId: string
): Promise<ReportResponse> => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse(response);
  return result.result;
};

// Update report status (admin only)
export const updateReportStatus = async (
  reportId: string,
  newStatus: ReportStatus,
  adminResponse: string
): Promise<ReportResponse> => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      newStatus,
      adminResponse,
    }),
  });

  const result = await handleResponse(response);
  return result.result;
};

// Delete a report (admin only)
export const deleteReport = async (reportId: string): Promise<void> => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorText = "";
    try {
      errorText = await response.text();
    } catch {}
    throw new Error(errorText || "Xóa báo cáo thất bại!");
  }
};
