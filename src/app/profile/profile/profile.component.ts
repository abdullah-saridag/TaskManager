import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../tasks/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  tasks$: Observable<Task[]> = this.taskService.getTasks();

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    // No need to reassign tasks$ here since it's initialized in the property declaration
  }

  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(task => task.completed).length;
  }
}