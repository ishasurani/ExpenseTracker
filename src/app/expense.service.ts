import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Expense {
  id: string,
  date: number,
  comments: string,
  amount: number,
  type: ExpenseType,
}

export enum ExpenseType {
  Food = 'Food',
  Groceries = 'Groceries',
  Transportation = 'Transportation',
  Utilities = 'Utilities',
  Housing = 'Housing',
  Health = 'Health',
  Recreation = 'Recreation',
  PersonalCare = 'Personal Care & Shopping',
  Savings = 'Savings',
  Other = 'Other',
}

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {
    private apiUrl = 'http://localhost:3000/expenses';

    constructor(private http: HttpClient) {}

    getExpenseById(id: number) {
        return this.http.get<Expense>(`${this.apiUrl}/${id}`)
      }

    getExpenses(startDate: number, endDate: number) {
        return this.http.get<Expense[]>(`${this.apiUrl}/${startDate}/${endDate}`);

    }

    updateExpense(expense: Expense) {
      return this.http.put<Expense>(`${this.apiUrl}/${expense.id}`, expense);
    }

    addExpense(expense: Expense) {
      return this.http.post<Expense>(this.apiUrl, expense);
    }
}