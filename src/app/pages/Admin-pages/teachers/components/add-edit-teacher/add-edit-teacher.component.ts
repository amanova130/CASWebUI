import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Teacher } from 'src/services/models/teacher';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { AddressBook } from 'src/services/models/addressBook';

@Component({
  selector: 'app-add-edit-teacher',
  templateUrl: './add-edit-teacher.component.html',
  styleUrls: ['./add-edit-teacher.component.scss']
})
export class AddEditTeacherComponent implements OnInit {
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
  ) {}

  ngOnInit() {
    this.editTeacher={
      Id:this.teacher.Id,
      First_name:this.teacher.First_name,
      Last_name:this.teacher.Last_name,
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
            this.teacherList.push(result);
              this.alertService.openAlertMsg('success','Added new Teacher profile');
              this.activeModal.close();
          }  
          else
              this.alertService.openAlertMsg('error','Cannot add a new Teacher');
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
                this.alertService.openAlertMsg('success', 'Record was updated')
                this.activeModal.close();
            }
            else
                this.alertService.openAlertMsg('error','Cannot Update a teacher data, please try again');
        })
        .add(() => this.loading = false);
    }



  choosenCourse(event: string[])
  {
    this.editTeacher.TeachesCourses = event;
    console.log(this.teacher.TeachesCourses);
  }

}


