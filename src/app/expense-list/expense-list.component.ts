import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Expense, ExpenseService, ExpenseType } from '../expense.service';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ExpenseMonthlyComponent } from '../expense-monthly/expense-monthly.component';
import { ExpenseYearlyComponent } from '../expense-yearly/expense-yearly.component';


@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, FormsModule, ExpenseMonthlyComponent, ExpenseYearlyComponent],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  start = -8640000000000000;
  end = 8640000000000000;
  newExpense = { date: '', comments: '', amount: 0, type: ''};
  expenseTypes = Object.values(ExpenseType);


  constructor(private route: ActivatedRoute, private expenseService: ExpenseService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((p: Params) => {
      const params = p['params']
      this.start = params['start']? +params['start'] : -8640000000000000; 
      this.end = params['end']? +params['end'] : 8640000000000000;
      this.expenseService.getExpenses(this.start, this.end).subscribe((data: Expense[]) => this.expenses = data)
    });
  }

  formatDate(date: number): string {
    return this.datePipe.transform(new Date(date), 'dd/MM/yyyy')!;
  }

  addExpense(form: NgForm) {
    const utcDate = new Date(this.newExpense.date)
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
    const addedExpense = {
      id: String(this.expenses.length + 1),
      date: localDate.getTime(),
      comments: this.newExpense.comments,
      amount: this.newExpense.amount,
      type: this.newExpense.type as ExpenseType
    };

    this.expenseService.addExpense(addedExpense).subscribe({
    next: (expense: Expense) => {
      this.expenses = [...this.expenses, expense];
      this.newExpense = { date: '', comments: '' , amount: 0, type: ''};
      form.resetForm({
        date: '',
        comments: '',
        amount: 0,
        type: ''
    });
    },
    error: (error) => {
      console.error('Error adding expense:', error);
    }
    })
  }
}
