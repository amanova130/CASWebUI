import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPageRoutingModule } from './student-page-routing.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ExamGradesComponent } from './exam-grades/exam-grades.component';
import { TimeTableViewComponent } from './time-table-view/time-table-view.component';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from 'src/app/Core/material-module/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { StudentPageComponent } from './student-page.component';
import { RandomColorPipe } from 'src/app/shared/pipes-and-enum/randomColor.pipe';
import { AverageComponent } from './exam-grades/components/average/average.component';
import { ExamViewTabComponent } from './exam-grades/components/exam-view-tab/exam-view-tab.component';
import { ProgressComponent } from './student-dashboard/progress/progress.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    StudentDashboardComponent,
    ContactsComponent,
    ExamGradesComponent,
    TimeTableViewComponent,
    StudentPageComponent,
    RandomColorPipe,
    AverageComponent,
    ExamViewTabComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    StudentPageRoutingModule,
    SharedModule, 
    AngularMaterialModule,
    MatIconModule,
    FlexLayoutModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NgSelectModule,
    StudentPageRoutingModule,
    NgxChartsModule,
    CarouselModule,
  ],

  exports: [
    StudentDashboardComponent,
    ContactsComponent,
    ExamGradesComponent,
    TimeTableViewComponent,
    AverageComponent,
    ExamViewTabComponent,
    ProgressComponent
  ],
})
export class StudentPageModule { }
