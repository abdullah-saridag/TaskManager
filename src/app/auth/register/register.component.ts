import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthData } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Kayıt Ol</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">E-posta</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="E-posta adresinizi girin"
            />
            <div class="error" *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched">
              E-posta adresi gerekli
            </div>
            <div class="error" *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched">
              Geçerli bir e-posta adresi girin
            </div>
          </div>

          <div class="form-group">
            <label for="password">Şifre</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Şifrenizi girin"
            />
            <div class="error" *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched">
              Şifre gerekli
            </div>
            <div class="error" *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched">
              Şifre en az 6 karakter olmalıdır
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Şifre Tekrar</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              placeholder="Şifrenizi tekrar girin"
            />
            <div class="error" *ngIf="registerForm.get('confirmPassword')?.errors?.['required'] && registerForm.get('confirmPassword')?.touched">
              Şifre tekrarı gerekli
            </div>
            <div class="error" *ngIf="registerForm.get('confirmPassword')?.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched">
              Şifreler eşleşmiyor
            </div>
          </div>

          <div class="error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol' }}
          </button>

          <div class="login-link">
            Zaten hesabınız var mı? <a routerLink="/login">Giriş Yap</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .register-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #357abd;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #666;
    }

    .login-link a {
      color: #4a90e2;
      text-decoration: none;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const authData: AuthData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.subscription.add(
        this.authService.register(authData).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error: any) => {
            this.errorMessage = this.getErrorMessage(error.code);
            this.isLoading = false;
          }
        })
      );
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Bu e-posta adresi zaten kullanımda.';
      case 'auth/invalid-email':
        return 'Geçersiz e-posta adresi.';
      case 'auth/operation-not-allowed':
        return 'E-posta/şifre girişi devre dışı bırakılmış.';
      case 'auth/weak-password':
        return 'Şifre çok zayıf.';
      default:
        return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  }
} 