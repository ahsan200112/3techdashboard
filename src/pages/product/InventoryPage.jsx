import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Search, Filter, Edit, Trash2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const InventoryPage = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState('all');

  const inventoryItems = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      sku: 'PWH-001',
      category: 'Electronics',
      stock: 45,
      reserved: 5,
      available: 40,
      reorderLevel: 10,
      status: 'In Stock',
      trend: 'up',
      movement: '+12'
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      sku: 'SWS5-002',
      category: 'Electronics',
      stock: 23,
      reserved: 3,
      available: 20,
      reorderLevel: 15,
      status: 'Low Stock',
      trend: 'down',
      movement: '-8'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      sku: 'OCT-003',
      category: 'Clothing',
      stock: 0,
      reserved: 0,
      available: 0,
      reorderLevel: 20,
      status: 'Out of Stock',
      trend: 'down',
      movement: '-15'
    },
    {
      id: 4,
      name: 'Professional Camera Lens',
      sku: 'PCL-004',
      category: 'Photography',
      stock: 67,
      reserved: 2,
      available: 65,
      reorderLevel: 10,
      status: 'In Stock',
      trend: 'up',
      movement: '+5'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredItems = filterStatus === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.status.toLowerCase().replace(' ', '-') === filterStatus);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('nav.inventory')}
              </h1>
              <p className="text-emerald-100 text-lg">
                Monitor and manage your product inventory levels
              </p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold text-slate-900">135</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-emerald-600">$45,230</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            
            <button className="flex items-center space-x-2 px-6 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Available</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {item.available}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center text-sm font-medium ${
                      item.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {item.movement}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;