import axiosClient from "./axiosClient";

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
