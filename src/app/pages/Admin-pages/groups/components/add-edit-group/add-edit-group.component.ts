import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { AddressBook } from 'src/services/models/addressBook';
import { Course } from 'src/services/models/course';
import { Faculty } from 'src/services/models/faculty';
import { Group } from 'src/services/models/group';
import { CourseService } from 'src/services/WebApi/course.service';
import { FacultyService } from 'src/services/WebApi/faculty.service';
import { GroupService } from 'src/services/WebApi/group.service';

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss']
})
export class AddEditGroupComponent implements OnInit {
  courseList: Course[] = [];
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
  /*user:User={
    UserName:"",
    Password:"",
    LogIn:new Date(),
    LogOff:new Date()
  }*/
  
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

   // private groupService: GroupService,

  ) { }

  ngOnInit() {

    this.getFaculties();
    this.getCourses();
    console.log(this.groupList);
    console.log(this.group);
    this.isAddMode = !this.group.Id;
  /* if(!this.isAddMode){
     this.address={
       City: this.student.Address.City,
       Street:this.student.Address.Street,
       ZipCode: this.student.Address.ZipCode
     }
     this.user={
       UserName:this.student.PersonalUser.UserName,
       Password:this.student.PersonalUser.Password,
       LogIn:this.student.PersonalUser.LogIn,
       LogOff:this.student.PersonalUser.LogOff 
     }
   }*/
}

onSubmit() {
      
  this.alertService.clear();
  this.loading = true;
  if(this.form.valid)
  {
    this.submitted = true;
    if (this.isAddMode) this.createGroup();
    else this.updateGroup();
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
private getFaculties(){
  this.facultyListSubscription = timer(0).pipe(switchMap(()=> this.facultyService.getAllFaculties())).subscribe((list: Faculty[])=>
  {
    this.facultyList = list;
    console.log(this.facultyList);
  });
}


private createGroup() {
  //this.student.Address = this.address;
  //this.student.PersonalUser=this.user;
    this.groupService.create(this.group)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.groupList.push(result);
            this.alertService.success('Added new Group profile', { keepAfterRouteChange: true });
            this.activeModal.close();
        }  
        else
            this.alertService.error('Cannot add a new Group');
    })
    .add(() => this.loading = false);
}

private updateGroup() {
 // this.student.Address = this.address;
 // this.student.PersonalUser=this.user;
      this.groupService.update(this.group)
      .pipe(first()).subscribe(result => {
          if(result)
          {
            let x = this.groupList.find(x => x.Id === this.group.Id)
            let index = this.groupList.indexOf(x!)
            this.groupList[index] = this.group;
              this.alertService.success('Group data updated', { keepAfterRouteChange: true });
              this.activeModal.close();
          }
          else
              this.alertService.error('Cannot Update a student data, please try again');
      })
      .add(() => this.loading = false);
  }

  choosenFaculty(event: string)
  {
    this.group.Fac_Name = event;
    //console.log(this.student.TeachesCourses);
  }
  choosenCourse(event: string[])
  {
    this.group.courses = event;
    console.log(this.group.courses);
  }

}
