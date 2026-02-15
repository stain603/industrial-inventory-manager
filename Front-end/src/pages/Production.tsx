import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import type { Product } from '../types/Product';

interface ProductionItem {
  product: Product;
  producibleQuantity: number;
  productionValue: number;
}

export function Production() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productionItems, setProductionItems] = useState<ProductionItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const suggestions = await productsApi.getProductionSuggestions();
      
      const items: ProductionItem[] = suggestions.map((product: Product) => ({
        product: product,
        producibleQuantity: product.producibleQuantity || 0,
        productionValue: product.totalValue || 0,
      }));

      setProductionItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load production data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalProductionValue = productionItems.reduce((sum: number, item: ProductionItem) => sum + item.productionValue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading production data...</p>
        </div>
      </div>
    );
  }

 return (
  <div className="space-y-6">
    {/* Header Section */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Production Analysis</h1>
      <p className="text-slate-500 mt-1 text-sm">
        Analyze manufacturing capacity based on current raw material inventory
      </p>
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
        <span>⚠️</span> {error}
      </div>
    )}

    {/* Summary Card - High Impact Visual */}
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Potential Revenue</h2>
          <p className="text-white/60 text-sm italic">Total value if all possible units are produced</p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
            ${totalProductionValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Optimized by highest value
          </div>
        </div>
      </div>
    </div>

    {/* Analysis Table Card */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 text-center">Manufacturing Capacity</h2>
        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded tracking-widest uppercase">
          Live Stock Sync
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available to Produce</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Potential Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productionItems.map((item) => (
              <tr key={item.product.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{item.product.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">SKU: {item.product.code}</div>
                </td>
                <td className="px-6 py-4">
                  {item.producibleQuantity > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-emerald-600 leading-none">
                          {item.producibleQuantity >= 999 ? '∞' : item.producibleQuantity}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-tighter">Units</span>
                      </div>
                      <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">
                      <span className="text-[10px] font-black uppercase">Stock Out</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-500">
                    ${(item.product.price || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-bold text-slate-900">
                    ${item.productionValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productionItems.length === 0 && (
          <div className="text-center py-20 bg-slate-50/20">
            <div className="text-slate-300 text-5xl mb-4">📊</div>
            <h3 className="text-slate-500 font-bold">No Production Data Available</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              Configure your products and ensure raw materials are associated to see the analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}