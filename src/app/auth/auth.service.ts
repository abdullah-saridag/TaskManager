import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface AuthData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root' // Servisin tüm uygulamada kullanılabilir olmasını sağlar
})
export class AuthService {
  // Giriş yapmış kullanıcı bilgisini observable olarak tutar
  public readonly user$: Observable<User | null> = user(this.auth);
  public currentUser: User | null = null;

  constructor(private auth: Auth) {
    // anlık kullanıcı bilgisini takip et
    this.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Yeni kullanıcı kaydı
  register({ email, password }: AuthData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Mevcut kullanıcı ile giriş
  login({ email, password }: AuthData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Oturumu kapat
  logout() {
    return signOut(this.auth);
  }
}