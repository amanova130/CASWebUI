import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { locale } from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { AddEditCourseComponent } from './add-edit-course/add-edit-course.component';
import { TokenStorageService } from '../../helperServices/token-storage.service';
import { Admin } from '../../../../services/models/admin';
import { Role } from '../../pipes-and-enum/roleEnum';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  isAddMode: boolean;
  isLoading=true;
  obs: Observable<any>;
  courseListSubscription: Subscription;
  courseList: Course[];
  dataSource!: MatTableDataSource<Course>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  course: Course={
    Id: "",
  };
  @ViewChild('form') form!: any;
  submitted: boolean;
  isAdmin = false; 
  isStudent = false;

  constructor( 
    private courseService: CourseService, 
    private alertService: AlertService, 
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService
     ) {}
  
  ngOnInit(): void {
    const loggedUser = this.tokenStorage.getUser();
    if(loggedUser.Role === Role.Admin)
    {
      this.isAdmin = true;
      this.getCourses();
    } 
    else
    {
      this.isLoading=false;
      this.isStudent = true;
    }
     
    this.changeDetectorRef.detectChanges();
  
  }

  private getCourses(){
    this.courseListSubscription = timer(0, 60000).pipe(switchMap(()=> this.courseService.getAllCourses())).subscribe((list: Course[])=>
    {
      this.courseList = list;
      this.dataSource=new MatTableDataSource(this.courseList);
      this.dataSource.paginator=this.paginator;
      this.obs = this.dataSource.connect();
      this.isLoading=false;
    });
  }


  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.obs = this.dataSource.connect();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openAddEditModal(course: Course = {Id: ""} ){
    const ref = this.modalService.open(AddEditCourseComponent, { centered: true });
    ref.componentInstance.course = course;
    ref.componentInstance.courseList = this.courseList;
    ref.result.then((result) => {
      if(result !== 'Close click')
      {
        this.dataSource.data = result
        this.dataSource.paginator=this.paginator;
        this.obs = this.dataSource.connect();
      }
    });

  }

  openDeleteModal(course: Course = {Id: ""}){
    this.course.Id = course.Id;
    this.course.CourseName = course.CourseName;
  }

  deleteCourse(id: string){
    if(id!==null || id!==undefined){
      this.courseService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.courseList = this.courseList.filter(item => item.Id !== id);
          this.dataSource.data = this.courseList;
          this.obs = this.dataSource.connect();
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }
  refresh(){
    if(this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
    this.getCourses();
  }

  ngOnDestroy()
  {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
    if(this.courseListSubscription)
      this.courseListSubscription.unsubscribe();
  }

}

