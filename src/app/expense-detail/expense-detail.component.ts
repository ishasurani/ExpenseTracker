import { Component, OnInit } from '@angular/core';
import { Expense, ExpenseService } from '../expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ReactiveFormsModule],
  templateUrl: './expense-detail.component.html',
  styleUrl: './expense-detail.component.scss'
})
export class ExpenseDetailComponent implements OnInit {
  expense!: Expense;
  date = '';
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.expenseService.getExpenseById(id).subscribe((data: Expense) => {
        this.expense = data;
        this.date = this.datePipe.transform(new Date(this.expense.date), 'dd/MM/yyyy')!;
        this.createForm();
      });
    }

  createForm(): void {
    this.form = this.fb.group({
      comments: [this.expense.comments, [
        Validators.pattern('[a-zA-Z0-9 ]*')
      ]]
    })
  }

  back(): void {
    this.router.navigate(['/expense']);
  }

  submit(): void {
    this.expense.comments = this.form.value.comments;
    this.expenseService.updateExpense(this.expense).subscribe((data: Expense) => {
      this.expense = data;
      this.router.navigate(['/expense']);
    });
  }
}
