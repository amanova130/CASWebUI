import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { StudentService } from 'src/services/WebApiService/student.service';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { Group } from 'src/services/models/group';
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
    private courseService: CourseService) { }
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

  ngOnInit(): void {
    this.getNumberOfStudents();
    this.getNumberOfTeachers();
    this.getNumberOfGroups();
    this.getNumberOfFaculties();
    this.getNumberOfCourses();
    this.getGroups();
  }
  // Get Groups to set charts data
  private getGroups() {
    this.groupListSubscription = timer(0).pipe(switchMap(() => this.groupService.getAllGroups())).subscribe((list: Group[]) => {
      this.groupList = list;
      this.setChartLabels(this.groupList);
    });
  }

  // Set chart labels
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

  // Get count of students
  getNumberOfStudents() {
    this.studentService.getNumberOfStudents().subscribe(res => {
      if (res !== null) {
        this.totalStudents = res;
      }
    });
  }
  // Get Number of Teachers
  getNumberOfTeachers() {
    this.teacherService.getNumberOfTeachers().subscribe(res => {
      if (res !== null) {
        this.totalTeachers = res;
      }
    });
  }
  // Get Number of Courses
  getNumberOfCourses() {
    this.courseService.getNumberOfCourses().subscribe(res => {
      if (res !== null) {
        this.totalCourses = res;
      }
    });
  }
  // Get Number of Groups
  getNumberOfGroups() {
    this.groupService.getNumberOfGroups().subscribe(res => {
      if (res !== null) {
        this.totalGroups = res;
      }
    });
  }
  // Get Number of Faculties
  getNumberOfFaculties() {
    this.facultyService.getNumberOfFaculties().subscribe(res => {
      if (res !== null) {
        this.totalFaculties = res;
      }
    });
  }


}





