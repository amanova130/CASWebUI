import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { CoursesComponent } from '../../shared/components/courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailComponent } from './email/email.component';
import { ExamsComponent } from './exams/exams.component';
import { FacultiesComponent } from './faculty/faculties.component';
import { GroupsComponent } from './groups/groups.component';
import { LinksComponent } from '../../shared/components/links/links.component';
import { ReportsComponent } from './reports/reports.component';
import { RequestsComponent } from './requests/requests.component';
import { StudentsComponent } from './students/students.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { HolidayComponent } from 'src/app/shared/components/holiday/holiday.component';
import { StaffComponent } from './staff/staff.component';


const routes: Routes = [
{   path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
},
{
    path:'',
    component: AdminPageComponent,
    children: [
        { path: 'dashboard', component: DashboardComponent},
        { path: 'students',  component: StudentsComponent },
        { path: 'teachers',  component: TeachersComponent },
        { path: 'time-table',  component: TimeTableComponent },
        { path: 'groups',  component: GroupsComponent },
        { path: 'courses',  component: CoursesComponent },
        { path: 'faculties',  component: FacultiesComponent },
        { path: 'exams',  component: ExamsComponent },
        { path: 'holiday',  component: HolidayComponent },
        { path: 'links',  component: LinksComponent },
        { path: 'reports',  component: ReportsComponent },
        { path: 'requests',  component: RequestsComponent },
        { path: 'email',  component: EmailComponent },
        { path: 'staff',  component: StaffComponent },


    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }