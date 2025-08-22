import React, { useState } from 'react';

interface ScheduleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE =   import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://strappay-production.up.railway.app";

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onClose , onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [billType, setBillType] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !billType || !reminderDate) {
      alert('Please fill in all fields.');
      return;
    }

      const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert('Please enter a valid payment amount.');
    return;
  }

  // Validate date
  const selectedDate = new Date(reminderDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // ignore time portion

  if (isNaN(selectedDate.getTime())) {
    alert('Please enter a valid date.');
    return;
  }

  if (selectedDate < now) {
    alert('Reminder date cannot be in the past.');
    return;
  }

    try {
      const res = await fetch(`${API_BASE}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type: billType,
          dueDate: new Date(reminderDate).toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to schedule payment.');

      alert('Payment scheduled successfully.');
      onClose();
      onSuccess();
    } catch (err) {
      alert('An error occurred while scheduling.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Schedule Payment Reminder</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Payment Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Type of Bill</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              required
            >
              <option value="">Select bill type</option>
              <option value="subscription">Subscription</option>
              <option value="internet bill">Internet Bill</option>
              <option value="utilities">Utilities</option>
              <option value="water bill">Water Bill</option>
              <option value="light bill">Light Bill</option>
              <option value="credit card">Credit Card</option>
              <option value="debit card">Debit Card</option>
              <option value="momo">Momo</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Reminder Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
