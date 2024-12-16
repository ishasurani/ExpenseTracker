import { Component, Inject } from '@angular/core';
import { Expense, ExpenseService, ExpenseType } from '../expense.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss'
})
export class ExpenseModalComponent {
  newExpense = { date: '', comments: '', amount: 0, type: ''};
  expenseTypes = Object.values(ExpenseType);

  constructor(
    public dialogRef: MatDialogRef<ExpenseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private expenseService: ExpenseService,
    private datePipe: DatePipe,
  ) {
    if (data) {
      this.expenseService.getExpenseById(data).subscribe((data: Expense) => {
        this.newExpense = {
          date: this.datePipe.transform(new Date(data.date), 'yyyy-MM-dd')!,
          comments: data.comments,
          amount: data.amount,
          type: data.type
        };
      });
    }

  }

  addExpense() {
    if (this.newExpense.date && this.newExpense.amount && this.newExpense.type) {
      this.dialogRef.close(this.newExpense);
    }
  }
}
