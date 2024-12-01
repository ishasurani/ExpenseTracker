import { Component, Inject } from '@angular/core';
import { ExpenseType } from '../expense.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  newExpense = { date: '', comments: '', amount: 0, type: ''};
  expenseTypes = Object.values(ExpenseType);

  constructor(
    public dialogRef: MatDialogRef<AddExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  addExpense() {
    if (this.newExpense.date && this.newExpense.amount && this.newExpense.type) {
      this.dialogRef.close(this.newExpense);
    }
  }
}
