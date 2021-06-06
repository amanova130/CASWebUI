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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentsModule } from './pages/Admin-pages/students/students.module';

import { AdminPageModule } from './pages/Admin-pages/admin-page.module';


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
