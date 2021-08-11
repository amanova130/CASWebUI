import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Observer } from 'rxjs';
import { Student } from 'src/services/models/student';
import { User } from '../../../../services/models/user';
import { TokenStorageService } from '../../../shared/helperServices/token-storage.service';
import { StudentService } from '../../../../services/WebApiService/student.service';
import { GroupService } from '../../../../services/WebApiService/group.service';
import { TeacherService } from '../../../../services/WebApiService/teacher.service';
import { CourseService } from '../../../../services/WebApiService/course.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AdminService } from '../../../../services/WebApiService/admin.service';
import { MatPaginator } from '@angular/material/paginator';

export interface ContactTab {
  label: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  isLoading = false;
  obs: Observable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  contactList: any=[];
  dataSource!: MatTableDataSource<any>;
  asyncTabs: Observable<ContactTab[]>;
  loggedUser: User;
  groupNumber: string;
  colorValue: string;

  constructor(private tokenStorage: TokenStorageService, private studentService: StudentService,
     private teacherService: TeacherService, 
     private adminService: AdminService)
      {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
    this.asyncTabs = new Observable((observer: Observer<ContactTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Student'},
          {label: 'Teacher'},
          {label: 'Admin'},
        ]);
      }, 1000);
    });
  }
  ngOnInit(): void {
    this.getStudentsByGroup(this.groupNumber);
  }
  changeContactList(tab: MatTabChangeEvent) {
    if(tab.tab.textLabel.includes('Student'))
    {
      this.getStudentsByGroup(this.groupNumber);
    }
    else if(tab.tab.textLabel.includes('Teacher'))
    {
      this.getTeacherList();
    }
    else if(tab.tab.textLabel.includes('Admin'))
    {
      this.getAdminList();
    }
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  getTeacherList(){
    this.isLoading = true;
    this.contactList=[];
    this.teacherService.getAllTeachers().subscribe( result =>{
      if(result)
        {
          this.contactList = result;
          this.dataSource=new MatTableDataSource(this.contactList);
          this.dataSource.paginator=this.paginator;
          this.obs = this.dataSource.connect();
          this.isLoading = false;
        }
    });
  }
  getStudentsByGroup(groupNumber: string){
    this.isLoading = true;
    this.contactList=[];
    this.studentService.getStudentsByGroup(groupNumber).subscribe( result =>{
      if(result)
        {
          this.contactList = result;
          this.dataSource=new MatTableDataSource(this.contactList);
          this.dataSource.paginator=this.paginator;
          this.obs = this.dataSource.connect();
          this.isLoading = false;
        }
    });
  }

  getAdminList(){
    this.isLoading = true;
    this.contactList=[];
    this.adminService.getAllAdmins().subscribe(result =>{
      if(result)
      {
        this.contactList = result;
        this.dataSource=new MatTableDataSource(this.contactList);
        this.dataSource.paginator=this.paginator;
        this.obs = this.dataSource.connect();
        this.isLoading = false;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.obs = this.dataSource.connect();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(){
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }
}
