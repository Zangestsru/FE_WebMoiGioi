import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '/api/v2');

export const locationApi = {
  getProvinces: async (): Promise<any[]> => {
    const response = await axios.get(`${baseUrl}/p`);
    return response.data;
  },
  getProvince: async (code: number, depth = 1): Promise<any> => {
    const response = await axios.get(`${baseUrl}/p/${code}`, { params: { depth } });
    return response.data;
  },
  getWards: async (provinceCode?: number): Promise<any[]> => {
    const response = await axios.get(`${baseUrl}/w`, { params: { province: provinceCode } });
    return response.data;
  }
};
