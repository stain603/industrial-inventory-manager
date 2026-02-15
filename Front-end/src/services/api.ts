import axios from 'axios';
import type { Product } from '../types/Product';
import type { RawMaterial } from '../types/RawMaterial';

// Base configuration for your Spring Boot backend running on port 8081
const api = axios.create({
  baseURL: 'http://localhost:8081', // Backend server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API - Consuming the real ProductController
export const productsApi = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  async update(id: string, product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getProductionSuggestions(): Promise<Product[]> {
    const response = await api.get<Product[]>('/production/suggestions');
    return response.data;
  },
};

// Raw Materials API - Consuming the real RawMaterialController
export const rawMaterialsApi = {
  async getAll(): Promise<RawMaterial[]> {
    const response = await api.get<RawMaterial[]>('/raw-materials');
    return response.data;
  },

  async create(rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> {
    const response = await api.post<RawMaterial>('/raw-materials', rawMaterial);
    return response.data;
  },

  async update(id: string, rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> {
    const response = await api.put<RawMaterial>(`/raw-materials/${id}`, rawMaterial);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/raw-materials/${id}`);
  },
};

// Production Suggestion API (RF004)
export const productionApi = {
  async getSuggestions(): Promise<Product[]> {
    const response = await api.get<Product[]>('/production/suggestions');
    return response.data;
  },
};