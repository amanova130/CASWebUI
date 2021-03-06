import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { AddressBook } from 'src/services/models/addressBook';
import { Student } from 'src/services/models/student';
import { StudentService } from 'src/services/WebApiService/student.service';
import { User } from 'src/services/models/user';
import { Group } from 'src/services/models/group';
import { GroupService } from 'src/services/WebApiService/group.service';
import { UploadFileService } from '../../../../../../services/WebApiService/uploadFile.service';
@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit, OnDestroy {
  groupControl = new FormControl('', [Validators.required,Validators.maxLength(9),Validators.minLength(9),Validators.pattern("^[0-9]*$")]);
  groupList: Group[] = [];
  groupListSubscription!: Subscription;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newStudent!: Student;
  checkedList: any;
  currentSelected!: {};
  address: AddressBook = {
    City: "",
    Street: "",
    ZipCode: 0
  };
  user: User = {
    UserName: "",
    Password: "",
    LogIn: new Date(),
    LogOff: new Date()
  }
  editStudent: Student = {
    Id: "",
    Address: this.address,
  };
  @Input()
  public student: Student = {
    Id: "",
    Address: this.address,
  };
  @Input()
  public studentList!: Student[];
  @ViewChild('form') form!: any;

  constructor(
    private studentService: StudentService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private groupService: GroupService,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit() {
    this.editStudent = {
      Id: this.student.Id,
      First_name: this.student.First_name,
      Last_name: this.student.Last_name,
      Image: this.student.Image,
      Phone: this.student.Phone,
      Email: this.student.Email,
      Gender: this.student.Gender,
      Birth_date: this.student.Birth_date,
      Group_Id: this.student.Group_Id,
      Address: this.student.Address,
      Status: true,
    }
    this.getGroups();
    this.isAddMode = !this.student.Id;
    if (!this.isAddMode) {
      this.address = {
        City: this.student.Address.City,
        Street: this.student.Address.Street,
        ZipCode: this.student.Address.ZipCode
      }
    }
  }
// Submit Form
  onSubmit() {
    this.loading = true;
    if (this.form.valid) {
      this.submitted = true;
      if (this.isAddMode) this.createStudent();
      else this.updateStudent();
    }
    else {
      this.alertService.errorFormField();
      this.loading = false;
    }
  }

// Get Group list for selection box
  private getGroups() {
    this.groupListSubscription = timer(0).pipe(switchMap(() => this.groupService.getAllGroups())).subscribe((list: Group[]) => {
      this.groupList = list;
    });
  }
// Upload image to backend
  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.uploadFileService.uploadImage(formData).pipe(first())
      .subscribe(result => {
        if (result)
          this.editStudent.Image = Object.values(result).toString();
      });
  }

  // Create Student 
  private createStudent() {
    this.student = this.editStudent;
    this.student.Address = this.address;
    this.studentService.create(this.student)
      .pipe(first())
      .subscribe(result => {
        if (result) {
          this.studentList.push(result);
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.studentList);
        }  
      },
      err=>{
        if(err)
        this.alertService.genericAlertMsg("error",err);
      })
      .add(() => this.loading = false);
  }
// Update Student
  private updateStudent() {
    this.editStudent.Address = this.address;
    this.studentService.update(this.editStudent)
      .pipe(first()).subscribe(result => {
        if (result) {
          this.student = this.editStudent;
          let x = this.studentList.find(x => x.Id === this.student.Id)
          let index = this.studentList.indexOf(x!)
          this.studentList[index] = this.student;
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.studentList);
        }
        else
          this.alertService.errorResponseFromDataBase();
      },
      err=>{
        if(err)
        this.alertService.genericAlertMsg("error",err);
      })
      .add(() => this.loading = false);
  }
// Set choosen group
  choosenGroup(event: string) {
    this.editStudent.Group_Id = event;
  }

  ngOnDestroy() {
    if (this.groupListSubscription)
      this.groupListSubscription.unsubscribe();
  }

}
