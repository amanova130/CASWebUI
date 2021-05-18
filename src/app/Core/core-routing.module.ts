import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { StudentsComponent } from '../pages/students/students.component';
import { StudentsModule } from '../pages/students/students.module';
import { TeachersComponent } from '../pages/teachers/teachers.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';


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
      // { path: 'account-settings', loadChildren: '../account-settings/account-settings.module#AccountSettingsModule' },
    ]
  },
  // {
  //   path: '',
  //   component: FooterOnlyLayoutComponent,
  //   children: [
  //     { path: 'login', loadChildren: '../login/login.module#LoginModule' },
  //     { path: 'registration', loadChildren: '../registration/registration.module#RegistrationModule' }
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
