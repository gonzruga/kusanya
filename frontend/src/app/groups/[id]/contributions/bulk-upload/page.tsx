'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { api } from '@/lib/api';

export default function BulkContributionUploadPage() {
  const params = useParams();
  const router = useRouter();

  const groupId = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV, XLS or XLSX file.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('groupId', groupId);

      const response = await api.post(
        '/contributions/bulk-upload',
        formData,
      );

      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Could not upload contribution file.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">
        Upload Contributions
      </h1>

      <p className="text-gray-600 mb-6">
        Upload contribution transactions from CSV, XLS or XLSX.
      </p>

      <div className="border rounded-lg p-6">
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="mb-4"
        />

        <div className="text-sm text-gray-600 mb-4">
          <p>
            Required columns:
          </p>

          <p className="font-mono mt-2">
            firstName, lastName, amount, mobileNumber,
            transactionReference, provider, providerReference,
            campaignId
          </p>

          <p className="mt-2">
            transactionReference must contain the campaign code.
            The campaignId is only used as a cross-check.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading
            ? 'Uploading...'
            : 'Upload Contributions'}
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Import Result
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">
                Total rows
              </div>
              <div className="text-2xl font-bold">
                {result.totalRows}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">
                Imported
              </div>
              <div className="text-2xl font-bold text-green-600">
                {result.imported}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">
                Failed
              </div>
              <div className="text-2xl font-bold text-red-600">
                {result.failed}
              </div>
            </div>

            <div className="border rounded p-4">
              <div className="text-sm text-gray-500">
                Members created
              </div>
              <div className="text-2xl font-bold">
                {result.membersCreated}
              </div>
            </div>
          </div>

          {result.errors?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Import Errors
              </h3>

              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3">
                        Row
                      </th>

                      <th className="text-left p-3">
                        Mobile
                      </th>

                      <th className="text-left p-3">
                        Campaign Code
                      </th>

                      <th className="text-left p-3">
                        Error
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.errors.map(
                      (item: any, index: number) => (
                        <tr
                          key={index}
                          className="border-t"
                        >
                          <td className="p-3">
                            {item.row}
                          </td>

                          <td className="p-3">
                            {item.mobileNumber}
                          </td>

                          <td className="p-3">
                            {item.transactionReference}
                          </td>

                          <td className="p-3 text-red-600">
                            {item.error}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              href={`/groups/${groupId}`}
              className="inline-block bg-gray-600 text-white px-5 py-2 rounded"
            >
              Back to Group
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}