import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../shared/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() taskToEdit: Task | null = null;
  @Output() formSubmitted = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  task: Task = {
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  categories = ['İş', 'Kişisel', 'Alışveriş', 'Sağlık', 'Diğer'];
  priorities = [
    { value: 'high', label: 'Yüksek' },
    { value: 'medium', label: 'Orta' },
    { value: 'low', label: 'Düşük' }
  ];

  ngOnInit() {
    if (this.taskToEdit) {
      this.task = {
        ...this.taskToEdit,
        dueDate: this.formatDate(this.taskToEdit.dueDate)
      };
    }
  }

  onSubmit() {
    if (this.task.title.trim() && this.task.description.trim()) {
      const taskToSubmit = {
        ...this.task,
        dueDate: new Date(this.task.dueDate).toISOString()
      };
      this.formSubmitted.emit(taskToSubmit);
      if (!this.taskToEdit) {
        this.resetForm();
      }
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  private resetForm() {
    this.task = {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}