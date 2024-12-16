import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ExpenseListComponent } from './expense-list/expense-list.component';

export const routes: Routes = [
    { path: 'expenses', component: ExpenseListComponent},
    { path: 'expenses/:start/:end', component: ExpenseListComponent},
    { path: '**', redirectTo: '/expenses', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }