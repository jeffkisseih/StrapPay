import React, { useEffect, useState } from 'react'; 
import PaymentSummary from './PaymentSummary.tsx';
import QuickActions from './QuickActions.tsx';
import PaymentHistory from './PaymentHistory.tsx';
import PaymentModal from './PaymentModal.tsx';
import { PendingPayment } from '../types/Reminder.ts';
import Reminder from '../types/Reminder.ts';


const Dashboard: React.FC = () => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const API_BASE =   import.meta.env.VITE_API_URL;

  const refreshPendingPayments = async () => {
    try {
      const res = await fetch(`${API_BASE}/payments/pending`); // ✅ updated route
      const data = await res.json();
      setPendingPayments(
        data.map((p: any) => ({
          id: p._id,
          name: p.title,
          amount: p.amount,
          dueDate: new Date(p.dueDate),
          lateFee: p.lateFee || 0,
          lateFeeDate: p.lateFeeDate ? new Date(p.lateFeeDate) : new Date(p.dueDate),
          overdueDays: Math.max(
            0,
            Math.floor((Date.now() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24))
          ),
          isPaid: p.isPaid || false,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch pending payments:', err);
    }
  };

  useEffect(() => {
    refreshPendingPayments();
  }, []);

  const handlePaymentComplete = (id: string) => {
    setPendingPayments((prev) => prev.filter((p) => String(p.id) !== id));
  };

  const handlePayNow = (payment: PendingPayment) => {
    if (!payment) {
      alert('No payment selected.');
      return;
    }

    setSelectedPayment(payment);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 w-full h-full bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-blue-600 pb-2 mb-6 border-b-2 border-blue-600">
        Reminders Dashboard
      </h2>

      <PaymentSummary reminders={pendingPayments as unknown as Reminder[]} />

      <QuickActions
        pendingPayments={pendingPayments}
        onPaymentComplete={handlePaymentComplete}
        onPayNow={handlePayNow}
        refreshPendingPayments={refreshPendingPayments} // ✅ now passing this down
      />

      <PaymentHistory />

      {showModal && selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            setShowModal(false);
          }}
          onPaid={() => {
            handlePaymentComplete(String(selectedPayment.id));
            setSelectedPayment(null);
            setShowModal(false);
            refreshPendingPayments(); // ✅ refresh on modal payment
          }}
          refreshPendingPayments={refreshPendingPayments} // ✅ pass down refresh
        />
      )}
    </div>
  );
};

export default Dashboard;
