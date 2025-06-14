import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

const firebaseConfig = {
  apiKey: "AIzaSyAjT8p2OhOqrpfYM02zkCtz_xii5SJ5SnI",
  authDomain: "gorev-takip-projesi.firebaseapp.com",
  databaseURL: "https://gorev-takip-projesi-default-rtdb.firebaseio.com",
  projectId: "gorev-takip-projesi",
  storageBucket: "gorev-takip-projesi.firebasestorage.app",
  messagingSenderId: "219256387155",
  appId: "1:219256387155:web:6f3d45ec9690f47f8778a6"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ]
};
