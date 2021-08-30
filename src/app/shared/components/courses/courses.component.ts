import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { AddEditCourseComponent } from './add-edit-course/add-edit-course.component';
import { TokenStorageService } from '../../helperServices/token-storage.service';
import { Role } from '../../pipes-and-enum/roleEnum';
import { User } from 'src/services/models/user';
import { Group } from 'src/services/models/group';
import { Student } from 'src/services/models/student';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  isAddMode: boolean;
  isLoading = false;
  obs: Observable<any>;
  courseListSubscription: Subscription;
  courseList: Course[];
  groupList: Group[];
  groupNumber: string;
  loggedStudent: Student;
  dataSource!: MatTableDataSource<Course>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  course: Course = {
    Id: "",
  };
  @ViewChild('form') form!: any;
  submitted: boolean;
  isAdmin = false;
  isStudent = false;
  loggedUser: User;

  constructor(
    private courseService: CourseService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService) {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
  }

  ngOnInit(): void {
    this.isLoading = true;
    if (this.loggedUser.Role === Role.Admin) {
      this.isAdmin = true;
      this.getCourses();
    }
    else {
      this.isStudent = true;
      this.getCourseByGroupName();
    }
  }

  // Get Courses
  private getCourses() {
    this.courseListSubscription = timer(0, 60000).pipe(switchMap(() => this.courseService.getAllCourses())).subscribe((list: Course[]) => {
      this.courseList = list;
      this.dataSource = new MatTableDataSource(this.courseList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      this.isLoading = false;
    },
      error => {
        this.alertService.genericAlertMsg("error", error);
        this.isLoading = false;
      });
  }
// Get Courses by Group name
  private getCourseByGroupName() {
    this.courseService.getCoursesByGroupName(this.groupNumber).subscribe(result => {
      if (result) {
        this.courseList = result;
        this.dataSource = new MatTableDataSource(this.courseList);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
        this.isLoading = false;
      }
    },
    error => {
      this.alertService.genericAlertMsg("error", error);
      this.isLoading = false;
    });
  }

  // Create Image Path
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
// Filter by char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.obs = this.dataSource.connect();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
// Open Add or Edit Modal window
  openAddEditModal(course: Course = { Id: "" }) {
    const ref = this.modalService.open(AddEditCourseComponent, { centered: true });
    ref.componentInstance.course = course;
    ref.componentInstance.courseList = this.courseList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }
    });
  }

  openDeleteModal(course: Course = { Id: "" }) {
    this.course.Id = course.Id;
    this.course.CourseName = course.CourseName;
  }
// Delete Course
  deleteCourse(id: string) {
    if (id !== null || id !== undefined) {
      this.courseService.deleteById(id).subscribe(res => {
        if (res) {
          this.courseList = this.courseList.filter(item => item.Id !== id);
          this.dataSource.data = this.courseList;
          this.obs = this.dataSource.connect();
          this.alertService.successResponseFromDataBase();
        }
      },
      error => {
        this.alertService.genericAlertMsg("error", error);
      });
    }
  }
  //Refresh
  refresh() {
    if (this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
    this.getCourses();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    if (this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
  }

}

