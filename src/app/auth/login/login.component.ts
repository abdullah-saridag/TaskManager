import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FirebaseError } from '@angular/fire/app';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  errorMessage: string | null = null;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    console.log('LoginComponent: Constructor called');
    this.authSubscription = this.authService.user$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        console.log('LoginComponent: User is authenticated, redirecting to tasks');
        this.router.navigate(['/tasks'], { replaceUrl: true });
      }
    });
  }

  ngOnInit() {
    console.log('LoginComponent: Initializing');
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    console.log('LoginComponent: Switching mode');
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }

  async onSubmit(form: NgForm) {
    console.log('LoginComponent: Form submitted');
    if (!form.valid) {
      console.log('LoginComponent: Form is invalid');
      return;
    }

    const { email, password } = form.value;
    this.errorMessage = null;

    try {
      if (this.isLoginMode) {
        console.log('LoginComponent: Attempting login');
        await this.authService.login({ email, password });
      } else {
        console.log('LoginComponent: Attempting registration');
        await this.authService.register({ email, password });
      }
      await this.router.navigate(['/tasks'], { replaceUrl: true });
    } catch (error) {
      console.error('LoginComponent: Auth error', error);
      if (error instanceof FirebaseError) {
        this.errorMessage = this.getFirebaseErrorMessage(error.code);
      } else {
        this.errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
    }
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Geçersiz e-posta adresi.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-posta veya şifre hatalı.';
      case 'auth/email-already-in-use':
        return 'Bu e-posta adresi zaten kullanılıyor.';
      default:
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }
}