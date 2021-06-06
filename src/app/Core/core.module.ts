import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavBarComponent } from './components/side-nav-bar/side-nav-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './material-module/angular-material.module';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';




@NgModule({
  declarations: [
    HeaderComponent,
    SideNavBarComponent,
    LoginComponent,
    ForgotPassComponent,
    AlertComponent,
  ],
  imports: [
    MatIconModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    SideNavBarComponent,
    LoginComponent,
    ForgotPassComponent,
    AlertComponent,
  ]
})
export class CoreModule { }
