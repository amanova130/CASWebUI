import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { User } from 'src/services/models/user';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { StudentService } from 'src/services/WebApiService/student.service';
import { TeacherService } from 'src/services/WebApiService/teacher.service';

@Component({
  selector: 'app-exam-grades',
  templateUrl: './exam-grades.component.html',
  styleUrls: ['./exam-grades.component.scss']
})
export class ExamGradesComponent implements OnInit {
  isLoading = false;
  obs: Observable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  contactList: any=[];
  dataSource!: MatTableDataSource<any>;
  asyncTabs: Observable<any>;
  loggedUser: User;
  groupNumber: string;
  colorValue: string;

  constructor(private tokenStorage: TokenStorageService, private studentService: StudentService,
     private teacherService: TeacherService, 
     private adminService: AdminService)
      {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
    this.asyncTabs = new Observable((observer: Observer<any>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Exams'},
          {label: 'Average'},
        ]);
      }, 1000);
    });
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.obs = this.dataSource.connect();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
