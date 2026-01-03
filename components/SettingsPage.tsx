import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { ChevronLeftIcon } from './icons';
import type { Profile } from '../types';

interface SettingsPageProps {
  user: User;
  profile: Profile | null;
  onBack: () => void;
  onUpdateName: (newName: string) => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<void>;
  onLogout: () => void;
  onNavigateToAdmin: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, profile, onBack, onUpdateName, onUpdatePassword, onLogout, onNavigateToAdmin }) => {
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<'name' | 'password' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
        setError("Name cannot be empty.");
        return;
    };
    setLoading('name');
    await onUpdateName(fullName);
    setLoading(null);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading('password');
    await onUpdatePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setLoading(null);
  };

  return (
    <div className="p-4 text-gray-900">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold ml-4">Settings</h2>
      </header>

      <div className="space-y-8">
        {/* Admin Panel Button */}
        {profile?.role === 'admin' && (
            <section>
                <button
                onClick={onNavigateToAdmin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Go to Admin Panel
                </button>
            </section>
        )}

        {/* Account Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Account</h3>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div>
                <p className="text-sm text-gray-600">Email Address (cannot be changed)</p>
                <p className="font-medium">{user.email}</p>
            </div>
            <form onSubmit={handleNameUpdate} className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600" htmlFor="full-name">Full Name</label>
                    <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        disabled={loading === 'name'}
                        required
                    />
                </div>
                 <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300"
                    disabled={loading === 'name' || fullName === profile?.full_name}
                    >
                    {loading === 'name' ? 'Saving...' : 'Save Name'}
                </button>
            </form>
          </div>
        </section>

        {/* Update Password */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Update Password</h3>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading === 'password'}
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading === 'password'}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300"
              disabled={loading === 'password' || !newPassword}
            >
              {loading === 'password' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Logout Button */}
        <section className="pt-4">
            <button
              onClick={onLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
                Log Out
            </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;