'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DollarSign, Gift, Loader2 } from 'lucide-react';

export default function AgentSalaryPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [salary, setSalary] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        setError('');
        const userId = session?.user?.id;
        if (!userId) {
          setError('User not found');
          return;
        }

        const res = await fetch(`/api/users/${userId}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || 'Failed to load salary data');
        }

        setSalary(result.data.salary || 0);
        setBonus(result.data.bonus || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to load salary data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchSalaryData();
    }
  }, [session]);

  return (
    <div className="p-6 bg-[#f6f9fc] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Salary & Bonus</h1>
        <p className="text-gray-600">View your compensation details</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 size={20} className="animate-spin" />
          Loading your compensation details...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Salary</p>
                <h2 className="text-2xl font-bold text-gray-900">${salary.toLocaleString()}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500">Your base monthly salary amount</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Gift size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bonus</p>
                <h2 className="text-2xl font-bold text-gray-900">${bonus.toLocaleString()}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500">Your performance bonus amount</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-200 p-6 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-600 flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-700 font-medium">Total Compensation</p>
                <h2 className="text-3xl font-bold text-emerald-900">${(salary + bonus).toLocaleString()}</h2>
              </div>
            </div>
            <p className="text-sm text-emerald-700">Combined monthly salary and bonus</p>
          </div>
        </div>
      )}
    </div>
  );
}
