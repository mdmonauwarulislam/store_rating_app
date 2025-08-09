import React, { useState, useEffect } from "react";
import { Star, Users, Store } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/ratings/my-store`);
      setStoreData(response.data);
    } catch (error) {
      toast.error("Failed to fetch store data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <Store className="h-14 w-14 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          No store found
        </h3>
        <p className="mt-1 text-gray-500 text-center max-w-sm">
          You don't have a store assigned to your account yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your store and view customer ratings.
        </p>
      </div>

      {/* Store Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Star className="h-10 w-10 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-xl font-semibold text-gray-900">
              {storeData.store.averageRating > 0
                ? storeData.store.averageRating.toFixed(1)
                : "No ratings"}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Users className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Ratings</p>
            <p className="text-xl font-semibold text-gray-900">
              {storeData.store.totalRatings}
            </p>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Ratings
          </h3>
        </div>

        {storeData.ratings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {storeData.ratings.map((rating) => (
                  <tr key={rating.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {rating.user.name}
                    </td>
                    <td className="px-6 py-4">{rating.user.email}</td>
                    <td className="px-6 py-4 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">
                        {rating.rating}/5
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No ratings yet
            </h3>
            <p className="mt-1 text-gray-500">
              Your store hasn't received any ratings yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
