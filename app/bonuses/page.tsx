'use client';

import { useSession } from 'next-auth/react';
import { Gift, ShieldAlert, Plus, Trophy } from 'lucide-react';

export default function BonusesPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const isAllowed = role === 'Admin';

  if (!isAllowed) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          <ShieldAlert size={16} />
          <span>Only admins can manage bonuses.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Gift size={26} className="text-amber-600" />
            Bonuses
          </h1>
          <p className="text-gray-600">Configure and award bonuses to agents and supervisors.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition">
          <Plus size={16} />
          New Bonus
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Create bonus</h3>
          <p className="text-sm text-gray-600">
            Placeholder: add your bonus creation form here (amount, criteria, recipients).
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Trophy size={16} className="text-amber-600" />
            Bonus history
          </h3>
          <p className="text-sm text-gray-600">
            Placeholder: list recent bonuses awarded to agents/supervisors with status.
          </p>
        </div>
      </div>
    </div>
  );
}

