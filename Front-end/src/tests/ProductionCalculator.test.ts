import { describe, it, expect } from 'vitest'
import type { Product } from '../types/Product'
import type { RawMaterial } from '../types/RawMaterial'

describe('ProductionCalculator', () => {
  const calculateProducibleQuantity = (
    product: Product,
    materials: RawMaterial[]
  ): number => {
    if (product.materials.length === 0) return 0;
    let minQuantity = Infinity;
    for (const rm of product.materials) {
      const material = materials.find((m) => m.id === rm.rawMaterialId);
      const stock = material?.stockQuantity ?? 0;
      const batches = Math.floor(stock / rm.quantityRequired);
      if (batches < minQuantity) minQuantity = batches;
    }
    return minQuantity === Infinity ? 0 : minQuantity;
  };

  describe('calculateProducibleQuantity', () => {
    it('should calculate correct production quantity with sufficient materials', () => {
      // Arrange: Setup product and materials
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: [
          { rawMaterialId: '1', quantityRequired: 2 },
          { rawMaterialId: '2', quantityRequired: 3 }
        ]
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 20, unit: 'kg', costPerUnit: 5.0 },
        { id: '2', code: 'RM002', name: 'Material Y', stockQuantity: 15, unit: 'kg', costPerUnit: 3.0 }
      ];

      // Act: Calculate producible quantity
      const result = calculateProducibleQuantity(product, materials);

      // Assert: Verify result
      // Material X: 20 / 2 = 10 units
      // Material Y: 15 / 3 = 5 units
      // Minimum = 5 units
      expect(result).toBe(5);
    });

    it('should return 0 when no materials are available', () => {
      // Arrange: Product with no associated materials
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: []
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 20, unit: 'kg', costPerUnit: 5.0 }
      ];

      // Act & Assert
      expect(calculateProducibleQuantity(product, materials)).toBe(0);
    });

    it('should return 0 when required material is not found', () => {
      // Arrange: Product with material that doesn't exist in stock
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: [
          { rawMaterialId: '99', quantityRequired: 2 } // Material does not exist
        ]
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 20, unit: 'kg', costPerUnit: 5.0 }
      ];

      // Act & Assert
      expect(calculateProducibleQuantity(product, materials)).toBe(0);
    });

    it('should handle insufficient stock correctly', () => {
      // Arrange: Product with insufficient stock
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: [
          { rawMaterialId: '1', quantityRequired: 10 }
        ]
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 5, unit: 'kg', costPerUnit: 5.0 } // Less than required
      ];

      // Act & Assert
      expect(calculateProducibleQuantity(product, materials)).toBe(0);
    });

    it('should calculate with multiple materials limiting factor', () => {
      // Arrange: Multiple materials with different limits
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: [
          { rawMaterialId: '1', quantityRequired: 1 }, // Allows 50
          { rawMaterialId: '2', quantityRequired: 2 }, // Allows 25
          { rawMaterialId: '3', quantityRequired: 5 }  // Allows 10 (limiting)
        ]
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 50, unit: 'kg', costPerUnit: 5.0 },
        { id: '2', code: 'RM002', name: 'Material Y', stockQuantity: 50, unit: 'kg', costPerUnit: 3.0 },
        { id: '3', code: 'RM003', name: 'Material Z', stockQuantity: 50, unit: 'kg', costPerUnit: 2.0 }
      ];

      // Act & Assert
      expect(calculateProducibleQuantity(product, materials)).toBe(10);
    });

    it('should handle zero quantity requirement', () => {
      // Arrange: Material with zero quantity requirement (edge case)
      const product: Product = {
        id: '1',
        code: 'P001',
        name: 'Product A',
        price: 100.0,
        materials: [
          { rawMaterialId: '1', quantityRequired: 0 }
        ]
      };

      const materials: RawMaterial[] = [
        { id: '1', code: 'RM001', name: 'Material X', stockQuantity: 10, unit: 'kg', costPerUnit: 5.0 }
      ];

      // Act & Assert: Division by zero should result in Infinity, but the minimum should be 0
      expect(calculateProducibleQuantity(product, materials)).toBe(Infinity);
    });
  });
});