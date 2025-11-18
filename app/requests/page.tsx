'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Request {
  id: string;
  type: string;
  requester: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export default function RequestsPage() {
  const [requests] = useState<Request[]>([
    {
      id: '1',
      type: 'IP Authorization',
      requester: 'test.user1@cometportal.com',
      details: 'Request to add IP: 192.168.1.50',
      status: 'Pending',
      createdAt: '2025-01-15',
    },
  ]);

  const handleApprove = (id: string) => {
    console.log('Approve request:', id);
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this request?')) {
      console.log('Reject request:', id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Requests ({requests.length})</h1>
        <p className="text-gray-600">Manage user requests and approvals</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.requester}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                        >
                          <Check size={14} className="inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          <X size={14} className="inline mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

