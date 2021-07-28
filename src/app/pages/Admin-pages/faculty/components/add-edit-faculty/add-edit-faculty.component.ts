import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';

import { Course } from 'src/services/models/course';
import { Faculty } from 'src/services/models/faculty';

import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';


@Component({
  selector: 'app-add-edit-faculty',
  templateUrl: './add-edit-faculty.component.html',
  styleUrls: ['./add-edit-faculty.component.scss']
})
export class AddEditFacultyComponent implements OnInit {
  courseList: Course[] = [];
  courseListSubscription!: Subscription;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newFaculty!: Faculty;
  checkedList: any;
  currentSelected!: {};
  newCourseList: Course[] = [];
  editFaculty:Faculty = {
    Id: "",
  };
  
  @Input()
    public faculty: Faculty;

  @Input()
    public facultyList!: Faculty[];

  @ViewChild('form') form!: any;
  
  constructor(
      private facultyService: FacultyService,
      private alertService: AlertService,
      public activeModal: NgbActiveModal,
      private courseService: CourseService,
  ) {}

  ngOnInit() {
    this.editFaculty={
      Id:this.faculty.Id,
      FacultyName:this.faculty.FacultyName,
      Description:this.faculty.Description,
      Courses:this.faculty.Courses,
      Status:true
    
    }
      this.getCourses();
      this.isAddMode = !this.faculty.Id;
  }


  onSubmit() {
      this.loading = true;
      if(this.form.valid)
      {
        this.submitted = true;
        if (this.isAddMode) this.createFaculty();
        else this.updateFaculty();
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

  private createFaculty() {
    this.faculty=this.editFaculty;
      this.facultyService.create(this.faculty)
      .pipe(first())
      .subscribe(result => {
          if(result)
          {
            this.facultyList.push(result);
              this.alertService.openAlertMsg('success','Added new Faculty profile');
              this.activeModal.close();
          }  
          else
              this.alertService.openAlertMsg('success','Cannot add a new Faculty');
      })
      .add(() => this.loading = false);
}

  private updateFaculty() {
        this.facultyService.update(this.editFaculty)
        .pipe(first()).subscribe((result) => {
            if(result)
            {
              this.faculty=this.editFaculty;
              let x = this.facultyList.find(x => x.Id === this.faculty.Id)
              let index = this.facultyList.indexOf(x!)
              this.facultyList[index] = this.faculty;
                this.alertService.openAlertMsg('success','Faculty data updated');
                this.activeModal.close();
            }
            else
                this.alertService.openAlertMsg('error','Cannot Update a Faculty data, please try again');
        })
        .add(() => this.loading = false);
    }



  choosenCourse(event: string[])
  {
    this.editFaculty.Courses = event;
  }

}



