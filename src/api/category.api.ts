import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/user.types';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export const categoryApi = {
  /**
   * Get all categories (including deleted ones if needed by admin)
   */
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await axiosClient.get<ApiResponse<Category[]>>('categories');
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.get<ApiResponse<Category>>(`categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  createCategory: async (data: CreateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.post<ApiResponse<Category>>('categories', data);
    return response.data;
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id: number, data: UpdateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.patch<ApiResponse<Category>>(`categories/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete a category
   */
  softDeleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`categories/${id}/soft`);
    return response.data;
  },

  /**
   * Restore a soft deleted category
   */
  restoreCategory: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`categories/${id}/restore`);
    return response.data;
  },
};
