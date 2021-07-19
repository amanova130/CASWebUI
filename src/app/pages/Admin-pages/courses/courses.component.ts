import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';

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
  courseData: Course={
    Id: "",
  };
  @ViewChild('form') form!: any;
  submitted: boolean;

  constructor( 
    private courseService: CourseService, 
    private alertService: AlertService, 
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private uploadFileService: UploadFileService
     ) {}
  
  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
   this.getCourses()
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

  setCourse(course?: Course)
  {
    if(course===undefined)
    {
      this.isAddMode=true;
    }
    else{
      this.courseData=course;
      this.isAddMode=false;
    } 
  }

  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.uploadFileService.uploadImage(formData).pipe(first())
    .subscribe(result => {
      if(result)
      this.courseData.Image=Object.values(result).toString();
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

  onSubmit()
  {
      this.isLoading = true;
      if(this.form.valid)
      {
        this.submitted = true;
        if (this.isAddMode) this.createCourse();
        else this.updateCourse();
      }
      else {
        this.isLoading = false;
      }
  }


  private createCourse(){
    this.courseService.create(this.courseData)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.courseList.push(result);
          console.log("Result:" +result);
          this.dataSource = new MatTableDataSource(this.courseList);
          this.alertService.openAlertMsg('success', 'Added a new Course profile');
        }  
        else
        this.alertService.openAlertMsg('error', 'Something went wrong, please try again');
    })
    .add(() => this.isLoading = false);
    this.courseData=null;
  }

  private updateCourse()
  {
    this.courseService.update(this.courseData)
    .pipe(first()).subscribe((result) => {
        if(result)
        {
          let x = this.courseList.find(x => x.Id === this.courseData.Id)
          let index = this.courseList.indexOf(x!)
          this.courseList[index] = this.courseData;
          this.alertService.openAlertMsg('success', 'Course Updated Successfully') 
        }
        else
        this.alertService.openAlertMsg('error', 'Cannot Update a course data, please try again');
    })
    .add(() => this.isLoading = false);
  }

  deleteCourse(id: string){
    if(id!==null || id!==undefined){
      this.courseService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.courseList = this.courseList.filter(item => item.Id !== id);
          this.dataSource = new MatTableDataSource(this.courseList);
          this.obs = this.dataSource.connect();
          this.alertService.openAlertMsg('success', 'Record was deleted successfully');
        }
      
      });
    }
  }
  refresh(){
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

