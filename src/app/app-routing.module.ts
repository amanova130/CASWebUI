import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './Core/components/forgot-pass/forgot-pass.component';
import { LoginComponent } from './Core/components/login/login.component';
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { CoursesComponent } from './pages/Admin-pages/courses/courses.component';
import { DashboardComponent } from './pages/Admin-pages/dashboard/dashboard.component';
import { EmailComponent } from './pages/Admin-pages/email/email.component';
import { ExamsComponent } from './pages/Admin-pages/exams/exams.component';
import { FacultiesComponent } from './pages/Admin-pages/faculty/faculties.component';
import { GroupsComponent } from './pages/Admin-pages/groups/groups.component';
import { HolidayComponent } from './pages/Admin-pages/holiday/holiday.component';
import { LinksComponent } from './pages/Admin-pages/links/links.component';
import { ReportsComponent } from './pages/Admin-pages/reports/reports.component';
import { RequestsComponent } from './pages/Admin-pages/requests/requests.component';
import { StudentsComponent } from './pages/Admin-pages/students/students.component';
import { TimeTableComponent } from './pages/Admin-pages/time-table/time-table.component';
import { TeachersComponent } from './pages/Admin-pages/teachers/teachers.component';


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
        loadChildren: () => import('./pages/Admin-pages/admin-page.module').then(m => m.AdminPageModule)
      },
      // {
      //   path: 'student',
      //   loadChildren: () => import('./pages/Student-pages/student-page.module').then(m => m.StudentPageModule)

      // }

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
