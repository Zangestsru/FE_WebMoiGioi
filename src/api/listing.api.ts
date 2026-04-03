import axiosClient from './axiosClient';
import axios from 'axios';
import type { Listing } from '../types/listing.types';
import type { ApiResponse } from '../types/user.types';

// Public axios instance (no auth interceptor)
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const listingApi = {
  // Public API - no auth required
  getPublicListings: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await publicAxios.get<ApiResponse<Listing[]>>('listings/public');
    return response.data;
  },

  createListing: async (formData: FormData): Promise<ApiResponse<Listing>> => {
    const response = await axiosClient.post<ApiResponse<Listing>>('listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPropertyTypes: async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
    const response = await axiosClient.get<ApiResponse<{ id: number; name: string }[]>>('listings/property-types');
    return response.data;
  },

  getListing: async (id: string): Promise<ApiResponse<any>> => {
    const response = await axiosClient.get<ApiResponse<any>>(`listings/${id}`);
    return response.data;
  },

  updateListing: async (id: string, formData: FormData): Promise<ApiResponse<Listing>> => {
    const response = await axiosClient.put<ApiResponse<Listing>>(`listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyListings: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await axiosClient.get<ApiResponse<Listing[]>>('listings/my-listings');
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.patch<ApiResponse<void>>(`listings/${id}/status`, { status });
    return response.data;
  },

  deleteListing: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`listings/${id}`);
    return response.data;
  },

  getPublicListingById: async (id: string): Promise<ApiResponse<Listing>> => {
    const response = await publicAxios.get<ApiResponse<Listing>>(`listings/public/${id}`);
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<ApiResponse<{ action: 'added' | 'removed' }>> => {
    const response = await axiosClient.post<ApiResponse<{ action: 'added' | 'removed' }>>(`listings/favorites/toggle/${id}`);
    return response.data;
  },

  getMyFavorites: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await axiosClient.get<ApiResponse<Listing[]>>('listings/favorites');
    return response.data;
  },
};
