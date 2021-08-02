import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LinksComponent } from "./components/links/links.component";
import { AddEditLinksComponent } from './components/links/add-edit-links/add-edit-links.component';
import { AngularMaterialModule } from "../Core/material-module/angular-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CoursesComponent } from "./components/courses/courses.component";
import { AddEditCourseComponent } from 'src/app/shared/components/courses/add-edit-course/add-edit-course.component';
import { SafePipe } from "./pipes/safe.pipe";
import { UploadExcelModalComponent } from './components/upload-excel-modal/upload-excel-modal.component';
import { HolidayComponent } from "./components/holiday/holiday.component";
import { AddEditHolidayComponent } from "./components/holiday/components/add-edit-holiday/add-edit-holiday.component";
import { CarouselModule } from "primeng/carousel";
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    LinksComponent, 
    AddEditLinksComponent,
    CoursesComponent,
    AddEditCourseComponent,
    SafePipe,
    UploadExcelModalComponent,
    HolidayComponent,
    AddEditHolidayComponent,
],
  imports: 
  [CommonModule,
    AngularMaterialModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
    CarouselModule,
    ButtonModule,
],
  exports: [
    LinksComponent,
    AddEditLinksComponent,
    CoursesComponent,
    AddEditCourseComponent,
    UploadExcelModalComponent,
    HolidayComponent,
    AddEditHolidayComponent,
]
})
export class SharedModule {}