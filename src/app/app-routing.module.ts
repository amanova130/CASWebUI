// Angular routing Module between Admin and Student pages
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './Core/components/forgot-pass/forgot-pass.component';
import { LoginComponent } from './Core/components/login/login.component';
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { AutenticationGuard } from './shared/helperServices/autentication.guard';
import { Role } from './shared/pipes-and-enum/roleEnum';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'secure',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./pages/Admin-pages/admin-page.module').then(m => m.AdminPageModule), canActivate: [AutenticationGuard], data: { roles: [Role.Admin] }
      },
      {
        path: 'student',
        loadChildren: () => import('./pages/Student-pages/student-page.module').then(m => m.StudentPageModule), canActivate: [AutenticationGuard], data: { roles: [Role.Student] }
      }

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
