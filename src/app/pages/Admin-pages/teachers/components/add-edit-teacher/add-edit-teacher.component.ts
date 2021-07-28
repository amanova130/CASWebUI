import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Teacher } from 'src/services/models/teacher';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { AddressBook } from 'src/services/models/addressBook';
import { UploadFileService } from '../../../../../../services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-add-edit-teacher',
  templateUrl: './add-edit-teacher.component.html',
  styleUrls: ['./add-edit-teacher.component.scss']
})
export class AddEditTeacherComponent implements OnInit, OnDestroy {
  courseList: Course[] = [];
  courseListSubscription!: Subscription;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newTeacher!: Teacher;
  
  checkedList: any;
  currentSelected!: {};
  newCourseList: Course[] = [];
  address: AddressBook = {
    City:"",
    Street: "",
    ZipCode: 0
  };
  editTeacher:Teacher = {
    Id: "",
    Address: this.address,
  };
  @Input()
    public teacher: Teacher = {
      Id: "",
      Address: this.address,
      
    };

  @Input()
    public teacherList!: Teacher[];

  @ViewChild('form') form!: any;
  
  constructor(
      private teacherService: TeacherService,
      private alertService: AlertService,
      public activeModal: NgbActiveModal,
      private courseService: CourseService,
      private uploadFileService: UploadFileService,
  ) {}

  ngOnInit() {
    this.editTeacher={
      Id:this.teacher.Id,
      First_name:this.teacher.First_name,
      Last_name:this.teacher.Last_name,
      Image: this.teacher.Image,
      Phone:this.teacher.Phone,
      Email:this.teacher.Email,
      Gender:this.teacher.Gender,
      Birth_date:this.teacher.Birth_date,
      TeachesCourses:this.teacher.TeachesCourses,
      Address:this.teacher.Address,
      Status:true,
    }
      this.getCourses();
      this.isAddMode = !this.teacher.Id;
     if(!this.isAddMode){
       this.address={
         City: this.teacher.Address.City,
         Street:this.teacher.Address.Street,
         ZipCode: this.teacher.Address.ZipCode
       }
     }
  }


  onSubmit() {
      this.loading = true;
      if(this.form.valid)
      {
        this.submitted = true;
        if (this.isAddMode) this.createTeacher();
        else this.updateTeacher();
      }
      else {
        this.alertService.errorFormField();
        this.loading = false;
      }
    
  }

  private getCourses(){
    this.courseListSubscription = timer(0).pipe(switchMap(()=> this.courseService.getAllCourses())).subscribe((list: Course[])=>
    {
      this.courseList = list;
     // console.log(this.courseList);

    });
  }

  private createTeacher() {
    this.teacher=this.editTeacher;
    this.teacher.Address = this.address;
      this.teacherService.create(this.teacher)
      .pipe(first())
      .subscribe(result => {
          if(result)
          { 
              this.teacherList.push(result)
              this.activeModal.close(this.teacherList);
              this.alertService.successResponseFromDataBase();
          }  
          else
              this.alertService.errorResponseFromDataBase();
      })
      .add(() => this.loading = false);
}

  private updateTeacher() {

    this.editTeacher.Address = this.address;
        this.teacherService.update(this.editTeacher)
        .pipe(first()).subscribe((result) => {
            if(result)
            {
              this.teacher=this.editTeacher;
              let x = this.teacherList.find(x => x.Id === this.teacher.Id)
              let index = this.teacherList.indexOf(x!)
              this.teacherList[index] = this.teacher;
              this.activeModal.close(this.teacherList);
              this.alertService.successResponseFromDataBase();
            }
            else
                this.alertService.errorResponseFromDataBase();
        })
        .add(() => this.loading = false);
    }

    public uploadFile = (files: any) => {
      if (files.length === 0) {
        return;
      }
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      this.uploadFileService.uploadImage(formData).pipe(first())
      .subscribe(result => {
        if(result)
        this.editTeacher.Image=Object.values(result).toString();
      });
    }

  choosenCourse(event: string[])
  {
    this.editTeacher.TeachesCourses = event;
    console.log(this.teacher.TeachesCourses);
  }

  ngOnDestroy(){
    if(this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
  }

}


