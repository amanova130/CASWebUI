import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './Core/components/forgot-pass/forgot-pass.component';
import { LoginComponent } from './Core/components/login/login.component';
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { DashboardModule } from './pages/Admin-pages/dashboard/dashboard.module';
import { StudentsComponent } from './pages/Admin-pages/students/students.component';
import { TimeTableComponent } from './pages/Admin-pages/time-table/time-table.component';
import { TeachersComponent } from './pages/teachers/teachers.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => DashboardModule},
      { path: 'students',  component: StudentsComponent },
      { path: 'teachers',  component: TeachersComponent },
      { path: 'time-table',  component: TimeTableComponent },


      // { path: 'account-settings', loadChildren: '../account-settings/account-settings.module#AccountSettingsModule' },
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
