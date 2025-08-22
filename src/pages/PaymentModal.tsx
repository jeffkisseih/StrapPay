import React, { useState } from 'react';
import { PendingPayment } from '../types/Reminder.ts';

interface Props {
  payment: PendingPayment | null;
  onClose: () => void;
  onPaid: (id: string) => void;
  refreshPendingPayments: () => Promise<void>; // ✅ Add refresh here
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PaymentModal: React.FC<Props> = ({ payment, onClose, onPaid, refreshPendingPayments }) => {
  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const isValidCard = (num: string) => /^\d{12,19}$/.test(num.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardName.trim() || !cardNumber.trim()) {
      alert('Please fill in both the cardholder name and card number.');
      return;
    }

    if (!isValidCard(cardNumber)) {
      alert('Please enter a valid card number (12 to 19 digits).');
      return;
    }

    if (!payment?.id) {
      alert('Payment data is missing.');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${API_BASE}/api/payments/${payment.id}/mark-paid`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark payment as paid.');
      }

      alert(`Payment for ${payment.name} completed successfully!`);
      onPaid(String(payment.id));
      
      await refreshPendingPayments(); // ✅ Refresh reminders
    } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred while processing payment.');
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Pay: {payment.name}</h2>
        <p className="mb-2">Amount: ${payment.amount.toFixed(2)}</p>
        <p className="mb-4 text-sm text-gray-500">Due: {new Date(payment.dueDate).toDateString()}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Card Number</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
