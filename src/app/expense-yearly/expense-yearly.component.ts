import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Expense } from '../expense.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-expense-yearly',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './expense-yearly.component.html',
  styleUrl: './expense-yearly.component.scss'
})
export class ExpenseYearlyComponent  implements OnChanges{
  @Input() expenses: Expense[] = []
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [],
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnChanges() {
    this.recalculateTotals()
  }

  recalculateTotals() {
    const currDate = new Date()

    const recentExpenses = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(currDate.getFullYear(), currDate.getMonth() - 11, 1) && expenseDate <= new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    });

    const labels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currDate.getFullYear(), currDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month.toString().padStart(2, '0')}-${year}`;
    }).reverse();

    const monthlyTotals = new Map(labels.map(label => [label, 0]));

    recentExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

      if (monthlyTotals.has(monthYear)) {
        monthlyTotals.set(monthYear, monthlyTotals.get(monthYear)! + expense.amount);
      }
    })
    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data =  Array.from(monthlyTotals.values());

    if (this.chart) {
      this.chart.update();
    }
  }

}

