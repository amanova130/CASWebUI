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
      { path: 'dashboard', component: DashboardComponent},
      { path: 'students',  component: StudentsComponent },
      { path: 'teachers',  component: TeachersComponent },
      { path: 'time-table',  component: TimeTableComponent },
      { path: 'courses',  component: CoursesComponent },
{ path: 'faculties',  component: FacultiesComponent },
{ path: 'exams',  component: ExamsComponent },
{ path: 'holiday',  component: HolidayComponent },
{ path: 'links',  component: LinksComponent },
{ path: 'reports',  component: ReportsComponent },
{ path: 'requests',  component: RequestsComponent },
{ path: 'email',  component: EmailComponent },
{ path: 'groups',  component: GroupsComponent },
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
