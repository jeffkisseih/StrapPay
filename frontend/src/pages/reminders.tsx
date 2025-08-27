import React, { useEffect, useState } from 'react';
import { PendingPayment, Payment } from '../types/Reminder.ts';


const API_BASE =   import.meta.env.VITE_API_URL;

const Reminders = () => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const [overduePayments, setOverduePayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      
      const [pendingRes, upcomingRes, overdueRes] = await Promise.all([
        fetch(`${API_BASE}/payments/pending`),
        fetch(`${API_BASE}/payments/upcoming`),
        fetch(`${API_BASE}/payments/overdue`),
      ]);

      const pendingData = (await pendingRes.json()) as PendingPayment[];
      const upcomingData = (await upcomingRes.json()) as Payment[];
      const overdueData = (await overdueRes.json()) as PendingPayment[];

      setPendingPayments(
        pendingData.map((p) => ({
          ...p,
          dueDate: new Date(p.dueDate),
          overdueDays: Math.ceil(
            (new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24)
          ),
          id: p.id,
          name: p.name || p.title || p.type,
          amount: p.amount,
        }))
      );

      setUpcomingPayments(
        upcomingData.map((p) => ({
          ...p,
          dueDate: new Date(p.dueDate),
           overdueDays: Math.ceil(
            (new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24)
          ),
          id: p.id,
          name:  p.name || p.title || p.type,
          amount: p.amount,
        }))
      );

      setOverduePayments(
        overdueData.map((p) => ({
          ...p,
          dueDate: new Date(p.dueDate),
           overdueDays: Math.ceil(
            (new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24)
          ),
          id: p.id,
          name:  p.name || p.title || p.type,
          amount: p.amount,
         
        }))
      );
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getTimeFrame = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return 'Next Week';
  };

  const groupedPayments: Record<string, Payment[]> = upcomingPayments.reduce(
    (acc: Record<string, Payment[]>, payment) => {
      const timeframe = getTimeFrame(payment.dueDate);
      if (!acc[timeframe]) acc[timeframe] = [];
      acc[timeframe].push(payment);
      return acc;
    },
    {}
  );

  if (loading) {
    return <div className="p-8 text-lg">Loading payments...</div>;
  }

  return (
    <div className="space-y-8 w-[80rem] h-full bg-gray-100 p-8">

      {/* Overdue Payments */}
      <div className="bg-red-100 rounded-lg shadow-md p-5">
        <h3 className="text-xl font-semibold text-red-700 mb-4">Overdue Payments</h3>
        <div className="space-y-3">
          {overduePayments.map((payment) => (
            <div key={payment.id} className="border-b border-gray-200 pb-3 mb-3 last:border-0">
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`overdue-${payment.id}`}
                  className="h-4 w-4 mr-3 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor={`overdue-${payment.id}`} className="text-gray-800">
                  {payment.name} - ${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}
                </label>
              </div>
              <div className="ml-7 space-y-1">
                <div className="text-sm text-gray-700">
                  Overdue by {payment.overdueDays} day{payment.overdueDays !== 1 ? 's' : ''}
                </div>
              
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-red-50 rounded-lg shadow-md p-5">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Pending Payments</h3>
        <div className="space-y-3">
          {pendingPayments.map((payment) => (
            <div key={payment.id} className="border-b border-gray-200 pb-3 mb-3 last:border-0">
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`pending-${payment.id}`}
                  className="h-4 w-4 mr-3 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor={`pending-${payment.id}`} className="text-gray-800">
                  {payment.name} - ${payment.amount.toFixed(2)}
                </label>
              </div>
              <div className="ml-7 space-y-1">
                <div className="text-sm text-gray-700">
                  Overdue by {payment.overdueDays} day{payment.overdueDays !== 1 ? 's' : ''}
                </div>
              
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-yellow-50 rounded-lg shadow-md p-5">
        <h3 className="text-xl font-semibold text-yellow-600 mb-4">Upcoming Payments</h3>
        <div className="space-y-4">
          {Object.entries(groupedPayments).map(([timeframe, payments]) => (
            <div key={timeframe} className="space-y-2">
              <h4 className="font-medium text-gray-700">{timeframe}</h4>
              {payments.map((payment) => (
                <div key={payment.id} className="border-b border-gray-200 pb-3 mb-3 last:border-0">
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`payment-${payment.id}`}
                      className="h-4 w-4 mr-3 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`payment-${payment.id}`} className="text-gray-800">
                      {payment.name} - ${payment.amount.toFixed(2)}
                    </label>
                  </div>
                  <div className="text-sm italic text-gray-600 ml-7">
                    {payment.dueDate.toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
