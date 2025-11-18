'use client';

import { ClipboardList, Users, Database, Globe, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardPage() {
  const pathname = usePathname();
  const [stats, setStats] = useState({
    totalForms: 0,
    totalUsers: 0,
    totalSubmissions: 0,
    authorizedIPs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Stats API returned error:', result.error);
        // Use fallback data if API fails
        if (result.data) {
          setStats(result.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Keep default values (0) on error
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Forms', href: '/forms' },
    { name: 'Submissions', href: '/dashboard?tab=Submissions' },
    { name: 'Requests', href: '/requests' },
    { name: 'IP Management', href: '/ip-management' },
    { name: 'User Management', href: '/user-management' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage forms, IP addresses, and submissions</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href.includes('?') && pathname === tab.href.split('?')[0]);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`pb-3 px-4 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-colors`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Forms</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.totalForms}
              </p>
            </div>
            <ClipboardList className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.totalUsers}
              </p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.totalSubmissions}
              </p>
            </div>
            <Database className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Authorized IPs</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.authorizedIPs}
              </p>
            </div>
            <Globe className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/form-builder"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Form</span>
          </Link>
          <Link
            href="/ip-management"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add IP</span>
          </Link>
          <Link
            href="/forms"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Settings size={20} />
            <span>Manage Forms</span>
          </Link>
          <Link
            href="/dashboard?tab=Submissions"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Database size={20} />
            <span>View Submissions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

