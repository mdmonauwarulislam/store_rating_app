import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Store } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await axios.get(`/api/stores?${params}`);
      setStores(response.data);
    } catch (error) {
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (storeId, rating) => {
    try {
      await axios.post('/api/ratings', { storeId, rating });
      toast.success('Rating submitted successfully!');
      fetchStores();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const StarRating = ({ onRate, userRating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`h-5 w-5 ${
              star <= (userRating || 0)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="h-full w-full" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {userRating ? `Your rating: ${userRating}` : 'Rate this store'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and rate stores on our platform
        </p>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
            <option value="averageRating">Sort by Rating</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {store.name}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {store.address}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Rating
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {store.averageRating > 0
                      ? store.averageRating
                      : 'No ratings'}
                    {store.totalRatings > 0 && (
                      <span className="text-gray-400">
                        {' '}
                        ({store.totalRatings})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <StarRating
                  rating={store.averageRating}
                  userRating={store.userRating}
                  onRate={(rating) => submitRating(store.id, rating)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No stores found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search
              ? 'Try adjusting your search criteria.'
              : 'No stores have been added yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
