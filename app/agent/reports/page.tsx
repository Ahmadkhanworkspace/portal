'use client';

import { Activity } from 'lucide-react';

export default function AgentReportsPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity size={22} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>
      <p className="text-gray-600">Agent-facing reports. Hook this page to your report data for individual agents.</p>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-gray-700">
        Placeholder: show agent-level metrics or link to relevant reports.
      </div>
    </div>
  );
}

