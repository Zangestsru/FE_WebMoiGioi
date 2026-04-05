import axios from 'axios';

const getLocationBaseURL = () => {
  const envLocation = import.meta.env.VITE_LOCATION_API_URL;
  const envBase = import.meta.env.VITE_API_BASE_URL;
  
  if (envLocation && !envLocation.includes('yourdomain.com')) return envLocation;
  
  if (envBase && !envBase.includes('yourdomain.com')) {
    return envBase.replace('/api/v1', '/api/v2');
  }
  
  return '/api/v2';
};

const locationBaseUrl = getLocationBaseURL();

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
