import axiosClient from "./axiosClient";

export interface PropertyType {
  id: number;
  name: string;
}

export const propertyTypeApi = {
  getAll: async () => {
    const url = "/property-types";
    return axiosClient.get(url);
  },

  create: async (data: { name: string }) => {
    const url = "/property-types";
    return axiosClient.post(url, data);
  },

  update: async (id: number, data: { name: string }) => {
    const url = `/property-types/${id}`;
    return axiosClient.put(url, data);
  },

  delete: async (id: number) => {
    const url = `/property-types/${id}`;
    return axiosClient.delete(url);
  },
};
