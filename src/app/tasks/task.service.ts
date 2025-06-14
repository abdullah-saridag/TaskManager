import { Injectable } from '@angular/core';
import { Database, ref, set, remove, update, query, orderByChild, equalTo, get, push } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Task } from '../shared/models/task.model';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private db: Database,
    private authService: AuthService
  ) {}

  private getTasksRef() {
    const userId = this.authService.currentUser?.uid;
    if (!userId) {
      throw new Error('Kullanıcı oturumu bulunamadı');
    }
    return ref(this.db, `tasks/${userId}`);
  }

  getTasks(): Observable<Task[]> {
    try {
      const tasksRef = this.getTasksRef();
      return from(get(tasksRef)).pipe(
        map(snapshot => {
          const tasks: Task[] = [];
          snapshot.forEach(childSnapshot => {
            const task = childSnapshot.val() as Task;
            task.id = childSnapshot.key || undefined;
            tasks.push(task);
          });
          return tasks;
        }),
        catchError(error => {
          console.error('Görevler alınırken hata oluştu:', error);
          return throwError(() => new Error('Görevler alınamadı'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    try {
      const tasksRef = this.getTasksRef();
      const newTaskRef = push(tasksRef);
      const newTask: Task = {
        ...task,
        id: newTaskRef.key || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return from(set(newTaskRef, newTask)).pipe(
        map(() => newTask),
        catchError(error => {
          console.error('Görev oluşturulurken hata:', error);
          return throwError(() => new Error('Görev oluşturulamadı'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  updateTask(id: string, task: Partial<Task>): Observable<void> {
    try {
      const userId = this.authService.currentUser?.uid;
      if (!userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      const taskRef = ref(this.db, `tasks/${userId}/${id}`);
      const updatedTask = {
        ...task,
        updatedAt: new Date().toISOString()
      };

      return from(update(taskRef, updatedTask)).pipe(
        catchError(error => {
          console.error('Görev güncellenirken hata:', error);
          return throwError(() => new Error('Görev güncellenemedi'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  deleteTask(id: string): Observable<void> {
    try {
      const userId = this.authService.currentUser?.uid;
      if (!userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      const taskRef = ref(this.db, `tasks/${userId}/${id}`);
      return from(remove(taskRef)).pipe(
        catchError(error => {
          console.error('Görev silinirken hata:', error);
          return throwError(() => new Error('Görev silinemedi'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  getTaskById(id: string): Observable<Task | null> {
    try {
      const userId = this.authService.currentUser?.uid;
      if (!userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      const taskRef = ref(this.db, `tasks/${userId}/${id}`);
      return from(get(taskRef)).pipe(
        map(snapshot => {
          if (!snapshot.exists()) {
            return null;
          }
          const task = snapshot.val() as Task;
          task.id = snapshot.key || undefined;
          return task;
        }),
        catchError(error => {
          console.error('Görev alınırken hata:', error);
          return throwError(() => new Error('Görev alınamadı'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  getTasksByCategory(category: string): Observable<Task[]> {
    try {
      const tasksRef = this.getTasksRef();
      const tasksQuery = query(tasksRef, orderByChild('category'), equalTo(category));
      return from(get(tasksQuery)).pipe(
        map(snapshot => {
          const tasks: Task[] = [];
          snapshot.forEach(childSnapshot => {
            const task = childSnapshot.val() as Task;
            task.id = childSnapshot.key || undefined;
            tasks.push(task);
          });
          return tasks;
        }),
        catchError(error => {
          console.error('Kategoriye göre görevler alınırken hata:', error);
          return throwError(() => new Error('Kategoriye göre görevler alınamadı'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }

  getTasksByPriority(priority: 'high' | 'medium' | 'low'): Observable<Task[]> {
    try {
      const tasksRef = this.getTasksRef();
      const tasksQuery = query(tasksRef, orderByChild('priority'), equalTo(priority));
      return from(get(tasksQuery)).pipe(
        map(snapshot => {
          const tasks: Task[] = [];
          snapshot.forEach(childSnapshot => {
            const task = childSnapshot.val() as Task;
            task.id = childSnapshot.key || undefined;
            tasks.push(task);
          });
          return tasks;
        }),
        catchError(error => {
          console.error('Önceliğe göre görevler alınırken hata:', error);
          return throwError(() => new Error('Önceliğe göre görevler alınamadı'));
        })
      );
    } catch (error) {
      console.error('Görev referansı oluşturulurken hata:', error);
      return throwError(() => new Error('Görev referansı oluşturulamadı'));
    }
  }
}