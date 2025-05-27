export interface Expense {
  id: string;
  name: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  userId: string;
} 