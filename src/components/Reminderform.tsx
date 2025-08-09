import { useState } from 'react';

export default function ReminderForm({ mode, data }: any) {
  const [title, setTitle] = useState(data?.title || '');
  const [amount, setAmount] = useState(data?.amount || 0);
  const [dueDate, setDueDate] = useState(data?.dueDate || '');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = { userId: 'YOUR_USER_ID', title, amount, dueDate };
    const url = mode === 'create' ? '/api/reminders' : `/api/reminders/${data._id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    await fetch(`http://localhost:5000${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <input className="block mb-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input className="block mb-2" value={amount} onChange={e => setAmount(Number(e.target.value))} type="number" placeholder="Amount" />
      <input className="block mb-2" value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">{mode === 'create' ? 'Add' : 'Update'} Reminder</button>
    </form>
  );
}