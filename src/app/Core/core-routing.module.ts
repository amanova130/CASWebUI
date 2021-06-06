import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { GroupsComponent } from '../pages/groups/groups.component';
import { StudentsComponent } from '../pages/students/students.component';
import { TeachersComponent } from '../pages/teachers/teachers.component';
import { TimeTableComponent } from '../pages/time-table/time-table.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { LoginComponent } from './components/login/login.component';
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
      { path: 'time-table',  component: TimeTableComponent },
      { path: 'groups',  component: GroupsComponent },



      // { path: 'account-settings', loadChildren: '../account-settings/account-settings.module#AccountSettingsModule' },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }