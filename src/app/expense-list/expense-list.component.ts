import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Expense, ExpenseService } from '../expense.service';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, FormsModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  start = -8640000000000000;
  end = 8640000000000000;
  newExpense = { date: '', comments: '', amount: 0};


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

  addExpense() {
    console.log(this.newExpense.date == '')
    const addedExpense = {
      id: String(this.expenses.length + 1),
      date: new Date(this.newExpense.date).getTime(),
      comments: this.newExpense.comments,
      amount: this.newExpense.amount
    };

    this.expenseService.addExpense(addedExpense).subscribe({
    next: (expense: Expense) => {
      this.expenses.push(expense);
      this.newExpense = { date: '', comments: '' , amount: 0};
    },
    error: (error) => {
      console.error('Error adding expense:', error);
    }
    })
  }
}
