import axiosClient from "./axiosClient";
export type ReportType = 'properties' | 'users' | 'listings' | 'summary';

export enum ReportReason {
  FAKE_PRICE = "FAKE_PRICE",
  SOLD = "SOLD",
  WRONG_IMAGE = "WRONG_IMAGE",
  SCAM = "SCAM",
  OTHER = "OTHER",
}

export interface CreateReportRequest {
  listingId: string;
  reasonCode: ReportReason;
  description?: string;
}

export const createReport = async (data: CreateReportRequest): Promise<any> => {
  const response = await axiosClient.post("/reports", data);
  return response.data;
};

export interface ReportFilterResponse {
  id: string;
  listingId: string;
  reporterId: string;
  reasonCode: ReportReason;
  description: string | null;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  listing: {
    title: string;
    slug: string;
    status: string;
  };
  reporter: {
    email: string | null;
    profile: {
      displayName: string;
    } | null;
  };
}

export const getAdminReports = async (): Promise<ReportFilterResponse[]> => {
  const response = await axiosClient.get("/reports/admin/pending");
  return response.data.data;
};

export const updateReportStatus = async (reportId: string, status: 'VERIFIED' | 'REJECTED'): Promise<any> => {
  const response = await axiosClient.patch(`/reports/admin/${reportId}/status`, { status });
  return response.data.data;
};

export const reportApi = {
  /**
   * Export reports as Excel file.
   * Sends a POST with selected types and downloads the result as a blob.
   */
  exportReport: async (types: ReportType[]): Promise<Blob> => {
    const response = await axiosClient.post(
      '/reports/export',
      { types },
      { responseType: 'blob' },
    );
    return response.data;
  },
};

