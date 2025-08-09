import React, { useState, useEffect } from 'react';
import { Plus, Search, Store, Star, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchStores();
    fetchStoreOwners();
  }, [search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await axios.get(`/api/stores?${params}`);
      setStores(response.data);
    } catch {
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get('/api/users?role=STORE_OWNER');
      const availableOwners = response.data.filter(owner => !owner.store);
      setStoreOwners(availableOwners);
    } catch {
      console.error('Failed to fetch store owners');
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/stores', data);
      toast.success('Store created successfully!');
      setShowAddModal(false);
      reset();
      fetchStores();
      fetchStoreOwners();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Failed to create store');
      }
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, view, and manage all stores on the platform.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="address">Sort by Address</option>
          <option value="averageRating">Sort by Rating</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : stores.length > 0 ? (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Name', 'Email', 'Address', 'Rating', 'Total Ratings', 'Created'].map((header) => (
                  <th key={header} className="px-6 py-3 text-gray-600 uppercase text-xs font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{store.name}</td>
                  <td className="px-6 py-4">{store.email}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{store.address}</td>
                  <td className="px-6 py-4 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {store.averageRating > 0 ? store.averageRating : 'No ratings'}
                  </td>
                  <td className="px-6 py-4">{store.totalRatings}</td>
                  <td className="px-6 py-4">{new Date(store.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try adjusting your search criteria.' : 'No stores have been added yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add New Store</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                <input
                  {...register('name', { required: 'Store name is required' })}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Store name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/, message: 'Invalid email' }
                  })}
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  {...register('address', {
                    required: 'Address is required',
                    maxLength: { value: 400, message: 'Max 400 characters' }
                  })}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Owner (Optional)</label>
                <select
                  {...register('ownerId')}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select owner</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;
