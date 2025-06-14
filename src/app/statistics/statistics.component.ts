import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../tasks/task.service';
import { Task } from '../shared/models/task.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="statistics-container">
      <div class="statistics-header">
        <h2>Görev İstatistikleri</h2>
      </div>

      <div class="statistics-grid">
        <!-- Genel İstatistikler -->
        <div class="stat-card">
          <h3>Genel Bakış</h3>
          <div class="stat-item">
            <span class="stat-label">Toplam Görev</span>
            <span class="stat-value">{{ totalTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tamamlanan</span>
            <span class="stat-value">{{ completedTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Bekleyen</span>
            <span class="stat-value">{{ pendingTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tamamlanma Oranı</span>
            <span class="stat-value">{{ completionRate }}%</span>
          </div>
        </div>

        <!-- Kategori İstatistikleri -->
        <div class="stat-card">
          <h3>Kategori Dağılımı</h3>
          <div class="stat-item" *ngFor="let category of categoryStats">
            <span class="stat-label">{{ category.name }}</span>
            <span class="stat-value">{{ category.count }}</span>
          </div>
        </div>

        <!-- Öncelik İstatistikleri -->
        <div class="stat-card">
          <h3>Öncelik Dağılımı</h3>
          <div class="stat-item">
            <span class="stat-label">Yüksek Öncelikli</span>
            <span class="stat-value">{{ priorityStats.high }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Orta Öncelikli</span>
            <span class="stat-value">{{ priorityStats.medium }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Düşük Öncelikli</span>
            <span class="stat-value">{{ priorityStats.low }}</span>
          </div>
        </div>

        <!-- Zaman İstatistikleri -->
        <div class="stat-card">
          <h3>Zaman İstatistikleri</h3>
          <div class="stat-item">
            <span class="stat-label">Bugün Biten</span>
            <span class="stat-value">{{ todayTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Bu Hafta Biten</span>
            <span class="stat-value">{{ thisWeekTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Bu Ay Biten</span>
            <span class="stat-value">{{ thisMonthTasks }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .statistics-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.25rem;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #666;
    }

    .stat-value {
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .statistics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  tasks: Task[] = [];
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  completionRate = 0;
  categoryStats: { name: string; count: number }[] = [];
  priorityStats = { high: 0, medium: 0, low: 0 };
  todayTasks = 0;
  thisWeekTasks = 0;
  thisMonthTasks = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Görevler yüklenirken hata:', error);
      }
    });
  }

  private calculateStatistics(): void {
    // Genel istatistikler
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(task => task.completed).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;
    this.completionRate = this.totalTasks > 0 
      ? Math.round((this.completedTasks / this.totalTasks) * 100) 
      : 0;

    // Kategori istatistikleri
    const categories = new Map<string, number>();
    this.tasks.forEach(task => {
      categories.set(task.category, (categories.get(task.category) || 0) + 1);
    });
    this.categoryStats = Array.from(categories.entries()).map(([name, count]) => ({
      name,
      count
    }));

    // Öncelik istatistikleri
    this.priorityStats = {
      high: this.tasks.filter(task => task.priority === 'high').length,
      medium: this.tasks.filter(task => task.priority === 'medium').length,
      low: this.tasks.filter(task => task.priority === 'low').length
    };

    // Zaman istatistikleri
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    this.todayTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && task.completed;
    }).length;

    this.thisWeekTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= weekStart && task.completed;
    }).length;

    this.thisMonthTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= monthStart && task.completed;
    }).length;
  }
} 