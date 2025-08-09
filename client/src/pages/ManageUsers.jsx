import React, { useState, useEffect } from "react";
import { Plus, Search, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const API_BASE = import.meta.env.VITE_API_URL;


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const response = await axios.get(`${API_BASE}/api/users?${params}`);
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE}/api/users`, data);
      toast.success("User created successfully!");
      setShowAddModal(false);
      reset();
      fetchUsers();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create user");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add, view, and manage all users on the platform
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
            <option value="createdAt">Sort by Date</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Role", "Address", "Rating", "Joined"].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "STORE_OWNER"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                    {user.address}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "STORE_OWNER" &&
                    user.averageRating !== undefined ? (
                      <span className="text-yellow-600 font-medium">
                        {user.averageRating > 0
                          ? user.averageRating
                          : "No ratings"}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search || roleFilter
                ? "Try adjusting your search criteria."
                : "No users have been added yet."}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  type="email"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                  type="password"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
