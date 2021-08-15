import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/services/WebApiService/course.service';
import { Course } from 'src/services/models/course';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { Faculty } from 'src/services/models/faculty';
import { ReportService } from 'src/services/WebApiService/report.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { Group } from 'src/services/models/group';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
isAverage=false;
isCourse=false;
isFaculty=false;
isGroup=false;

course:string;
faculty:any;
group:any;
loading:false;
courseList:string[];
groupList:Group[];
facultyList:Faculty[];
  constructor(private courseService:CourseService,
            private groupService:GroupService,
             private reportService:ReportService,
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
    if(category.value == 'groups')
    {
     this.groupService.getAllGroups().subscribe(res=>{
       this.isGroup=true;
        this.groupList=res;
     })
    }
    }
    choosenGroup(faculty:any)
    {
      //this.isCourse=true;
      this.courseService.getCoursesByFaculty(faculty.value.FacultyName).subscribe(res=>{
        if(res)
        this.courseList=res;
      })
    }

    onSubmit()
    {
      console.log(this.course);
      
          this.reportService.getAverageByCourse(this.faculty.Id,this.course).subscribe(res=>{
              if(res)
              {
                console.log(res);
              }
          })
        }
  }

