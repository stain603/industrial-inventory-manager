import { describe, it, expect, vi, beforeEach } from 'vitest'
import { productsApi } from '../services/api'
import type { Product } from '../types/Product'

describe('ProductService', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = mockFetch
  })

  describe('getAll', () => {
    it('should fetch all products successfully', async () => {
      // Arrange: Setup mock response
      const mockProducts: Product[] = [
        {
          id: '1',
          code: 'P001',
          name: 'Product 1',
          price: 100.0,
          materials: []
        },
        {
          id: '2',
          code: 'P002',
          name: 'Product 2',
          price: 200.0,
          materials: []
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      } as Response)

      // Act: Call method
      const result = await productsApi.getAll()

      // Assert: Verify result
      expect(result).toEqual(mockProducts)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8081/products', {
        method: 'GET'
      })
    })

    it('should handle fetch error', async () => {
      // Arrange: Setup mock error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act & Assert: Verify if throws error
      await expect(productsApi.getAll()).rejects.toThrow('Network error')
    })
  })

  describe('create', () => {
    it('should create a new product successfully', async () => {
      // Arrange: Setup data
      const newProduct: Product = {
        id: '0',
        code: 'P003',
        name: 'New Product',
        price: 300.0,
        materials: []
      }

      const createdProduct: Product = {
        ...newProduct,
        id: '3'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProduct
      } as Response)

      // Act: Create product
      const result = await productsApi.create(newProduct)

      // Assert: Verify result
      expect(result).toEqual(createdProduct)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8081/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      })
    })
  })
})