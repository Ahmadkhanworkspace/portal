'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FormField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  validation?: string;
  options?: string[];
}

interface FormData {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export default function FormPreviewPage() {
  const params = useParams();
  const formId = params.id;
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formId || typeof formId !== 'string') {
        setError('Invalid form ID');
        return;
      }
      
      const response = await fetch(`/api/forms/${formId}`);
      const result = await response.json();
      
      if (result.success) {
        setFormData(result.data);
      } else {
        setError(result.error || 'Failed to load form');
        console.error('Form fetch error:', result);
      }
    } catch (err: any) {
      console.error('Form fetch exception:', err);
      setError(err.message || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/forms" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Forms
          </Link>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/forms" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Forms
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Form not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/forms" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Forms
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData.title}</h1>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-6">
          {formData.fields.map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'text' && (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                  placeholder={field.validation || ''}
                />
              )}
              {field.type === 'date' && (
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                />
              )}
              {field.type === 'radio' && field.options && (
                <div className="space-y-2">
                  {field.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center">
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        className="mr-2"
                      />
                      <span className="text-black">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'select' && field.options && (
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white">
                  <option value="">Select an option</option>
                  {field.options.map((option, optIdx) => (
                    <option key={optIdx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {field.type === 'textarea' && (
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white resize-y"
                  rows={4}
                />
              )}
              {field.type === 'checkbox' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                  />
                  <span className="text-black">I agree</span>
                </label>
              )}
              {field.type === 'email' && (
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                  placeholder={field.validation || ''}
                />
              )}
              {field.type === 'tel' && (
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                  placeholder={field.validation || ''}
                />
              )}
              {field.type === 'number' && (
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                  placeholder={field.validation || ''}
                />
              )}
              {field.validation && !field.options && (
                <p className="text-xs text-gray-500 mt-1">{field.validation}</p>
              )}
            </div>
          ))}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
            <Link
              href="/forms"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

