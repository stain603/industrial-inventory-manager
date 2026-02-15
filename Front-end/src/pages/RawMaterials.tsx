import { useState, useEffect } from 'react';
import { rawMaterialsApi } from '../services/api';
import type { RawMaterial } from '../types/RawMaterial';

export function RawMaterials() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    stockQuantity: 0,
    unit: '',
    costPerUnit: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rawMaterialsApi.getAll();
      setRawMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ code: '', name: '', stockQuantity: 0, unit: '', costPerUnit: 0 });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEdit = (material: RawMaterial) => {
    setFormData({
      code: material.code,
      name: material.name,
      stockQuantity: material.stockQuantity,
      unit: material.unit,
      costPerUnit: material.costPerUnit,
    });
    setEditingId(material.id!);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await rawMaterialsApi.update(editingId, formData);
      } else {
        await rawMaterialsApi.create(formData);
      }
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this raw material?')) return;
    setError(null);
    try {
      await rawMaterialsApi.delete(id);
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading raw materials...</p>
        </div>
      </div>
    );
  }

 return (
  <div className="space-y-6">
    {/* Header Section */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Raw Materials</h1>
      <p className="text-slate-500 mt-1 text-sm">
        Manage your inventory of raw materials and supplies
      </p>
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
        <span>⚠️</span> {error}
      </div>
    )}

    {/* Form Card - Estilo Consistente com Products */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          {editingId ? 'Edit Material' : 'Register New Material'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Material Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: RM-001"
              required
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Material Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: High Quality Oak Wood"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.stockQuantity || ''}
              onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) || 0 })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. kg, units, meters"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Cost per Unit ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costPerUnit || ''}
              onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) || 0 })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md active:transform active:scale-95"
          >
            {editingId ? 'Update Material' : 'Create Material'}
          </button>
          
          {(editingId || isCreating) && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-2.5 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          )}

          {!isCreating && !editingId && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-6 py-2.5 rounded-lg font-semibold transition-all border border-emerald-100"
            >
              + New Entry
            </button>
          )}
        </div>
      </form>
    </div>

    {/* Inventory Table Card */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Inventory Status</h2>
          <p className="text-xs text-slate-500 uppercase tracking-tighter font-semibold">Current stock levels</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
          {rawMaterials.length} Items Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Cost</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rawMaterials.map((material) => (
              <tr key={material.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-500">{material.code}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{material.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${material.stockQuantity > 10 ? 'text-slate-700' : 'text-amber-600'}`}>
                      {material.stockQuantity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{material.unit}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-emerald-600">
                    ${(material.costPerUnit ?? 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="text-xs font-bold px-1">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(material.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="text-xs font-bold px-1">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rawMaterials.length === 0 && (
          <div className="text-center py-16 bg-slate-50/30">
            <div className="text-slate-300 text-4xl mb-2">📦</div>
            <div className="text-slate-500 font-medium">No materials in inventory</div>
            <p className="text-slate-400 text-xs mt-1">Start by adding a new material above.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}