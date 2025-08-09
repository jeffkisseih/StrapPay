export default interface Reminder {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  recurrence: string;
  email: string;
  userId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  title: string;
  type: string;
  name: string;
  amount: number;
  dueDate: Date;
  dueText?: string;
}

export interface PendingPayment extends Payment {
     id: string,
     name: string,
     title: string,
     type: string,
     amount: number,
     dueDate: Date,
  overdueDays: number,
}

export interface UpcomingPayment extends Payment {
  id: string;
  name: string;
  title: string;
  type: string;
  amount: number;
  dueDate: Date;
}

export interface OverduePayment extends PendingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  overdueDays: number;
}

export interface SummaryData {
  period: string;
  count: number;
  amount: number;
}

export interface HistoryData {
  date: Date;
  description: string;
  amount: number;
  status: string;
}

export interface PaymentMethod {
  type: string;
  lastFour?: string;
  expiry?: string;
  email?: string;
}





