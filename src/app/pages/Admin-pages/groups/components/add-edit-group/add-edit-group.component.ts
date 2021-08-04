import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { AddressBook } from 'src/services/models/addressBook';
import { Course } from 'src/services/models/course';
import { Faculty } from 'src/services/models/faculty';
import { Group } from 'src/services/models/group';
import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss']
})
export class AddEditGroupComponent implements OnInit, OnDestroy {
  courseList: string[] = [];
  courseListSubscription!: Subscription;
  groupControl = new FormControl('', Validators.required);
  facultyList: Faculty[] = [];
  facultyListSubscription!: Subscription;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newGroup!: Group;
  checkedList: any;
  currentSelected!: {};
  address: AddressBook = {
    City:"",
    Street: "",
    ZipCode: 0
  };
  editGroup:Group = {
    Id: "",
  };
  @Input()
    public group: Group = {
      Id: "",    
    };

  @Input()
    public groupList!: Group[];

    @ViewChild('form') form!: any;

  constructor(
    private groupService: GroupService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private courseService: CourseService,
    private facultyService: FacultyService,

  ) { }

  ngOnInit() {
    this.editGroup={
      Id:this.group.Id,
      GroupNumber:this.group.GroupNumber,
      AcademicYear:this.group.AcademicYear,
      Fac_Name:this.group.Fac_Name,
      NumberOfStudent:this.group.NumberOfStudent,
      Semester:this.group.Semester,
      courses:this.group.courses,
      Status:true,
    }
    this.getFaculties();
    //this.getCourses();
    this.isAddMode = !this.group.Id;
    if(!this.isAddMode)
      this.choosenFaculty(this.editGroup.Fac_Name);
}

onSubmit() {
  this.loading = true;
  if(this.form.valid)
  {
    this.submitted = true;
    if (this.isAddMode) this.createGroup();
    else this.updateGroup();
  }
  else {
    this.alertService.errorFormField();
    this.loading = false;
  }
}

private getCoursesByFaculty(facultyName:string){
  this.courseListSubscription = timer(0).pipe(switchMap(()=> this.courseService.getCoursesByFaculty(facultyName))).subscribe((list: string[])=>
  {
    this.courseList = list;
  });
}
private getFaculties(){
  this.facultyListSubscription = timer(0).pipe(switchMap(()=> this.facultyService.getAllFaculties())).subscribe((list: Faculty[])=>
  {
    this.facultyList = list;
  });
}


private createGroup() {
  this.group=this.editGroup;
    this.groupService.create(this.group)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.groupList.push(result);
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.groupList);
        }  
        else
            this.alertService.errorResponseFromDataBase();
    })
    .add(() => this.loading = false);
}

private updateGroup() {
      this.groupService.update(this.editGroup)
      .pipe(first()).subscribe(result => {
          if(result)
          {
            this.group=this.editGroup;
            let x = this.groupList.find(x => x.Id === this.group.Id)
            let index = this.groupList.indexOf(x!)
            this.groupList[index] = this.group;
            this.alertService.successResponseFromDataBase();
            this.activeModal.close(this.groupList);
          }
          else
              this.alertService.errorResponseFromDataBase();
      })
      .add(() => this.loading = false);
  }

  choosenFaculty(event: string)
  {
    this.editGroup.Fac_Name = event;
    this.getCoursesByFaculty(this.editGroup.Fac_Name);

  }
  choosenCourse(event: string[])
  {
    this.editGroup.courses = event;
    console.log(this.group.courses);
  }
  ngOnDestroy(){
    if(this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
    if(this.facultyListSubscription)
      this.facultyListSubscription.unsubscribe();
  }

}