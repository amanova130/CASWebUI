import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../Core/material-module/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AddEditTeacherComponent } from './teachers/components/add-edit-teacher/add-edit-teacher.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ExamsComponent } from './exams/exams.component';
import { GroupsComponent } from './groups/groups.component';
import { HolidayComponent } from './holiday/holiday.component';
import { LinksComponent } from './links/links.component';
import { ReportsComponent } from './reports/reports.component';
import { RequestsComponent } from './requests/requests.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { CoursesComponent } from './courses/courses.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




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
    ReactiveFormsModule,
    AngularMaterialModule,

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
export class PagesModule { }
