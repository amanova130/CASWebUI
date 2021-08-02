import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from './Core/material-module/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './Core/components/main-layout/main-layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CommonModule, DatePipe } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './Core/components/login/login.component';
import { HeaderComponent } from './Core/components/header/header.component';
import { ForgotPassComponent } from './Core/components/forgot-pass/forgot-pass.component';
import { SideNavBarComponent } from './Core/components/side-nav-bar/side-nav-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { ViewMailComponent } from './pages/Admin-pages/email/components/view-mail/view-mail.component';
import { NgSelectModule } from '@ng-select/ng-select';



import { SafePipe } from './shared/pipes/safe.pipe';
import { AddEditStaffComponent } from './pages/Admin-pages/staff/components/add-edit-staff/add-edit-staff.component';



@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent, 
    HeaderComponent,
    SideNavBarComponent,
    LoginComponent,
    ForgotPassComponent,
    AddEditStaffComponent,
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule, 
    NgbModalModule,
    BrowserAnimationsModule,

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
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }