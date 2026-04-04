import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/user.types';

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  addressText?: string;
  totalArea?: number;
  status?: string;
  approvalStatus: string;
  description?: string;
  createdAt?: string;
  media?: { id: string; originalUrl: string; isPrimary: boolean; sortOrder: number }[];
  _count?: { listings: number };
}

export interface ProjectOption {
  id: string;
  name: string;
}

export const projectApi = {
  /** Get all projects belonging to the current agent */
  getMyProjects: async (): Promise<ApiResponse<ProjectSummary[]>> => {
    const response = await axiosClient.get<ApiResponse<ProjectSummary[]>>('projects/agent/my-projects');
    return response.data;
  },

  /** Get only approved projects for listing dropdown */
  getMyApprovedProjects: async (): Promise<ApiResponse<ProjectOption[]>> => {
    const response = await axiosClient.get<ApiResponse<ProjectOption[]>>('projects/agent/my-approved');
    return response.data;
  },

  /** Create a new project with images */
  createProject: async (formData: FormData): Promise<ApiResponse<ProjectSummary>> => {
    const response = await axiosClient.post<ApiResponse<ProjectSummary>>('projects/agent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Get project by ID */
  getProject: async (id: string): Promise<ApiResponse<ProjectSummary>> => {
    const response = await axiosClient.get<ApiResponse<ProjectSummary>>(`projects/agent/${id}`);
    return response.data;
  },

  /** Update a project */
  updateProject: async (id: string, formData: FormData): Promise<ApiResponse<ProjectSummary>> => {
    const response = await axiosClient.put<ApiResponse<ProjectSummary>>(`projects/agent/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Delete a project */
  deleteProject: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`projects/agent/${id}`);
    return response.data;
  },

  // ─── PUBLIC FUNCTIONS ────────────────────────────────────────────────────────

  /** Get all approved projects for public display */
  getPublicProjects: async (): Promise<ApiResponse<ProjectSummary[]>> => {
    const response = await axiosClient.get<ApiResponse<ProjectSummary[]>>('projects/public');
    return response.data;
  },

  /** Get a single approved project by ID for public display */
  getPublicProjectById: async (id: string): Promise<ApiResponse<ProjectSummary & { listings?: any[] }>> => {
    const response = await axiosClient.get<ApiResponse<ProjectSummary & { listings?: any[] }>>(`projects/public/${id}`);
    return response.data;
  },

  // ─── ADMIN FUNCTIONS ─────────────────────────────────────────────────────────

  /** Get all projects (Admin only) */
  adminGetAllProjects: async (): Promise<ApiResponse<(ProjectSummary & { user: { email: string, profile: { displayName: string } } })[]>> => {
    const response = await axiosClient.get<ApiResponse<(ProjectSummary & { user: { email: string, profile: { displayName: string } } })[]>>('projects/admin');
    return response.data;
  },

  /** Update project approval status (Admin only) */
  adminUpdateProjectStatus: async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW'): Promise<ApiResponse<ProjectSummary>> => {
    const response = await axiosClient.put<ApiResponse<ProjectSummary>>(`projects/admin/${id}/status`, { status });
    return response.data;
  },
};
