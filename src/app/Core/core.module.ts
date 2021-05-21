import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavBarComponent } from './components/side-nav-bar/side-nav-bar.component';
import { CoreRoutingModule } from './core-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './material-module/angular-material.module';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SideNavBarComponent,
    LoginComponent,
    ForgotPassComponent,
  ],
  imports: [
  MatIconModule,
    FlexLayoutModule,
    CommonModule,
    CoreRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  exports: []
})
export class CoreModule { }
