import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Student } from 'src/services/models/student';
import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { StudentService } from 'src/services/WebApiService/student.service';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { Group } from 'src/services/models/group';
import { TokenStorageService } from '../../../shared/helperServices/token-storage.service';
export interface SaleData {
  name: string,
  value: number;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  paginator: any;
  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    private facultyService: FacultyService,
    private courseService: CourseService,
    private tokenStorage: TokenStorageService) { }
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  totalFaculties: number;
  totalCourses: number;
  totalStudentsInClass: number = 5;
  groupList: Group[] = [];
  groupListSubscription!: Subscription;
  saleData: SaleData[] = [];
  update$: Subject<any> = new Subject();
  //saleData:SaleData[];

  ngOnInit(): void {
    this.getNumberOfStudents();
    this.getNumberOfTeachers();
    this.getNumberOfGroups();
    this.getNumberOfFaculties();
    this.getNumberOfCourses();
    this.getGroups();
  }

  private getGroups() {
    this.groupListSubscription = timer(0).pipe(switchMap(() => this.groupService.getAllGroups())).subscribe((list: Group[]) => {
      this.groupList = list;
      console.log(this.groupList);
      this.setChartLabels(this.groupList);

    });
  }
  private setChartLabels(groups: Group[]) {
    for (let group of groups) {
      this.studentService.getNumberOfStudentsInClass(group.GroupNumber).subscribe(res => {
        if (res !== null) {
          this.totalStudentsInClass = res;
          this.saleData = [
            ...this.saleData,
            {
              name: group.GroupNumber,
              value: this.totalStudentsInClass
            },
          ];
        }
      });
    }

  }
  getNumberOfStudents() {
    this.studentService.getNumberOfStudents().subscribe(res => {
      if (res !== null) {
        this.totalStudents = res;
      }
    });

  }

  getNumberOfTeachers() {
    this.teacherService.getNumberOfTeachers().subscribe(res => {
      if (res !== null) {
        this.totalTeachers = res;
      }
    });

  }
  getNumberOfCourses() {
    this.courseService.getNumberOfCourses().subscribe(res => {
      if (res !== null) {
        this.totalCourses = res;
      }
    });

  }
  getNumberOfGroups() {
    this.groupService.getNumberOfGroups().subscribe(res => {
      if (res !== null) {
        this.totalGroups = res;
      }
    });

  }
  getNumberOfFaculties() {
    this.facultyService.getNumberOfFaculties().subscribe(res => {
      if (res !== null) {
        this.totalFaculties = res;
      }
    });

  }


}





