import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { TASKS_ROUTES } from './tasks.routes';

import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskService } from './task.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    TaskListComponent,
    TaskFormComponent,
    RouterModule.forChild(TASKS_ROUTES)
  ],
  providers: [
    TaskService
  ],
  exports: [RouterModule]
})
export class TasksModule { }