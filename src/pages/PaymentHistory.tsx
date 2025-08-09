import React, { useState, useEffect } from 'react';
import { HistoryData } from '../types/Reminder.ts';

const PaymentHistory: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error('Failed to fetch payment history');
        const data = await response.json();
        setHistoryData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
     <div className="mb-8">
      <h2 className="text-xl font-bold text-yellow-800 mb-4">Payment History</h2>
      <div
        className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-yellow-800">Last Payments</span>
        <span className="text-yellow-800">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="overflow-hidden rounded-lg shadow">
          {loading ? (
            <p className="p-4 text-yellow-800">Loading...</p>
          ) : error ? (
            <p className="p-4 text-red-500">Error: {error}</p>
          ) : historyData.length === 0 ? (
            <p className="p-4 text-gray-600">No payment history found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ${item.amount.toFixed(2)}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ${item.status === 'Completed' ? 'Paid' : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  </>
);}

export default PaymentHistory;
