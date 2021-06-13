import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule, FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentsComponent } from './departments/departments.component';
import { AddEditTeacherComponent } from '../teachers/components/add-edit-teacher/add-edit-teacher.component';
import { TeachersComponent } from '../teachers/teachers.component';
import { CoursesComponent } from './courses/courses.component';
import { ExamsComponent } from './exams/exams.component';
import { GroupsComponent } from './groups/groups.component';
import { HolidayComponent } from './holiday/holiday.component';
import { LinksComponent } from './links/links.component';
import { ReportsComponent } from './reports/reports.component';
import { RequestsComponent } from './requests/requests.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { AngularMaterialModule } from 'src/app/Core/material-module/angular-material.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    DepartmentsComponent,
    GroupsComponent,
    HolidayComponent,
    TimeTableComponent,
    ExamsComponent,
    ReportsComponent,
    LinksComponent,
    RequestsComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    CoursesComponent,
  ],
  imports: [
    MatIconModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule, 
    NgbModalModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CoreModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    DepartmentsComponent,
    GroupsComponent,
    HolidayComponent,
    TimeTableComponent,
    ExamsComponent,
    ReportsComponent,
    LinksComponent,
    RequestsComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    CoursesComponent,
  ]
})
export class AdminPageModule { }