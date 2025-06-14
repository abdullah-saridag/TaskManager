import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    console.log('AuthGuard: Checking authentication status');
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user;
        console.log('AuthGuard: Is authenticated?', isAuthenticated);
        
        if (isAuthenticated) {
          return true;
        }
        
        console.log('AuthGuard: Redirecting to login');
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      })
    );
  }
}
