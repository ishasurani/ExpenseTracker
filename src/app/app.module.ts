import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AppRoutingModule } from './app.routes';
import { ExpenseService } from './expense.service';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ExpenseDetailComponent, ExpenseListComponent, CommonModule, ReactiveFormsModule, FormsModule],
  providers: [ExpenseService, provideHttpClient(), DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}