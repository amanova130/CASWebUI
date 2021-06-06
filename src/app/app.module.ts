import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from './Core/core.module';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from './Core/material-module/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentsModule } from './pages/Admin-pages/students/students.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AdminPageModule } from './pages/Admin-pages/admin-page.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
  ],
  imports: [
    StudentsModule,
    BrowserModule,
    CoreModule,
    AdminPageModule,
    HttpClientModule,
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule, 
    NgbModalModule,
    BrowserAnimationsModule,
    StudentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
