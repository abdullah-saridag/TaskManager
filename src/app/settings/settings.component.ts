import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h2>Ayarlar</h2>
      </div>

      <div class="settings-grid">
        <!-- Profil Ayarları -->
        <div class="settings-card">
          <h3>Profil Ayarları</h3>
          <div class="settings-form">
            <div class="form-group">
              <label for="email">E-posta</label>
              <input type="email" id="email" [(ngModel)]="email" disabled>
            </div>
            <div class="form-group">
              <label for="currentPassword">Mevcut Şifre</label>
              <input type="password" id="currentPassword" [(ngModel)]="currentPassword">
            </div>
            <div class="form-group">
              <label for="newPassword">Yeni Şifre</label>
              <input type="password" id="newPassword" [(ngModel)]="newPassword">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Şifre Tekrar</label>
              <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword">
            </div>
            <button class="btn-primary" (click)="updatePassword()">Şifreyi Güncelle</button>
          </div>
        </div>

        <!-- Bildirim Ayarları -->
        <div class="settings-card">
          <h3>Bildirim Ayarları</h3>
          <div class="settings-form">
            <div class="form-group checkbox">
              <input type="checkbox" id="emailNotifications" [(ngModel)]="settings.emailNotifications">
              <label for="emailNotifications">E-posta Bildirimleri</label>
            </div>
            <div class="form-group checkbox">
              <input type="checkbox" id="taskReminders" [(ngModel)]="settings.taskReminders">
              <label for="taskReminders">Görev Hatırlatıcıları</label>
            </div>
            <div class="form-group checkbox">
              <input type="checkbox" id="weeklyReport" [(ngModel)]="settings.weeklyReport">
              <label for="weeklyReport">Haftalık Rapor</label>
            </div>
            <button class="btn-primary" (click)="updateSettings()">Ayarları Kaydet</button>
          </div>
        </div>

        <!-- Tema Ayarları -->
        <div class="settings-card">
          <h3>Tema Ayarları</h3>
          <div class="settings-form">
            <div class="form-group">
              <label for="theme">Tema</label>
              <select id="theme" [(ngModel)]="settings.theme" (change)="updateTheme()">
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
                <option value="system">Sistem Teması</option>
              </select>
            </div>
            <div class="form-group">
              <label for="language">Dil</label>
              <select id="language" [(ngModel)]="settings.language" (change)="updateLanguage()">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .settings-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .settings-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .settings-card h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.25rem;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    label {
      color: #666;
      font-size: 0.9rem;
    }

    input[type="email"],
    input[type="password"],
    select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input[type="email"]:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    .btn-primary:hover {
      background-color: #45a049;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit, OnDestroy {
  email = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  settings = {
    emailNotifications: true,
    taskReminders: true,
    weeklyReport: false,
    theme: 'light',
    language: 'tr'
  };
  currentUser: User | null = null;
  private subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserSettings();
    this.subscription.add(
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUserSettings(): void {
    this.authService.user$.subscribe({
      next: (user: User | null) => {
        if (user) {
          this.email = user.email || '';
          // Kullanıcı ayarlarını yükle
          // TODO: Implement settings loading from Firebase
        }
      },
      error: (error: Error) => {
        console.error('Ayarlar yüklenirken hata:', error);
      }
    });
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }

    // TODO: Implement password update
    alert('Şifre güncelleme özelliği yakında eklenecek!');
  }

  updateSettings(): void {
    // TODO: Implement settings update
    alert('Ayarlar kaydedildi!');
  }

  updateTheme(): void {
    // TODO: Implement theme update
    document.body.setAttribute('data-theme', this.settings.theme);
  }

  updateLanguage(): void {
    // TODO: Implement language update
    alert('Dil değiştirme özelliği yakında eklenecek!');
  }
} 