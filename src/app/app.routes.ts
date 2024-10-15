import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';

export const routes: Routes = [
    { path: 'expenses', component: ExpenseListComponent},
    { path: 'expenses/:start/:end', component: ExpenseListComponent},
    { path: 'expenses/:id', component: ExpenseDetailComponent},
    { path: '**', redirectTo: '/expenses', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }