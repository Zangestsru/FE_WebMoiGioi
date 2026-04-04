import axiosClient from './axiosClient';

export type ReportType = 'properties' | 'users' | 'listings' | 'summary';

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
