import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Expense, ExpenseType } from '../expense.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expense-monthly',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  templateUrl: './expense-monthly.component.html',
  styleUrl: './expense-monthly.component.scss'
})
export class ExpenseMonthlyComponent  implements OnChanges{
  @Input() expenses: Expense[] = []
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  monthlyTotals: Record<string, number> = {}
  month: number = new Date().getMonth()
  year: number = new Date().getFullYear()
  expenseTypes = Object.values(ExpenseType);
  noExpenses = true;

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15
        }
      },
    },
  };
  chartData: ChartData<'pie'> = {
    labels: this.expenseTypes,
    datasets: [
      {
        data: [],
        backgroundColor: ['#FFB6C1', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#4CAF50', '#9E9E9E', '#AEEEEE', '#FF4500'],
      },
    ],
  };

  ngOnChanges() {
    this.recalculateMonthlyTotals(this.month, this.year)
  }

  recalculateMonthlyTotals(month: number, year: number) {
    this.monthlyTotals = {};
    this.expenseTypes.forEach(type => {
      this.monthlyTotals[type] = 0;
    });

    this.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
      })
      .forEach(expense => {
        const expenseType = expense.type as ExpenseType;
        this.monthlyTotals[expenseType] += expense.amount;
      });


      this.chartData.datasets[0].data = Object.values(this.monthlyTotals); // update chart data
      this.noExpenses = this.expenseTypes.every(type => (this.monthlyTotals[type] || 0) === 0);
      if (this.chart) {
        this.chart.update();
      }
  }

  onMonthChange(e: Event){
    const selectedDate = new Date((e.target as HTMLSelectElement).value);
    this.month = selectedDate.getUTCMonth();
    this.year = selectedDate.getFullYear();
    this.recalculateMonthlyTotals(this.month, this.year)
  }
}
