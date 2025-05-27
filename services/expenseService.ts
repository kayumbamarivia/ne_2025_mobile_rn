import { API_CONFIG } from './api/config';
import { Expense, CreateExpenseData } from '../types/expense';
import axios from 'axios';

class ExpenseService {
  private readonly baseUrl: string;
  private readonly api;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: API_CONFIG.HEADERS,
    });
  }

 async createExpense(expenseData: CreateExpenseData): Promise<Expense> {
  try {
    const today = new Date();
    const expenseDate = new Date(expenseData.date);

    if (expenseDate > today) {
      throw new Error('Expense date cannot be in the future.');
    }

    const { data } = await this.api.post('/expenses', expenseData);
    return data;
  } catch (error) {
    console.error('Create expense error:', error);
    throw error;
  }
}



  async getExpense(id: string): Promise<Expense> {
    try {
      const { data } = await this.api.get(`/expenses/${id}`);
      return data;
    } catch (error) {
      console.error('Get expense error:', error);
      throw error;
    }
  }

  async getAllExpenses(userId: string): Promise<Expense[]> {
    try {
      const { data } = await this.api.get(`/expenses`, {
        params: { userId }
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error('Get all expenses error:', error);
      return [];
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      await this.api.delete(`/expenses/${id}`);
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }

  async getExpenseById(expenseId: string): Promise<Expense> {
    try {
      const { data } = await this.api.get(`/expenses/${expenseId}`);
      return data;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  async deleteExpenseById(expenseId: string): Promise<void> {
    try {
      await this.api.delete(`/expenses/${expenseId}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();
