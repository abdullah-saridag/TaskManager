import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';

export const TASKS_ROUTES: Routes = [
  { path: '', component: TaskListComponent },
  { path: ':id/edit', component: TaskEditComponent }
]; 