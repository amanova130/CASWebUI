import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { Faculty } from 'src/services/models/faculty';
import { CourseService } from 'src/services/WebApi/course.service';
import { FacultyService } from 'src/services/WebApi/faculty.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  isAddMode: boolean;
  isLoading: boolean;
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

  constructor( private courseService: CourseService, private alertService: AlertService ) {}
  
  ngOnInit(): void {
   this.getCourses()
  }

  private getCourses(){
    this.courseListSubscription = timer(0, 60000).pipe(switchMap(()=> this.courseService.getAllCourses())).subscribe((list: Course[])=>
    {
      this.courseList = list;
      this.dataSource=new MatTableDataSource(this.courseList);
      this.dataSource.paginator=this.paginator;
     // console.log(this.courseList);

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
  onSubmit()
  {
    this.alertService.clear();
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
    console.log(this.courseData);
  }

  private createCourse(){
    this.courseService.create(this.courseData)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.courseList.push(result);
            this.alertService.success('Added a new Course profile', { keepAfterRouteChange: true });
        }  
        else
            this.alertService.error('Cannot add a new Course');
    })
    .add(() => this.isLoading = false);
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
            this.alertService.success('course data updated', { keepAfterRouteChange: true });
        }
        else
            this.alertService.error('Cannot Update a course data, please try again');
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
          this.alertService.success("Course deleted successfully!");
          console.log('Course deleted successfully!');
        }
      
      });
    }
  }

  refresh(){
    this.getCourses();
  }
  ngOnDestroy()
  {
    this.courseListSubscription.unsubscribe();
  }

}


