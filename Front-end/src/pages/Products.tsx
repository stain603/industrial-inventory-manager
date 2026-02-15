import { useState, useEffect } from 'react';
import { productsApi, rawMaterialsApi } from '../services/api';
import type { Product } from '../types/Product';
import type { RawMaterial } from '../types/RawMaterial';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: 0,
    materials: [] as { rawMaterialId: string; quantityRequired: number }[],
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, rawMaterialsData] = await Promise.all([
        productsApi.getAll(),
        rawMaterialsApi.getAll(),
      ]);
      setProducts(productsData);
      setRawMaterials(rawMaterialsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', code: '', price: 0, materials: [] });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      code: product.code,
      price: product.price,
      materials: product.materials.map((m) => ({
        rawMaterialId: String(m.rawMaterial.id),
        quantityRequired: m.quantityRequired,
      })),
    });
    setEditingId(product.id);
    setIsCreating(false);
  };

  const handleAddMaterial = () => {
    if (rawMaterials.length === 0) return;

    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        {
          rawMaterialId: String(rawMaterials[0].id),
          quantityRequired: 1,
        },
      ],
    });
  };

  const handleUpdateMaterial = (
    index: number,
    field: 'rawMaterialId' | 'quantityRequired',
    value: string | number
  ) => {
    const updated = [...formData.materials];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, materials: updated });
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formattedData = {
        ...formData,
        materials: formData.materials.map((m) => ({
          quantityRequired: m.quantityRequired,
          rawMaterial: {
            id: Number(m.rawMaterialId),
          },
        })),
      };

      if (editingId) {
        await productsApi.update(editingId, formattedData);
      } else {
        await productsApi.create(formattedData);
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      await loadData();
      resetForm();
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

return (
  <div className="space-y-6">
    {/* Header Section */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Products</h1>
      <p className="text-slate-500 mt-1 text-sm">
        Manage products and their manufacturing requirements
      </p>
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
        <span>⚠️</span> {error}
      </div>
    )}

    {/* Register Product Form*/}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">
          {editingId ? 'Edit Product Configuration' : 'Register New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Product Code</label>
            <input
              type="text"
              placeholder="Ex: P-100"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Product Name</label>
            <input
              type="text"
              placeholder="Ex: Wooden Table"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Unit Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Composition Area */}
        <div className="pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Formula</h3>
            <button
              type="button"
              onClick={handleAddMaterial}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              + Add Component
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {formData.materials.map((rm, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                <select
                  value={rm.rawMaterialId}
                  onChange={(e) => handleUpdateMaterial(index, 'rawMaterialId', e.target.value)}
                  className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Raw Material...</option>
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (In stock: {m.stockQuantity})</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={rm.quantityRequired || ''}
                  onChange={(e) => handleUpdateMaterial(index, 'quantityRequired', Number(e.target.value))}
                  className="w-20 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold text-center"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            {editingId ? 'Save Changes' : 'Create Product'}
          </button>
          {(editingId || isCreating) && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-white border border-slate-200 text-slate-500 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

    {/* Product Table */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">Registered Catalog</h2>
        <span className="text-[10px] bg-blue-50 text-blue-600 font-black px-2 py-1 rounded-full uppercase">
          {products.length} Items Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Price</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Capacity</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-xs font-mono text-slate-400 uppercase">{product.code}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{product.name}</div>
                  <div className="flex gap-1 mt-1">
                    {product.materials.map((m, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {m.rawMaterial.name} (x{m.quantityRequired})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-emerald-600">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs font-black ${product.producibleQuantity > 0 ? 'text-blue-600' : 'text-red-400'}`}>
                    {product.producibleQuantity ?? 0} <span className="text-[10px] font-normal uppercase">units</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-[10px] font-black text-slate-400 uppercase hover:text-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-[10px] font-black text-slate-400 uppercase hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-12 bg-slate-50/20">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">No products found</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}