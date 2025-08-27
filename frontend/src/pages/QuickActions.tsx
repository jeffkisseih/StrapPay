import React, { useState } from 'react';
import { PendingPayment } from '../types/Reminder.ts';
import ScheduleForm from './ScheduleForm.tsx';
import ReminderForm from './ReminderForm.tsx';

interface QuickActionsProps {
  pendingPayments: PendingPayment[];
  onPaymentComplete: (id: string) => void;
  onPayNow: (payment: PendingPayment) => void;
  refreshPendingPayments: () => Promise<void>; // ✅ Added
}

const QuickActions: React.FC<QuickActionsProps> = ({
  pendingPayments,
  onPaymentComplete,
  onPayNow,
  refreshPendingPayments, // ✅ Destructure here
}) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  const handleScheduleClose = async () => {
    setShowScheduleForm(false);
    await refreshPendingPayments(); // ✅ Refresh after scheduling
  };

  const handleReminderClose = async () => {
    setShowReminderForm(false);
    await refreshPendingPayments(); // ✅ Refresh after setting reminder
  };

  const handleReminderSuccess = async () => {
    setShowReminderForm(false);
    await refreshPendingPayments(); // ✅ Refresh after success
  };

  const handleScheduleSuccess = async () => {
    setShowScheduleForm(false);
    await refreshPendingPayments(); // ✅ Refresh after success
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-purple-600 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ✅ Pay Now */}
        <div
          className="bg-blue-600 text-white rounded-lg shadow-md p-5 cursor-pointer transform transition hover:-translate-y-1 hover:shadow-lg"
          onClick={() => {
            if (!pendingPayments.length) {
              alert('No overdue payments to process.');
            } else {
              onPayNow?.(pendingPayments[0]);
            }
          }}
        >
          <h3 className="text-lg font-semibold mb-2">Pay Now</h3>
          <p className="text-sm text-blue-100">Process the next overdue payment</p>
        </div>

        {/* ✅ Schedule Payment */}
        <div
          className="bg-green-600 text-white rounded-lg shadow-md p-5 cursor-pointer transform transition hover:-translate-y-1 hover:shadow-lg"
          onClick={() => setShowScheduleForm(true)}
        >
          <h3 className="text-lg font-semibold mb-2">Schedule Payment</h3>
          <p className="text-sm text-green-100">Set up auto-pay for recurring bills</p>
        </div>

        {/* ✅ Set Reminder */}
        <div
          className="bg-purple-600 text-white rounded-lg shadow-md p-5 cursor-pointer transform transition hover:-translate-y-1 hover:shadow-lg"
          onClick={() => setShowReminderForm(true)}
        >
          <h3 className="text-lg font-semibold mb-2">Set Reminder</h3>
          <p className="text-sm text-purple-100">Customize payment notifications</p>
        </div>
      </div>

      {/* ✅ Schedule Form */}
      {showScheduleForm && (
        <ScheduleForm onClose={handleScheduleClose} onSuccess={handleScheduleSuccess} />
      )}

      {/* ✅ Reminder Form */}
      {showReminderForm && (
        <ReminderForm onClose={handleReminderClose} onSuccess={handleReminderSuccess} />
      )}
    </div>
  );
};

export default QuickActions;



