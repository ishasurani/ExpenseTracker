import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AppRoutingModule } from './app.routes';
import { ExpenseService } from './expense.service';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseMonthlyComponent } from './expense-monthly/expense-monthly.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ExpenseYearlyComponent } from './expense-yearly/expense-yearly.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ExpenseListComponent, CommonModule, ReactiveFormsModule, FormsModule, ExpenseMonthlyComponent, ExpenseYearlyComponent],
  providers: [ExpenseService, provideHttpClient(), DatePipe, provideCharts(withDefaultRegisterables()), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}