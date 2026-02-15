export interface ProductMaterial {
  id?: string;
  quantityRequired: number;
  rawMaterial: {
    id: number;
    name?: string;
  };
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  materials: ProductMaterial[];
  producibleQuantity?: number;
  totalValue?: number;
}
