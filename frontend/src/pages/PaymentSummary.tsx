import React from 'react';
import Reminder, { SummaryData } from '../types/Reminder.ts';

interface PaymentSummaryProps {
  reminders: Reminder[];
}

const generateSummaryData = (reminders: Reminder[]): SummaryData[] => {
  const now = new Date();
  const todayString = now.toDateString();

  let todayCount = 0, weekCount = 0, monthCount = 0, overdueCount = 0;
  let todayAmount = 0, weekAmount = 0, monthAmount = 0, overdueAmount = 0;

  for (const reminder of reminders) {
    const due = new Date(reminder.dueDate);

    if (reminder.isPaid) continue;

    if (due.toDateString() === todayString) {
      todayCount++;
      todayAmount += reminder.amount;
    }

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    if (due >= now && due <= oneWeekFromNow) {
      weekCount++;
      weekAmount += reminder.amount;
    }

    if (
      due.getFullYear() === now.getFullYear() &&
      due.getMonth() === now.getMonth()
    ) {
      monthCount++;
      monthAmount += reminder.amount;
    }

    if (due < now) {
      overdueCount++;
      overdueAmount += reminder.amount;
    }
  }

  return [
    { period: 'Today', count: todayCount, amount: todayAmount },
    { period: 'This Week', count: weekCount, amount: weekAmount },
    { period: 'This Month', count: monthCount, amount: monthAmount },
    { period: 'Overdue', count: overdueCount, amount: overdueAmount }
  ];
};

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ reminders }) => {
  const summaryData: SummaryData[] = generateSummaryData(reminders);

  return (
    <div className="mb-8 px-1 sm:px-4 md:px-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-600 mb-4">Payment Summary</h2>

      {/* Card layout for mobile */}
      <div className="block sm:hidden space-y-4">
        {summaryData.map((row, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 border">
            <div className="font-semibold text-green-800">{row.period}</div>
            <div className="text-sm text-gray-700">Payments: {row.count}</div>
            <div className="text-sm text-gray-700">Total: ${row.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Table layout for tablets/desktops */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-green-800 uppercase tracking-wider">
                Time Period
              </th>
              <th className="px-4 py-3 text-left font-medium text-green-800 uppercase tracking-wider">
                Number of Payments
              </th>
              <th className="px-4 py-3 text-left font-medium text-green-800 uppercase tracking-wider">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-4 whitespace-nowrap">{row.period}</td>
                <td className="px-4 py-4 whitespace-nowrap">{row.count}</td>
                <td className="px-4 py-4 whitespace-nowrap">${row.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentSummary;
