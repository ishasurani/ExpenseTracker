import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Expense, ExpenseType } from '../expense.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expense-yearly',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
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
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
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

    const monthlyTypeTotals = new Map<string, Map<string, number>>();
    const expenseTypes = Object.values(ExpenseType);

    labels.forEach(label => {
      const typeMap = new Map<string, number>();
      expenseTypes.forEach(type => typeMap.set(type, 0))
      monthlyTypeTotals.set(label, typeMap)
    })

    recentExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

      if (monthlyTypeTotals.has(monthYear)) {
        const typeMap = monthlyTypeTotals.get(monthYear)
        typeMap?.set(expense.type, typeMap.get(expense.type)! + expense.amount)
      }
    })
    const colours = ['#FFB6C1', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#4CAF50', '#9E9E9E', '#AEEEEE', '#FF4500']
    const datasets = expenseTypes.map((type, i) => ({
      label: type,
      data: labels.map(month => monthlyTypeTotals.get(month)!.get(type)!),
      backgroundColor: colours[i],
    }))

    this.barChartData.labels = labels;
    this.barChartData.datasets =  datasets;

    if (this.chart) {
      this.chart.update();
    }
  }

}

