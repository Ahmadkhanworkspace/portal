'use client';

import { useSession } from 'next-auth/react';
import { ShieldAlert, Target, Plus, ClipboardCheck } from 'lucide-react';

export default function MonthlyTargetsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const isAllowed = role === 'Admin';

  if (!isAllowed) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          <ShieldAlert size={16} />
          <span>Only admins can manage monthly targets.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target size={26} className="text-blue-600" />
            Monthly Targets
          </h1>
          <p className="text-gray-600">Assign and track targets for agents and supervisors.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
          <Plus size={16} />
          New Target
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Assign target</h3>
          <p className="text-sm text-gray-600">
            This is a placeholder. Plug in your assignment form here to set monthly goals for selected agents/supervisors.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <ClipboardCheck size={16} className="text-emerald-600" />
            Overview
          </h3>
          <p className="text-sm text-gray-600">
            Show progress and completion status per agent here. You can wire this card to your targets data model.
          </p>
        </div>
      </div>
    </div>
  );
}

