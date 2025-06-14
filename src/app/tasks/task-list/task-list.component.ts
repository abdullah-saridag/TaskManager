import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../task.service';
import { Task } from '../../shared/models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  isLoading = false;
  error: string | null = null;
  showTaskForm = false;
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddTask(): void {
    this.showTaskForm = true;
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = null;
    this.subscription.add(
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Görevler yüklenirken bir hata oluştu.';
          this.isLoading = false;
          console.error('Görevler yüklenirken hata:', error);
        }
      })
    );
  }

  onTaskSubmit(task: Task): void {
    this.isLoading = true;
    this.error = null;

    if (task.id) {
      // Görev güncelleme
      this.subscription.add(
        this.taskService.updateTask(task.id, task).subscribe({
          next: () => {
            this.loadTasks();
            this.showTaskForm = false;
          },
          error: (error) => {
            this.error = 'Görev güncellenirken bir hata oluştu.';
            this.isLoading = false;
            console.error('Görev güncellenirken hata:', error);
          }
        })
      );
    } else {
      // Yeni görev oluşturma
      this.subscription.add(
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.loadTasks();
            this.showTaskForm = false;
          },
          error: (error) => {
            this.error = 'Görev oluşturulurken bir hata oluştu.';
            this.isLoading = false;
            console.error('Görev oluşturulurken hata:', error);
          }
        })
      );
    }
  }

  onCancel(): void {
    this.showTaskForm = false;
    this.error = null;
  }

  onToggleComplete(task: Task): void {
    this.isLoading = true;
    this.error = null;

    const updatedTask = { ...task, completed: !task.completed };
    this.subscription.add(
      this.taskService.updateTask(task.id!, updatedTask).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          this.error = 'Görev durumu güncellenirken bir hata oluştu.';
          this.isLoading = false;
          console.error('Görev durumu güncellenirken hata:', error);
        }
      })
    );
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      this.isLoading = true;
      this.error = null;

      this.subscription.add(
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.loadTasks();
          },
          error: (error) => {
            this.error = 'Görev silinirken bir hata oluştu.';
            this.isLoading = false;
            console.error('Görev silinirken hata:', error);
          }
        })
      );
    }
  }

  getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
    const labels = {
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Düşük'
    };
    return labels[priority];
  }

  getPriorityClass(priority: 'high' | 'medium' | 'low'): string {
    return `priority-${priority}`;
  }

  // Hesaplanmış özellikler
  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
}
