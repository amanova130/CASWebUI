import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from './Core/core.module';
import { CoursesComponent } from './pages/courses/courses/courses.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { HolidayComponent } from './pages/holiday/holiday.component';
import { TimeTableComponent } from './pages/time-table/time-table.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { LinksComponent } from './pages/links/links.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from './Core/material-module/angular-material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    DepartmentsComponent,
    GroupsComponent,
    HolidayComponent,
    TimeTableComponent,
    ExamsComponent,
    ReportsComponent,
    LinksComponent,
    RequestsComponent,
    TeachersComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatTableModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
