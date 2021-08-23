import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddEditTeacherComponent } from './teachers/components/add-edit-teacher/add-edit-teacher.component';
import { TeachersComponent } from './teachers/teachers.component';
import { ExamsComponent } from './exams/exams.component';
import { GroupsComponent } from './groups/groups.component';
import { ReportsComponent } from './reports/reports.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { AngularMaterialModule } from 'src/app/Core/material-module/angular-material.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AddEditStudentComponent } from './students/components/add-edit-student/add-edit-student.component';
import { EventModalComponent } from './time-table/components/event-modal/event-modal.component';
import { StudentsComponent } from './students/students.component';
import { EmailComponent } from './email/email.component';
import { FacultiesComponent } from './faculty/faculties.component';
import { AddEditFacultyComponent } from './faculty/components/add-edit-faculty/add-edit-faculty.component';
import { AddEditGroupComponent } from './groups/components/add-edit-group/add-edit-group.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { AdminPageRoutingModule } from './admin-page-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { InboxComponent } from './email/components/inbox/inbox.component';
import { SentComponent } from './email/components/sent/sent.component';
import { ViewMailComponent } from './email/components/view-mail/view-mail.component';
import { ComposeComponent } from './email/components/compose/compose.component';
import { AddEditExamComponent } from './exams/components/add-edit-exam/add-edit-exam.component';
import { GradesComponent } from './grades/grades.component';
import { TrashComponent } from './email/components/trash/trash.component';

@NgModule({
  declarations: [
    GroupsComponent,
    ExamsComponent,
    ReportsComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    TimeTableComponent,
    EventModalComponent,
    AddEditStudentComponent,
    StudentsComponent,
    EmailComponent,
    FacultiesComponent,
    AddEditFacultyComponent,
    AddEditGroupComponent,
    DashboardComponent,
    AdminPageComponent,
    ComposeComponent,
    InboxComponent,
    SentComponent,
    ViewMailComponent,
    AddEditExamComponent,
    GradesComponent,
    TrashComponent,  
  ],
  imports: [
    AngularMaterialModule,
    FlexLayoutModule,
    RouterModule,
    CommonModule,
    AdminPageRoutingModule,
    SharedModule, 
    NgxChartsModule,
    FlatpickrModule.forRoot(
      ),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    GroupsComponent,
    TimeTableComponent,
    ExamsComponent,
    ReportsComponent,
    TimeTableComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    AddEditStudentComponent,  
    FacultiesComponent,
    AddEditFacultyComponent,
    AddEditGroupComponent,
    DashboardComponent,
    EmailComponent,
    ComposeComponent,
    InboxComponent,
    SentComponent,
    ViewMailComponent,
    GradesComponent,
    AddEditExamComponent,
    TrashComponent
  ]
})
export class AdminPageModule { }