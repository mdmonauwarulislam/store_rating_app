import React, { useState, useEffect } from 'react';
import { Users, Store, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // adjust if using context
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setStats(response.data);
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Failed to fetch dashboard stats';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your platform statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<Store className="h-8 w-8 text-green-600" />}
          label="Total Stores"
          value={stats.totalStores}
        />
        <StatCard
          icon={<Star className="h-8 w-8 text-yellow-600" />}
          label="Total Ratings"
          value={stats.totalRatings}
        />
      </div>

      <div className="mt-8">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <QuickAction
              href="/users"
              icon={<Users className="h-6 w-6 text-blue-600 mr-3" />}
              title="Manage Users"
              description="Add, view, and manage users"
            />
            <QuickAction
              href="/stores"
              icon={<Store className="h-6 w-6 text-green-600 mr-3" />}
              title="Manage Stores"
              description="Add, view, and manage stores"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
          <dd className="text-lg font-medium text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

const QuickAction = ({ href, icon, title, description }) => (
  <a
    href={href}
    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center">
      {icon}
      <div>
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </a>
);

export default AdminDashboard;
