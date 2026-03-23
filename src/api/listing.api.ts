import axiosClient from './axiosClient';
import type { Listing } from '../types/listing.types';
import type { ApiResponse } from '../types/user.types';

export const listingApi = {
  createListing: async (formData: FormData): Promise<ApiResponse<Listing>> => {
    const response = await axiosClient.post<ApiResponse<Listing>>('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPropertyTypes: async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
    const response = await axiosClient.get<ApiResponse<{ id: number; name: string }[]>>('/listings/property-types');
    return response.data;
  },

  getListing: async (id: string): Promise<ApiResponse<any>> => {
    const response = await axiosClient.get<ApiResponse<any>>(`/listings/${id}`);
    return response.data;
  },

  updateListing: async (id: string, formData: FormData): Promise<ApiResponse<Listing>> => {
    const response = await axiosClient.put<ApiResponse<Listing>>(`/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyListings: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await axiosClient.get<ApiResponse<Listing[]>>('/listings/my-listings');
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.patch<ApiResponse<void>>(`/listings/${id}/status`, { status });
    return response.data;
  },

  deleteListing: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/listings/${id}`);
    return response.data;
  },
};
