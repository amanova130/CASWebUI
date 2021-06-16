import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherUtils } from 'src/services/utils/teacherUtils';
import { Subscription, timer } from 'rxjs';
import { AddressBook } from 'src/services/models/addressBook';
import { Student } from 'src/services/models/student';
import { StudentService } from 'src/services/WebApi/student.service';
import { User } from 'src/services/models/user';
import { Group } from 'src/services/models/group';
import { GroupService } from 'src/services/WebApi/group.service';
@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit {
  groupControl = new FormControl('', Validators.required);
  groupList: Group[] = [];
  groupListSubscription!: Subscription;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newStudent!: Student;
  checkedList: any;
  currentSelected!: {};
  address: AddressBook = {
    City:"",
    Street: "",
    ZipCode: 0
  };
  user:User={
    UserName:"",
    Password:"",
    LogIn:new Date(),
    LogOff:new Date()
  }
  
  @Input()
    public student: Student = {
      Id: "",
      Address: this.address,
      PersonalUser:this.user,
      
    };

  @Input()
    public studentList!: Student[];

    @ViewChild('form') form!: any;

  constructor(
    private studentService: StudentService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private groupService: GroupService,

  ) { }

  ngOnInit() {
    this.getGroups();
    console.log(this.groupList);
    console.log(this.student);
    this.isAddMode = !this.student.Id;
   if(!this.isAddMode){
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
   }
}

onSubmit() {
      
  this.alertService.clear();
  this.loading = true;
  if(this.form.valid)
  {
    this.submitted = true;
    if (this.isAddMode) this.createStudent();
    else this.updateStudent();
  }
  else {
    this.loading = false;
  }

 
}


private getGroups(){
  this.groupListSubscription = timer(0).pipe(switchMap(()=> this.groupService.getAllGroups())).subscribe((list: Group[])=>
  {
    this.groupList = list;
    console.log(this.groupList);
  });
}


private createStudent() {
  this.student.Address = this.address;
  this.student.PersonalUser=this.user;
    this.studentService.create(this.student)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.studentList.push(result);
            this.alertService.success('Added new Student profile', { keepAfterRouteChange: true });
            this.activeModal.close();
        }  
        else
            this.alertService.error('Cannot add a new Student');
    })
    .add(() => this.loading = false);
}

private updateStudent() {
  this.student.Address = this.address;
  this.student.PersonalUser=this.user;
      this.studentService.update(this.student)
      .pipe(first()).subscribe(result => {
          if(result)
          {
            let x = this.studentList.find(x => x.Id === this.student.Id)
            let index = this.studentList.indexOf(x!)
            this.studentList[index] = this.student;
              this.alertService.success('Student data updated', { keepAfterRouteChange: true });
              this.activeModal.close();
          }
          else
              this.alertService.error('Cannot Update a student data, please try again');
      })
      .add(() => this.loading = false);
  }

  choosenGroup(event: string)
  {
    this.student.Group_Id = event;
    //console.log(this.student.TeachesCourses);
  }

}
