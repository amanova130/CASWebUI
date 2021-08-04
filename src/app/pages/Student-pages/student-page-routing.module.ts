import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { StudentPageComponent } from './student-page.component';
import { CoursesComponent } from '../../shared/components/courses/courses.component';
import { TimeTableViewComponent } from './time-table-view/time-table-view.component';
import { HolidayComponent } from 'src/app/shared/components/holiday/holiday.component';
import { ExamGradesComponent } from './exam-grades/exam-grades.component';
import { LinksComponent } from 'src/app/shared/components/links/links.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RequestsComponent } from 'src/app/shared/components/requests/requests.component';

const routes: Routes = [
  {   path: '',
      redirectTo: 'student-dashboard',
      pathMatch: 'full'
  },
  {
      path:'',
      component: StudentPageComponent,
      children: [
          { path: 'student-dashboard', component: StudentDashboardComponent},
          { path: 'courses',  component: CoursesComponent },
          { path: 'exam-grades',  component: ExamGradesComponent },
          { path: 'time-table-view',  component: TimeTableViewComponent },
          { path: 'holiday',  component: HolidayComponent },
          { path: 'links',  component: LinksComponent },
          { path: 'contacts',  component: ContactsComponent },
          { path: 'requests',  component: RequestsComponent },,
      ]
  },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class StudentPageRoutingModule { }
