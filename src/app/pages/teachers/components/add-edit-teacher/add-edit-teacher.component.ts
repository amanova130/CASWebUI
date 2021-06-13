import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Teacher } from 'src/services/models/teacher';
import { TeacherService } from 'src/services/WebApi/teacher.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherUtils } from 'src/services/utils/teacherUtils';
import { Subscription, timer } from 'rxjs';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApi/course.service';
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
      this.getCourses();
      console.log(this.teacher);
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
      
      this.alertService.clear();
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
    this.teacher.Address = this.address;
      this.teacherService.create(this.teacher)
      .pipe(first())
      .subscribe(result => {
          if(result)
          {
            this.teacherList.push(result);
              this.alertService.success('Added new Teacher profile', { keepAfterRouteChange: true });
              this.activeModal.close();
          }  
          else
              this.alertService.error('Cannot add a new Teacher');
      })
      .add(() => this.loading = false);
}

  private updateTeacher() {
    this.teacher.Address = this.address;
        this.teacherService.update(this.teacher.Id, this.teacher)
        .pipe(first()).subscribe(result => {
            if(result)
            {
              let x = this.teacherList.find(x => x.Id === this.teacher.Id)
              let index = this.teacherList.indexOf(x!)
              this.teacherList[index] = this.teacher;
                this.alertService.success('Teacher data updated', { keepAfterRouteChange: true });
                this.activeModal.close();
            }
            else
                this.alertService.error('Cannot Update a teacher data, please try again');
        })
        .add(() => this.loading = false);
    }



  choosenCourse(event: string[])
  {
    this.teacher.TeachesCourses = event;
    console.log(this.teacher.TeachesCourses);
  }

}


