import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
const API_BASE = import.meta.env.VITE_API_URL;


const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/api/auth/update-password`, data);
      toast.success('Password updated successfully!');
      reset();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(err.msg);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Update Password</h1>
        <p className="text-sm text-gray-600">Change your account password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input
            {...register('currentPassword', { required: 'Current password is required' })}
            type="password"
            placeholder="Enter current password"
            className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              maxLength: { value: 16, message: 'Max 16 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message: 'Must include uppercase & special character',
              },
            })}
            type="password"
            placeholder="Enter new password"
            className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: value => value === newPassword || 'Passwords do not match',
            })}
            type="password"
            placeholder="Confirm new password"
            className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
