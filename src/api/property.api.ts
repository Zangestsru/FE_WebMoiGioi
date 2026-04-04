import axiosClient from './axiosClient';
import type { 
  Property, 
  PropertyCreateDTO, 
  PropertyUpdateDTO, 
  PropertyFilter, 
  PropertyPaginationResponse 
} from '../types/property.types';

/**
 * Property API repository.
 * Rule: Repository Pattern for Data Access.
 */
export const propertyApi = {
  /**
   * Fetches properties with optional pagination & filtering.
   */
  async getProperties(params: PropertyFilter & { page?: number; limit?: number }): Promise<PropertyPaginationResponse> {
    const response = await axiosClient.get<PropertyPaginationResponse>('/properties', { params });
    return response.data;
  },

  /**
   * Fetches a single property by ID.
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await axiosClient.get<Property>(`/properties/${id}`);
    return response.data;
  },

  /**
   * Creates a new property.
   */
  async createProperty(data: PropertyCreateDTO): Promise<Property> {
    const response = await axiosClient.post<Property>('/properties', data);
    return response.data;
  },

  /**
   * Updates an existing property.
   */
  async updateProperty(id: string, data: PropertyUpdateDTO): Promise<Property> {
    const response = await axiosClient.put<Property>(`/properties/${id}`, data);
    return response.data;
  },

  /**
   * Performs soft-delete by updating status to DELETED.
   */
  async softDeleteProperty(id: string): Promise<void> {
    await axiosClient.patch(`/properties/${id}/soft-delete`);
  },

  /**
   * Deletes a property (HARD Delete).
   */
  async deleteProperty(id: string): Promise<void> {
    await axiosClient.delete(`/properties/${id}`);
  },
};
