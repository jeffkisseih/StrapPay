import React, { useState } from 'react';

interface ReminderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const ReminderForm: React.FC<ReminderFormProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert('Please enter a valid payment amount.');
    return;
  }

  // Validate date
  const selectedDate = new Date(dueDate);
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
        body: JSON.stringify({ type: title, amount: parseFloat(amount), dueDate }),
      });

      if (!res.ok) throw new Error('Failed to create reminder.');

      alert('Reminder set successfully.');
      onClose();
      onSuccess();
    } catch (err) {
      alert('An error occurred while setting the reminder.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Set a Reminder</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Reminder Title</label>
            <input type="text" className="w-full px-3 py-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700">Amount</label>
            <input type="number" className="w-full px-3 py-2 border rounded" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700">Due Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Set</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
