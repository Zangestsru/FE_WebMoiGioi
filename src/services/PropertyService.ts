import { propertyApi } from '../api/property.api';
import type { 
  Property, 
  PropertyCreateDTO, 
  PropertyUpdateDTO, 
  PropertyFilter, 
  PropertyPaginationResponse 
} from '../types/property.types';

/**
 * PropertyService - Business Logic Layer.
 * UI components should NEVER call propertyApi directly.
 * Rule: Service Pattern (Rule 2).
 */
export class PropertyService {
  /**
   * Fetches list of properties with default pagination values.
   */
  async getPropertiesList(
    filter?: PropertyFilter, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PropertyPaginationResponse> {
    try {
      return await propertyApi.getProperties({ ...filter, page, limit });
    } catch (error) {
      console.error('PropertyService.getPropertiesList Error:', error);
      throw new Error('Failed to fetch properties list');
    }
  }

  /**
   * Fetches detailed property data.
   */
  async getPropertyDetails(id: string): Promise<Property> {
    if (!id) throw new Error('ID is required');
    try {
      return await propertyApi.getPropertyById(id);
    } catch (error) {
      console.error(`PropertyService.getPropertyDetails Error (ID: ${id}):`, error);
      throw new Error('Failed to fetch property details');
    }
  }

  /**
   * Orchestrates the creation of a new real estate entry.
   * Can include transformations or secondary logic.
   */
  async addProperty(data: PropertyCreateDTO): Promise<Property> {
    // Business rule: Check if price/area is non-negative
    if (data.price < 0 || data.area <= 0) {
      throw new Error('Price and Area must be positive values');
    }
    
    try {
      return await propertyApi.createProperty(data);
    } catch (error) {
      console.error('PropertyService.addProperty Error:', error);
      throw new Error('Failed to create property');
    }
  }

  /**
   * Updates an existing entry.
   */
  async modifyProperty(id: string, data: PropertyUpdateDTO): Promise<Property> {
    if (!id) throw new Error('ID is required for updates');
    try {
      return await propertyApi.updateProperty(id, data);
    } catch (error) {
      console.error(`PropertyService.modifyProperty Error (ID: ${id}):`, error);
      throw new Error('Failed to update property');
    }
  }

  /**
   * Performs a soft delete by updating the status to DELETED.
   * Rule: Soft Delete (no hard removal from DB).
   */
  async removeProperty(id: string): Promise<void> {
    if (!id) throw new Error('ID is required for deletion');
    try {
      await propertyApi.softDeleteProperty(id);
    } catch (error) {
      console.error(`PropertyService.removeProperty Error (ID: ${id}):`, error);
      throw new Error('Failed to delete property');
    }
  }
}

// Singleton for easy use
export const propertyService = new PropertyService();
