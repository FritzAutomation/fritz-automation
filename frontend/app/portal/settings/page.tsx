'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getEmailPreferences, updateEmailPreferences } from '@/lib/portalApi';
import type { EmailPreferences } from '@/lib/portalApi';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await getEmailPreferences();
      setPreferences(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof EmailPreferences) => {
    if (!preferences || saving) return;

    const newValue = !preferences[key];
    const updatedPreferences = { ...preferences, [key]: newValue };
    setPreferences(updatedPreferences);
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      await updateEmailPreferences({ [key]: newValue });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      // Revert on error
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account preferences and notification settings</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              ✓ Settings saved successfully
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : preferences ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              {/* Email Notifications */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Email Notifications</h2>
                <p className="text-sm text-gray-600">Choose which emails you'd like to receive</p>
              </div>

              <div className="divide-y divide-gray-200">
                {/* Project Updates */}
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📝</span>
                      <h3 className="font-semibold text-gray-900">Project Updates</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Receive emails when there are new updates on your projects
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('project_updates')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.project_updates ? 'bg-primary' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.project_updates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Ticket Comments */}
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">💬</span>
                      <h3 className="font-semibold text-gray-900">Ticket Comments</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Get notified when someone comments on your support tickets
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('ticket_comments')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.ticket_comments ? 'bg-primary' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.ticket_comments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Ticket Status Changes */}
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🎫</span>
                      <h3 className="font-semibold text-gray-900">Ticket Status Changes</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Receive updates when your ticket status changes
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('ticket_status_changes')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.ticket_status_changes ? 'bg-primary' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.ticket_status_changes ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* New Files */}
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📎</span>
                      <h3 className="font-semibold text-gray-900">New Files</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Get notified when new files are uploaded to your projects
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('new_files')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.new_files ? 'bg-primary' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.new_files ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Weekly Summary */}
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📊</span>
                      <h3 className="font-semibold text-gray-900">Weekly Summary</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Receive a weekly digest of project progress and activity
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('weekly_summary')}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.weekly_summary ? 'bg-primary' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.weekly_summary ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}
