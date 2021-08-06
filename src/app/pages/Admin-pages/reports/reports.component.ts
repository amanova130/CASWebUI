import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/services/WebApiService/course.service';
import { Course } from 'src/services/models/course';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { Faculty } from 'src/services/models/faculty';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
isAverage=false;
isCourse=false;
isFaculty=false;
course:string;
faculty:any;
loading:false;
courseList:string[];
facultyList:Faculty[];
  constructor(private courseService:CourseService,
             private facultyService:FacultyService) { }

  ngOnInit(): void {
  }
  choosenReport(report:any)
  {
    console.log(report);
    if(report.value == 'average')
      this.isAverage=true;
  }

  choosenCategory(category:any)
  {
    console.log(category);
    if(category.value == 'faculties')
    {
      this.isFaculty=true;
     //this.isCourse=true;
      this.facultyService.getAllFaculties().subscribe(res=>{
        if(res)
        this.facultyList=res;
      })
          }
    }
    choosenFaculty(faculty:any)
    {
      this.isCourse=true;
      this.courseService.getCoursesByFaculty(faculty.value.FacultyName).subscribe(res=>{
        if(res)
        this.courseList=res;
      })
    }

    onSubmit()
    {
      console.log(this.course);
      
          this.facultyService.getAverageByCourse(this.faculty.Id,this.course).subscribe(res=>{
              if(res)
              {
                console.log(res);
              }
          })
        }
  }

