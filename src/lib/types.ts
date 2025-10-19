export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: User[];
  createdBy: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: Date;
  category: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
