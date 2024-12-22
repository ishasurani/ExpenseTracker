import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Expense, ExpenseService, ExpenseType } from '../expense.service';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ExpenseMonthlyComponent } from '../expense-monthly/expense-monthly.component';
import { ExpenseYearlyComponent } from '../expense-yearly/expense-yearly.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    DatePipe, 
    ExpenseMonthlyComponent, 
    ExpenseYearlyComponent, 
    MatTableModule, 
    MatCardModule, 
    MatPaginatorModule, 
    MatSortModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit, AfterViewInit {
  expenses: Expense[] = [];
  dataSource = new MatTableDataSource<Expense>(this.expenses);
  start = -8640000000000000;
  end = 8640000000000000;
  total = 0;
  currMonth = new Date().getMonth()
  currYear = new Date().getFullYear()
  displayedColumns: string[] = ['date', 'amount', 'type', 'comments', 'edit'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private expenseService: ExpenseService, private datePipe: DatePipe, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((p: Params) => {
      const params = p['params']
      this.start = params['start']? +params['start'] : -8640000000000000; 
      this.end = params['end']? +params['end'] : 8640000000000000;
      this.expenseService.getExpenses(this.start, this.end).subscribe((data: Expense[]) => {
        this.expenses = data
        this.dataSource.data = this.expenses
        this.recalculateMonthlyTotal()
    })
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      const key = property as keyof Expense;
      switch (key) {
        case 'date': return item.date
        case 'amount': return item.amount
        default: return item[key]
      }
    };
  }

  formatDate(date: number): string {
    return this.datePipe.transform(new Date(date), 'dd/MM/yyyy')!;
  }

  addExpenseDialog() {
    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const utcDate = new Date(result.date)
        const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
        const addedExpense = {
          id: String(this.expenses.length + 1),
          date: localDate.getTime(),
          comments: result.comments,
          amount: result.amount,
          type: result.type as ExpenseType
        };

        this.expenseService.addExpense(addedExpense).subscribe({
          next: (expense: Expense) => {
            this.expenses = [...this.expenses, expense];
            this.dataSource.data = this.expenses;
            if (localDate.getMonth() === this.currMonth && localDate.getFullYear() === this.currYear) {
              this.recalculateMonthlyTotal()
            }
          },
          error: (error) => {
            console.error('Error adding expense:', error);
          }
        })
      }
    })
  }

  editExpenseDialog(id: string) {
    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width: '600px',
      data: id
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const utcDate = new Date(result.date)
        const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
        const updatedExpense = {
          id,
          date: localDate.getTime(),
          comments: result.comments,
          amount: result.amount,
          type: result.type as ExpenseType
        };

        this.expenseService.updateExpense(updatedExpense).subscribe({
          next: (expense: Expense) => {
            const index = this.expenses.findIndex(exp => exp.id === expense.id);
            if (index !== -1) {
              this.expenses[index] = expense;
              this.dataSource.data = [...this.expenses];
              if (localDate.getMonth() === this.currMonth && localDate.getFullYear() === this.currYear) {
                this.recalculateMonthlyTotal()
              }
            }
          },
          error: (error) => {
            console.error('Error editing expense:', error);
          }
        });
      }
    })
  }

  recalculateMonthlyTotal() {
    this.total = 0
    this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === this.currMonth && expenseDate.getFullYear() === this.currYear;
    })
    .forEach(expense => {
      this.total += expense.amount;
    });
  }
}