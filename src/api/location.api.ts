import axios from 'axios';
import { getBaseURL } from './axiosClient';

const locationBaseUrl = getBaseURL().replace('/api/v1', '/api/v2');

export const locationApi = {
  /** Lấy danh sách tất cả tỉnh/thành */
  getProvinces: async (): Promise<any[]> => {
    const response = await axios.get(`${locationBaseUrl}/p`);
    return response.data;
  },

  /** Lấy thông tin 1 tỉnh/thành. depth=2 sẽ bao gồm danh sách wards */
  getProvince: async (code: number, depth = 1): Promise<any> => {
    const response = await axios.get(`${locationBaseUrl}/p/${code}`, { params: { depth } });
    return response.data;
  },

  /** Lấy danh sách phường/xã, có thể lọc theo tỉnh */
  getWards: async (provinceCode?: number): Promise<any[]> => {
    const response = await axios.get(`${locationBaseUrl}/w`, { params: { province: provinceCode } });
    return response.data;
  },

  /** Lấy thông tin 1 phường/xã theo code */
  getWard: async (code: number): Promise<any> => {
    const response = await axios.get(`${locationBaseUrl}/w/${code}`);
    return response.data;
  }
};
