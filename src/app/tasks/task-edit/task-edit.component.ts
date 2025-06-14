import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../task.service';
import { Task } from '../../shared/models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="edit-container">
      <div class="edit-header">
        <h2>Görev Düzenle</h2>
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="isLoading" class="loading">
        Görev yükleniyor...
      </div>

      <div *ngIf="!isLoading && task" class="edit-form">
        <app-task-form
          [taskToEdit]="task"
          (formSubmitted)="onTaskSubmit($event)"
          (cancel)="onCancel()">
        </app-task-form>
      </div>
    </div>
  `,
  styles: [`
    .edit-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .edit-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .edit-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-message {
      background-color: #fee;
      color: #c00;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class TaskEditComponent implements OnInit, OnDestroy {
  task: Task | null = null;
  isLoading = false;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.error = 'Görev ID bulunamadı.';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadTask(taskId: string): void {
    this.isLoading = true;
    this.error = null;

    this.subscription.add(
      this.taskService.getTaskById(taskId).subscribe({
        next: (task) => {
          this.task = task;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Görev yüklenirken bir hata oluştu.';
          this.isLoading = false;
          console.error('Görev yüklenirken hata:', error);
        }
      })
    );
  }

  onTaskSubmit(task: Task): void {
    this.isLoading = true;
    this.error = null;

    if (!task.id) {
      this.error = 'Görev ID bulunamadı.';
      this.isLoading = false;
      return;
    }

    this.subscription.add(
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = 'Görev güncellenirken bir hata oluştu.';
          this.isLoading = false;
          console.error('Görev güncellenirken hata:', error);
        }
      })
    );
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
} 