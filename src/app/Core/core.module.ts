import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavBarComponent } from './components/side-nav-bar/side-nav-bar.component';
import { CoreRoutingModule } from './core-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SideNavBarComponent,
  ],
  imports: [
  MatIconModule,
    FlexLayoutModule,
    CommonModule,
    CoreRoutingModule,
  ],
  exports: []
})
export class CoreModule { }
