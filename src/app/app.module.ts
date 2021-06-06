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
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesModule } from './pages/pages.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentsModule } from './pages/students/students.module';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PagesModule,
    HttpClientModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatTableModule,
    BrowserAnimationsModule,
    StudentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
