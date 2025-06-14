import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // Guard'ı import et

export const routes: Routes = [
  // Kök path'e gelindiğinde doğrudan /login'e yönlendir
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // /login path'i ve alt path'leri için AuthModule'u yükle
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // /tasks path'i, sadece giriş yapan kullanıcılar tarafından erişilebilir
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard]
  },

  // /profile path'i, sadece giriş yapan kullanıcılar tarafından erişilebilir
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
